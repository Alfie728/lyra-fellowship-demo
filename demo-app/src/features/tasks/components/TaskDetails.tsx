"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { StatusBadge } from "./StatusBadge";

const priorityBadge: Record<string, string> = {
  LOW: "bg-gray-700 text-gray-300",
  MEDIUM: "bg-yellow-700 text-yellow-200",
  HIGH: "bg-red-700 text-red-200",
};

export function TaskDetails({ taskId }: { taskId: string }) {
  const { data: task, isLoading, error } = api.task.getById.useQuery({ id: taskId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-900/50 p-4 text-red-200">
        {error.data?.code === "NOT_FOUND"
          ? "Task not found."
          : `Error: ${error.message}`}
      </div>
    );
  }

  if (!task) return null;

  return (
    <div>
      <Link
        href="/"
        className="mb-4 inline-block text-sm text-gray-400 hover:text-purple-400"
      >
        &larr; Back to dashboard
      </Link>

      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
        <div className="mb-4 flex items-start justify-between">
          <h1 className="text-2xl font-bold text-white">{task.title}</h1>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityBadge[task.priority] ?? "bg-gray-700"}`}
            >
              {task.priority}
            </span>
            <StatusBadge id={task.id} status={task.status} />
          </div>
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex gap-2">
            <dt className="text-gray-400">Project:</dt>
            <dd>
              <Link
                href={`/projects/${task.project.id}`}
                className="text-purple-400 hover:underline"
              >
                {task.project.name}
              </Link>
            </dd>
          </div>

          {task.project.description && (
            <div className="flex gap-2">
              <dt className="text-gray-400">Project description:</dt>
              <dd className="text-gray-300">{task.project.description}</dd>
            </div>
          )}

          {task.user && (
            <div className="flex gap-2">
              <dt className="text-gray-400">Assigned to:</dt>
              <dd className="text-gray-300">{task.user.name}</dd>
            </div>
          )}

          <div className="flex gap-2">
            <dt className="text-gray-400">Created:</dt>
            <dd className="text-gray-300">
              {task.createdAt.toLocaleDateString()}
            </dd>
          </div>

          <div className="flex gap-2">
            <dt className="text-gray-400">Updated:</dt>
            <dd className="text-gray-300">
              {task.updatedAt.toLocaleDateString()}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
