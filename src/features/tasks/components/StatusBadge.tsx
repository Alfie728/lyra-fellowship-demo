"use client";

import type { Task } from "~/types/task";
import { api } from "~/trpc/react";

const STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;

const statusColors: Record<string, string> = {
  TODO: "bg-gray-600 text-gray-100",
  IN_PROGRESS: "bg-blue-600 text-blue-100",
  DONE: "bg-green-600 text-green-100",
};

const statusLabels: Record<string, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

type StatusBadgeProps = Pick<Task, "id" | "status">;

export function StatusBadge({ id, status }: StatusBadgeProps) {
  const utils = api.useUtils();

  const updateStatus = api.task.update.useMutation({
    onSuccess: () => {
      void utils.task.getAll.invalidate();
      void utils.task.getById.invalidate({ id });
      void utils.project.getById.invalidate();
    },
  });

  return (
    <select
      value={status}
      onChange={(e) =>
        updateStatus.mutate({
          id,
          status: e.target.value as (typeof STATUSES)[number],
        })
      }
      disabled={updateStatus.isPending}
      className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium ${statusColors[status] ?? "bg-gray-600"} border-none outline-none`}
    >
      {STATUSES.map((value) => (
        <option key={value} value={value}>
          {statusLabels[value]}
        </option>
      ))}
    </select>
  );
}
