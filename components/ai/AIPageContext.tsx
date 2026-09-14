"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

export type AIPageContextData = {
  pageName: string;
  pageDescription: string;
  route: string;
  entityId?: string;
  details?: Record<string, unknown>;
};

type AIPageContextValue = {
  context: AIPageContextData;
  setPageContext: (context: Partial<AIPageContextData>) => void;
  clearPageContext: () => void;
};

const AIPageContext = createContext<
  AIPageContextValue | undefined
>(undefined);

function getDefaultPageContext(
  pathname: string
): AIPageContextData {
  if (pathname === "/dashboard") {
    return {
      pageName: "Dashboard",
      pageDescription:
        "The user is viewing the NexaFlow AI dashboard with workspace activity, workflow health, leads, tasks, and automation overview.",
      route: pathname,
    };
  }

  if (pathname === "/workflows") {
    return {
      pageName: "Workflows",
      pageDescription:
        "The user is viewing the NexaFlow AI workflows page where workflows can be created, managed, monitored, and automated.",
      route: pathname,
    };
  }

  if (pathname.startsWith("/workflows/")) {
    const entityId = pathname.split("/")[2];

    return {
      pageName: "Workflow",
      pageDescription:
        "The user is viewing a specific NexaFlow AI workflow. Help with workflow configuration, steps, triggers, actions, conditions, status, and improvements.",
      route: pathname,
      entityId,
    };
  }

  if (pathname === "/conversations") {
    return {
      pageName: "AI Conversations",
      pageDescription:
        "The user is viewing the NexaFlow AI conversations workspace. Help with business questions, workflow planning, automation, leads, and tasks.",
      route: pathname,
    };
  }

  if (pathname === "/leads") {
    return {
      pageName: "Leads",
      pageDescription:
        "The user is viewing the NexaFlow AI leads workspace. Help analyze, qualify, organize, and follow up with leads.",
      route: pathname,
    };
  }

  if (pathname === "/tasks") {
    return {
      pageName: "Tasks",
      pageDescription:
        "The user is viewing the NexaFlow AI tasks workspace. Help organize, prioritize, automate, and manage tasks.",
      route: pathname,
    };
  }

  if (pathname === "/analytics") {
    return {
      pageName: "Analytics",
      pageDescription:
        "The user is viewing NexaFlow AI analytics. Help interpret workflow performance, activity, usage, leads, tasks, and business metrics.",
      route: pathname,
    };
  }

  if (pathname === "/settings") {
    return {
      pageName: "Settings",
      pageDescription:
        "The user is viewing NexaFlow AI settings. Help with workspace configuration, account settings, preferences, and automation options.",
      route: pathname,
    };
  }

  return {
    pageName: "NexaFlow AI",
    pageDescription:
      "The user is using the NexaFlow AI business automation platform.",
    route: pathname,
  };
}

export function AIPageContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const defaultContext = useMemo(
    () => getDefaultPageContext(pathname),
    [pathname]
  );

  const [customContext, setCustomContext] =
    useState<Partial<AIPageContextData>>({});

  const context = useMemo<AIPageContextData>(
    () => ({
      ...defaultContext,
      ...customContext,
      route: pathname,
    }),
    [defaultContext, customContext, pathname]
  );

  const value = useMemo<AIPageContextValue>(
    () => ({
      context,

      setPageContext: (
        newContext: Partial<AIPageContextData>
      ) => {
        setCustomContext((current) => ({
          ...current,
          ...newContext,
        }));
      },

      clearPageContext: () => {
        setCustomContext({});
      },
    }),
    [context]
  );

  return (
    <AIPageContext.Provider value={value}>
      {children}
    </AIPageContext.Provider>
  );
}

export function useAIPageContext() {
  const context = useContext(AIPageContext);

  if (!context) {
    throw new Error(
      "useAIPageContext must be used inside AIPageContextProvider"
    );
  }

  return context;
}