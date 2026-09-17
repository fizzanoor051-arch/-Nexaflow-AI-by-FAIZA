import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB_NAME =
  process.env.MONGODB_DB ||
  "portfolio_analytics";

const PROJECT_URLS: Record<
  string,
  string
> = {
  "nexaflow-ai":
    "https://nexaflow-ai-sepia.vercel.app/",

  luxora:
    "https://luxora-zuq4.vercel.app/",

  shopsphere:
    "https://shopsphere-ecommerce-beta.vercel.app/",

  medicare:
    "https://classy-vacherin-7a04fc.netlify.app/",
};

function getStartDate(
  days: number
) {
  const date =
    new Date();

  date.setDate(
    date.getDate() - days
  );

  return date;
}

function isSecretAdminPath(
  path: unknown
) {
  return (
    typeof path === "string" &&
    /^\/secret-admin(?:\/|$)/.test(
      path
    )
  );
}

export async function GET(
  request: NextRequest
) {
  try {
    /*
     * Admin authentication
     */
    const adminCookie =
      request.cookies.get(
        "analytics_admin"
      )?.value;

    if (!adminCookie) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const client =
      await clientPromise;

    const db =
      client.db(DB_NAME);

    /*
     * Global analytics reset.
     *
     * Old MongoDB data remains untouched.
     * Events before the reset are simply
     * excluded from the dashboard.
     */
    const resetControl =
      await db
        .collection(
          "analytics_controls"
        )
        .findOne({
          key: "analytics_resets",
        });

    const globalResetDate =
      resetControl?.global
        ? new Date(
            resetControl.global
          )
        : null;

    const eventQuery: Record<
      string,
      unknown
    > = {
      path: {
        $not:
          /^\/secret-admin(?:\/|$)/,
      },
    };

    if (globalResetDate) {
      eventQuery.createdAt = {
        $gte:
          globalResetDate,
      };
    }

    /*
     * Load analytics events.
     */
    const events =
      await db
        .collection(
          "analytics_events"
        )
        .find(eventQuery)
        .sort({
          createdAt: -1,
        })
        .limit(5000)
        .toArray();

    /*
     * Remove any accidental admin-page
     * events before calculations.
     */
    const validEvents =
      events.filter(
        (event) =>
          !isSecretAdminPath(
            event.path
          )
      );

    /*
     * Date boundaries.
     */
    const now =
      new Date();

    const startToday =
      new Date(now);

    startToday.setHours(
      0,
      0,
      0,
      0
    );

    const start7Days =
      getStartDate(7);

    const start30Days =
      getStartDate(30);

    /*
     * Overview calculations.
     */
    let totalVisits = 0;
    let todayVisits = 0;
    let last7DaysVisits = 0;
    let last30DaysVisits = 0;
    let totalProjectClicks = 0;

    const uniqueVisitorIds =
      new Set<string>();

    /*
     * Project statistics.
     */
    const projectMap =
      new Map<
        string,
        {
          projectSlug: string;
          projectName: string;
          clicks: number;
          visitors: Set<string>;
        }
      >();

    /*
     * Referrer statistics.
     */
    const referrerMap =
      new Map<
        string,
        number
      >();

    /*
     * Recent activity.
     */
    const recentActivity =
      validEvents
        .slice(0, 50)
        .map(
          (event) => ({
            type:
              event.type ||
              "visit",

            visitorId:
              event.visitorId,

            path:
              event.path,

            projectSlug:
              event.projectSlug,

            projectName:
              event.projectName,

            projectUrl:
              event.projectSlug
                ? PROJECT_URLS[
                    event.projectSlug
                  ]
                : undefined,

            referrer:
              event.referrer ||
              "",

            createdAt:
              event.createdAt,
          })
        );

    /*
     * Process every event.
     */
    for (const event of validEvents) {
      const createdAt =
        event.createdAt
          ? new Date(
              event.createdAt
            )
          : null;

      if (!createdAt) {
        continue;
      }

      const visitorId =
        typeof event.visitorId ===
        "string"
          ? event.visitorId
          : "";

      /*
       * Normal portfolio visits.
       */
      if (
        event.type === "visit"
      ) {
        totalVisits++;

        if (visitorId) {
          uniqueVisitorIds.add(
            visitorId
          );
        }

        if (
          createdAt >=
          startToday
        ) {
          todayVisits++;
        }

        if (
          createdAt >=
          start7Days
        ) {
          last7DaysVisits++;
        }

        if (
          createdAt >=
          start30Days
        ) {
          last30DaysVisits++;
        }
      }

      /*
       * External project visits.
       *
       * ProjectVisitTracker sends
       * these as project_click events.
       */
      if (
        event.type ===
        "project_click"
      ) {
        totalProjectClicks++;

        const slug =
          typeof event.projectSlug ===
          "string"
            ? event.projectSlug
            : "unknown";

        const name =
          typeof event.projectName ===
          "string"
            ? event.projectName
            : slug;

        if (!projectMap.has(slug)) {
          projectMap.set(
            slug,
            {
              projectSlug:
                slug,

              projectName:
                name,

              clicks: 0,

              visitors:
                new Set<string>(),
            }
          );
        }

        const project =
          projectMap.get(slug)!;

        project.clicks++;

        if (visitorId) {
          project.visitors.add(
            visitorId
          );
        }
      }

      /*
       * Referrers.
       */
      const referrer =
        typeof event.referrer ===
        "string"
          ? event.referrer.trim()
          : "";

      if (referrer) {
        referrerMap.set(
          referrer,
          (referrerMap.get(
            referrer
          ) || 0) + 1
        );
      }
    }

    /*
     * Also include visitors from
     * analytics_visitors collection.
     *
     * This helps preserve location/GPS
     * information even when an event
     * does not contain all fields.
     */
    const visitors =
      await db
        .collection(
          "analytics_visitors"
        )
        .find({})
        .limit(5000)
        .toArray();

    /*
     * Existing visitor records can contribute
     * unique visitor IDs to the dashboard.
     */
    for (const visitor of visitors) {
      const visitorId =
        typeof visitor.visitorId ===
        "string"
          ? visitor.visitorId
          : "";

      if (!visitorId) {
        continue;
      }

      const firstSeenAt =
        visitor.firstSeenAt
          ? new Date(
              visitor.firstSeenAt
            )
          : null;

      if (
        firstSeenAt &&
        globalResetDate &&
        firstSeenAt <
          globalResetDate
      ) {
        continue;
      }

      uniqueVisitorIds.add(
        visitorId
      );
    }

    /*
     * Project output.
     */
    const projects =
      Array.from(
        projectMap.values()
      )
        .map(
          (project) => ({
            projectSlug:
              project.projectSlug,

            projectName:
              project.projectName,

            clicks:
              project.clicks,

            uniqueVisitors:
              project.visitors.size,

            projectUrl:
              PROJECT_URLS[
                project.projectSlug
              ] || "",
          })
        )
        .sort(
          (a, b) =>
            b.clicks -
            a.clicks
        );

    /*
     * Referrer output.
     */
    const referrers =
      Array.from(
        referrerMap.entries()
      )
        .map(
          ([
            referrer,
            visits,
          ]) => ({
            referrer,
            visits,
          })
        )
        .sort(
          (a, b) =>
            b.visits -
            a.visits
        )
        .slice(0, 30);

    /*
     * Overview.
     */
    const overview = {
      totalVisits,

      uniqueVisitors:
        uniqueVisitorIds.size,

      todayVisits,

      last7DaysVisits,

      last30DaysVisits,

      totalProjectClicks,
    };

    return NextResponse.json(
      {
        success: true,

        overview,

        projects,

        recentActivity,

        referrers,

        generatedAt:
          new Date().toISOString(),

        resetTimes: {
          global:
            globalResetDate
              ? globalResetDate.toISOString()
              : null,
        },
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "Analytics stats error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load analytics.",
      },
      {
        status: 500,
      }
    );
  }
}