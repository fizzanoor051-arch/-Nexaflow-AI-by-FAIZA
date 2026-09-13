"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  CreateTaskData,
  Task,
  UpdateTaskData,
} from "@/types/task";

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (
    data: CreateTaskData
  ) => Promise<Task | null>;
  updateTask: (
    id: string,
    data: UpdateTaskData
  ) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tasks");

      if (!response.ok) {
        throw new Error("Failed to fetch tasks.");
      }

      const data = await response.json();

      setTasks(data.tasks ?? data ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch tasks."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(
    async (
      data: CreateTaskData
    ): Promise<Task | null> => {
      try {
        setError(null);

        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to create task.");
        }

        const result = await response.json();

        const task: Task = result.task ?? result;

        setTasks((previous) => [task, ...previous]);

        return task;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to create task."
        );

        return null;
      }
    },
    []
  );

  const updateTask = useCallback(
    async (
      id: string,
      data: UpdateTaskData
    ): Promise<Task | null> => {
      try {
        setError(null);

        const response = await fetch(`/api/tasks/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to update task.");
        }

        const result = await response.json();

        const updatedTask: Task =
          result.task ?? result;

        setTasks((previous) =>
          previous.map((task) =>
            task.id === id ? updatedTask : task
          )
        );

        return updatedTask;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update task."
        );

        return null;
      }
    },
    []
  );

  const deleteTask = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);

        const response = await fetch(`/api/tasks/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete task.");
        }

        setTasks((previous) =>
          previous.filter((task) => task.id !== id)
        );

        return true;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete task."
        );

        return false;
      }
    },
    []
  );

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}