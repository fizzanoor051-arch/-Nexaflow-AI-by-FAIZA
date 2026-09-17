"use client";

import { useEffect } from "react";

const ANALYTICS_URL =
  "https://faiza-noor10.vercel.app/api/analyticsa/project-visit";

const VISITOR_ID_KEY =
  "luxora_analytics_visitor_id";

const SESSION_KEY =
  "luxora_analytics_visit_tracked";

interface ProjectVisitTrackerProps {
  projectName: string;
  projectSlug: string;
}

function getVisitorId(): string | null {
  try {
    let visitorId =
      localStorage.getItem(
        VISITOR_ID_KEY
      );

    if (!visitorId) {
      visitorId =
        crypto.randomUUID();

      localStorage.setItem(
        VISITOR_ID_KEY,
        visitorId
      );
    }

    return visitorId;
  } catch {
    return null;
  }
}

function sendProjectVisit(
  visitorId: string,
  projectName: string,
  projectSlug: string,
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  }
) {
  const payload = {
    visitorId,
    projectName,
    projectSlug,

    referrer:
      document.referrer || "",

    path:
      window.location.pathname,

    ...(location
      ? {
          latitude:
            location.latitude,

          longitude:
            location.longitude,

          accuracy:
            location.accuracy,
        }
      : {}),
  };

  fetch(
    ANALYTICS_URL,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        payload
      ),

      keepalive: true,
    }
  ).catch((error) => {
    console.error(
      "Luxora project analytics failed:",
      error
    );
  });
}

export default function ProjectVisitTracker({
  projectName,
  projectSlug,
}: ProjectVisitTrackerProps) {
  useEffect(() => {
    try {
      const visitorId =
        getVisitorId();

      if (!visitorId) {
        return;
      }

      const alreadyTracked =
        sessionStorage.getItem(
          SESSION_KEY
        );

      if (alreadyTracked) {
        return;
      }

      sessionStorage.setItem(
        SESSION_KEY,
        "true"
      );

      if (
        "geolocation" in
        navigator
      ) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            sendProjectVisit(
              visitorId,
              projectName,
              projectSlug,
              {
                latitude:
                  position.coords
                    .latitude,

                longitude:
                  position.coords
                    .longitude,

                accuracy:
                  position.coords
                    .accuracy,
              }
            );
          },

          () => {
            sendProjectVisit(
              visitorId,
              projectName,
              projectSlug
            );
          },

          {
            enableHighAccuracy:
              true,

            timeout: 10000,

            maximumAge: 0,
          }
        );
      } else {
        sendProjectVisit(
          visitorId,
          projectName,
          projectSlug
        );
      }
    } catch (error) {
      console.error(
        "Luxora project tracker error:",
        error
      );
    }
  }, [
    projectName,
    projectSlug,
  ]);

  return null;
}