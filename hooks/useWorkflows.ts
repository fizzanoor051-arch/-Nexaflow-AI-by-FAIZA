"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  CreateWorkflowData,
  UpdateWorkflowData,
  Workflow,
} from "@/types/workflow";

interface UseWorkflowsReturn {
  workflows: Workflow[];
  loading: boolean;
  error: string | null;
  fetchWorkflows: () => Promise<void>;
  createWorkflow: (
    data: CreateWorkflowData
  ) => Promise<Workflow | null>;
  updateWorkflow: (
    id: string,
    data: UpdateWorkflowData
  ) => Promise<Workflow | null>;
  deleteWorkflow: (id: string) => Promise<boolean>;
}

export function useWorkflows(): UseWorkflowsReturn {
  const [workflows, setWorkflows] = useState<Workflow[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkflows = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/workflows");

      if (!response.ok) {
        throw new Error("Failed to fetch workflows.");
      }

      const data = await response.json();

      setWorkflows(data.workflows ?? data ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch workflows."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createWorkflow = useCallback(
    async (
      data: CreateWorkflowData
    ): Promise<Workflow | null> => {
      try {
        setError(null);

        const response = await fetch("/api/workflows", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to create workflow.");
        }

        const result = await response.json();

        const workflow: Workflow =
          result.workflow ?? result;

        setWorkflows((previous) => [
          workflow,
          ...previous,
        ]);

        return workflow;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to create workflow."
        );

        return null;
      }
    },
    []
  );

  const updateWorkflow = useCallback(
    async (
      id: string,
      data: UpdateWorkflowData
    ): Promise<Workflow | null> => {
      try {
        setError(null);

        const response = await fetch(
          `/api/workflows/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update workflow.");
        }

        const result = await response.json();

        const updatedWorkflow: Workflow =
          result.workflow ?? result;

        setWorkflows((previous) =>
          previous.map((workflow) =>
            workflow.id === id
              ? updatedWorkflow
              : workflow
          )
        );

        return updatedWorkflow;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update workflow."
        );

        return null;
      }
    },
    []
  );

  const deleteWorkflow = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);

        const response = await fetch(
          `/api/workflows/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete workflow.");
        }

        setWorkflows((previous) =>
          previous.filter(
            (workflow) => workflow.id !== id
          )
        );

        return true;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete workflow."
        );

        return false;
      }
    },
    []
  );

  useEffect(() => {
    void fetchWorkflows();
  }, [fetchWorkflows]);

  return {
    workflows,
    loading,
    error,
    fetchWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
  };
}