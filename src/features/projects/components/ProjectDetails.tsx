"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

const priorityBadge: Record<string, string> = {
  LOW: "bg-gray-700 text-gray-300",
  MEDIUM: "bg-yellow-700 text-yellow-200",
  HIGH: "bg-red-700 text-red-200",
};

const statusBadge: Record<string, string> = {
  TODO: "bg-gray-600 text-gray-100",
  IN_PROGRESS: "bg-blue-600 text-blue-100",
  DONE: "bg-green-600 text-green-100",
};

const statusLabels: Record<string, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export function ProjectDetails({ projectId }: { projectId: string }) {
  const { data: project, isLoading, error } = api.project.getById.useQuery({ id: projectId });

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
          ? "Project not found."
          : `Error: ${error.message}`}
      </div>
    );
  }

  if (!project) return null;

  return (
    <div>
      <Link
        href="/projects"
        className="mb-4 inline-block text-sm text-gray-400 hover:text-purple-400"
      >
        &larr; Back to projects
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">{project.name}</h1>
        {project.description && (
          <p className="mt-2 text-gray-400">{project.description}</p>
        )}
        <p className="mt-2 text-sm text-gray-500">
          Created {project.createdAt.toLocaleDateString()}
        </p>
      </div>

      <h2 className="mb-4 text-xl font-semibold text-white">
        Tasks ({project.tasks.length})
      </h2>

      {project.tasks.length === 0 ? (
        <p className="py-4 text-gray-400">No tasks in this project yet.</p>
      ) : (
        <div className="space-y-3">
          {project.tasks.map((task) => (
            <Link
              key={task.id}
              href={`/tasks/${task.id}`}
              className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition-colors hover:border-purple-500/50"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium text-white">{task.title}</span>
                {task.user && (
                  <span className="text-sm text-gray-400">{task.user.name}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityBadge[task.priority] ?? "bg-gray-700"}`}
                >
                  {task.priority}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge[task.status] ?? "bg-gray-600"}`}
                >
                  {statusLabels[task.status] ?? task.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
