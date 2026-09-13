"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  CreateLeadData,
  Lead,
  UpdateLeadData,
} from "@/types/lead";

interface UseLeadsReturn {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  fetchLeads: () => Promise<void>;
  createLead: (
    data: CreateLeadData
  ) => Promise<Lead | null>;
  updateLead: (
    id: string,
    data: UpdateLeadData
  ) => Promise<Lead | null>;
  deleteLead: (id: string) => Promise<boolean>;
}

export function useLeads(): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/leads");

      if (!response.ok) {
        throw new Error("Failed to fetch leads.");
      }

      const data = await response.json();

      setLeads(data.leads ?? data ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch leads."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createLead = useCallback(
    async (
      data: CreateLeadData
    ): Promise<Lead | null> => {
      try {
        setError(null);

        const response = await fetch("/api/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to create lead.");
        }

        const result = await response.json();

        const lead: Lead = result.lead ?? result;

        setLeads((previous) => [lead, ...previous]);

        return lead;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to create lead."
        );

        return null;
      }
    },
    []
  );

  const updateLead = useCallback(
    async (
      id: string,
      data: UpdateLeadData
    ): Promise<Lead | null> => {
      try {
        setError(null);

        const response = await fetch(`/api/leads/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to update lead.");
        }

        const result = await response.json();

        const updatedLead: Lead =
          result.lead ?? result;

        setLeads((previous) =>
          previous.map((lead) =>
            lead.id === id ? updatedLead : lead
          )
        );

        return updatedLead;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update lead."
        );

        return null;
      }
    },
    []
  );

  const deleteLead = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);

        const response = await fetch(`/api/leads/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete lead.");
        }

        setLeads((previous) =>
          previous.filter((lead) => lead.id !== id)
        );

        return true;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete lead."
        );

        return false;
      }
    },
    []
  );

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    loading,
    error,
    fetchLeads,
    createLead,
    updateLead,
    deleteLead,
  };
}