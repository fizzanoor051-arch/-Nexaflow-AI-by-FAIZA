import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB_NAME =
  process.env.MONGODB_DB ||
  "portfolio_analytics";

const ALLOWED_PROJECTS = {
  "nexaflow-ai": {
    name: "NexaFlow AI",
    origins: [
      "https://nexaflow-ai-sepia.vercel.app",
    ],
  },

  luxora: {
    name: "Luxora Store",
    origins: [
      "https://luxora-zuq4.vercel.app",
    ],
  },

  shopsphere: {
    name: "ShopSphere",
    origins: [
      "https://shopsphere-ecommerce-beta.vercel.app",
    ],
  },

  medicare: {
    name: "Medicare",
    origins: [
      "https://classy-vacherin-7a04fc.netlify.app",
    ],
  },
} as const;

function getAllowedOrigin(
  request: NextRequest,
  projectSlug: string
) {
  const origin =
    request.headers.get("origin") || "";

  const project =
    ALLOWED_PROJECTS[
      projectSlug as keyof typeof ALLOWED_PROJECTS
    ];

  if (
    project &&
    project.origins.includes(
      origin as never
    )
  ) {
    return origin;
  }

  return "";
}

function createCorsHeaders(
  origin: string
) {
  const headers = new Headers();

  if (origin) {
    headers.set(
      "Access-Control-Allow-Origin",
      origin
    );

    headers.set(
      "Access-Control-Allow-Methods",
      "POST, OPTIONS"
    );

    headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type"
    );

    headers.set(
      "Access-Control-Allow-Credentials",
      "true"
    );

    headers.set(
      "Vary",
      "Origin"
    );
  }

  return headers;
}

export async function OPTIONS(
  request: NextRequest
) {
  const origin =
    request.headers.get("origin") || "";

  return new NextResponse(null, {
    status: 204,
    headers:
      createCorsHeaders(origin),
  });
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const {
      visitorId,
      projectName,
      projectSlug,
      referrer,
      path,
      latitude,
      longitude,
      accuracy,
    } = body;

    if (
      typeof visitorId !== "string" ||
      !visitorId.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid visitor ID.",
        },
        { status: 400 }
      );
    }

    if (
      typeof projectSlug !== "string" ||
      !projectSlug.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Project slug is required.",
        },
        { status: 400 }
      );
    }

    const project =
      ALLOWED_PROJECTS[
        projectSlug as keyof typeof ALLOWED_PROJECTS
      ];

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unknown project.",
        },
        { status: 400 }
      );
    }

    const origin =
      request.headers.get("origin") || "";

    const allowedOrigin =
      getAllowedOrigin(
        request,
        projectSlug
      );

    /*
     * Requests coming from registered
     * project domains are allowed.
     *
     * Requests without an Origin header
     * can also be accepted.
     */
    if (
      origin &&
      !allowedOrigin
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Origin not allowed.",
        },
        {
          status: 403,
        }
      );
    }

    const finalProjectName =
      project.name ||
      (typeof projectName ===
      "string"
        ? projectName
        : projectSlug);

    const latitudeNumber =
      typeof latitude === "number"
        ? latitude
        : null;

    const longitudeNumber =
      typeof longitude === "number"
        ? longitude
        : null;

    const accuracyNumber =
      typeof accuracy === "number"
        ? accuracy
        : null;

    /*
     * Server-side visitor information.
     */
    const userAgent =
      request.headers.get(
        "user-agent"
      ) || "";

    const ip =
      request.headers
        .get("x-forwarded-for")
        ?.split(",")[0]
        ?.trim() ||
      request.headers.get(
        "x-real-ip"
      ) ||
      "";

    /*
     * Vercel IP location fallback.
     */
    const country =
      request.headers.get(
        "x-vercel-ip-country"
      ) || "";

    const region =
      request.headers.get(
        "x-vercel-ip-country-region"
      ) || "";

    const city =
      request.headers.get(
        "x-vercel-ip-city"
      ) || "";

    const sourceReferrer =
      typeof referrer === "string"
        ? referrer.slice(0, 2000)
        : "";

    const pagePath =
      typeof path === "string"
        ? path.slice(0, 500)
        : "/";

    const now =
      new Date();

    const client =
      await clientPromise;

    const db =
      client.db(DB_NAME);

    /*
     * Store the external project visit
     * in the same analytics_events collection
     * used by the Secret Admin dashboard.
     */
    await db
      .collection("analytics_events")
      .insertOne({
        type: "project_click",

        projectName:
          finalProjectName,

        projectSlug,

        source:
          "external_project_visit",

        visitorId:
          visitorId.trim(),

        path:
          pagePath,

        referrer:
          sourceReferrer,

        userAgent,

        ip,

        country,

        region,

        city,

        latitude:
          latitudeNumber,

        longitude:
          longitudeNumber,

        locationAccuracy:
          accuracyNumber,

        createdAt:
          now,
      });

    /*
     * Maintain a project-specific visitor record.
     */
    await db
      .collection("analytics_visitors")
      .updateOne(
        {
          visitorId:
            visitorId.trim(),

          projectSlug,
        },
        {
          $set: {
            projectName:
              finalProjectName,

            projectSlug,

            lastSeenAt:
              now,

            userAgent,

            ip,

            country,

            region,

            city,

            ...(latitudeNumber !==
            null
              ? {
                  latitude:
                    latitudeNumber,
                }
              : {}),

            ...(longitudeNumber !==
            null
              ? {
                  longitude:
                    longitudeNumber,
                }
              : {}),

            ...(accuracyNumber !==
            null
              ? {
                  locationAccuracy:
                    accuracyNumber,
                }
              : {}),
          },

          $setOnInsert: {
            visitorId:
              visitorId.trim(),

            firstSeenAt:
              now,

            firstReferrer:
              sourceReferrer,

            firstPath:
              pagePath,
          },

          $inc: {
            projectVisits: 1,
          },
        },
        {
          upsert: true,
        }
      );

    return NextResponse.json(
      {
        success: true,
        project:
          finalProjectName,
      },
      {
        status: 200,
        headers:
          createCorsHeaders(
            allowedOrigin
          ),
      }
    );
  } catch (error) {
    console.error(
      "External project analytics error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Project analytics failed.",
      },
      {
        status: 500,
      }
    );
  }
}