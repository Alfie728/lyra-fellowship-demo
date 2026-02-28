"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

export function ProjectList() {
  const { data: projects, isLoading, error } = api.project.getAll.useQuery();

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
        Error loading projects: {error.message}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400">
        No projects yet. Create one above!
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}`}
          className="group rounded-lg border border-gray-700 bg-gray-800/50 p-5 transition-colors hover:border-purple-500/50 hover:bg-gray-800"
        >
          <h3 className="font-semibold text-white group-hover:text-purple-400">
            {project.name}
          </h3>
          {project.description && (
            <p className="mt-1 text-sm text-gray-400">{project.description}</p>
          )}
          <p className="mt-3 text-xs text-gray-500">
            {project.taskCount} {project.taskCount === 1 ? "task" : "tasks"}
          </p>
        </Link>
      ))}
    </div>
  );
}
