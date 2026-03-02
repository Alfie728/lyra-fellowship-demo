"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { api, type RouterOutputs } from "~/trpc/react";

type ProjectItem = RouterOutputs["project"]["getAll"][number];

function ProjectCard({ project }: { project: ProjectItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const utils = api.useUtils();

  const updateProject = api.project.update.useMutation({
    onSuccess: async () => {
      setIsEditing(false);
      await Promise.all([
        utils.project.getAll.invalidate(),
        utils.project.getById.invalidate({ id: project.id }),
        utils.task.getAll.invalidate(),
      ]);
    },
  });

  const deleteProject = api.project.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.project.getAll.invalidate(),
        utils.task.getAll.invalidate(),
      ]);
    },
  });

  if (isEditing) {
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-5">
        <div className="space-y-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
          />
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() =>
              updateProject.mutate({
                id: project.id,
                name: name.trim(),
                description: description.trim() || null,
              })
            }
            disabled={updateProject.isPending || !name.trim()}
            className="rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {updateProject.isPending ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setName(project.name);
              setDescription(project.description ?? "");
            }}
            className="rounded-lg border border-gray-600 px-3 py-1.5 text-sm text-gray-200 hover:border-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-5 transition-colors hover:border-purple-500/50 hover:bg-gray-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link
            href={`/projects/${project.id}`}
            className="font-semibold text-white hover:text-purple-400"
          >
            {project.name}
          </Link>
          {project.description && (
            <p className="mt-1 text-sm text-gray-400">{project.description}</p>
          )}
          <p className="mt-3 text-xs text-gray-500">
            {project.taskCount} {project.taskCount === 1 ? "task" : "tasks"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-md border border-gray-600 px-2 py-1 text-xs text-gray-200 hover:border-purple-500"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => {
              if (!window.confirm(`Delete project "${project.name}" and its tasks?`)) return;
              deleteProject.mutate({ id: project.id });
            }}
            disabled={deleteProject.isPending}
            className="rounded-md border border-red-700 px-2 py-1 text-xs text-red-200 hover:bg-red-900/40 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProjectList() {
  const [search, setSearch] = useState("");
  const [minTaskCount, setMinTaskCount] = useState("0");
  const [sort, setSort] = useState("createdAt:desc");

  const [sortBy, sortDir] = sort.split(":") as [
    "createdAt" | "name" | "taskCount",
    "asc" | "desc",
  ];

  const queryInput = useMemo(
    () => ({
      search: search.trim() || undefined,
      minTaskCount:
        minTaskCount === "" ? undefined : Number.isNaN(Number(minTaskCount)) ? 0 : Number(minTaskCount),
      sortBy,
      sortDir,
    }),
    [minTaskCount, search, sortBy, sortDir],
  );

  const { data: projects, isLoading, error } = api.project.getAll.useQuery(queryInput);

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

  return (
    <div className="space-y-4">
      <div className="grid gap-2 rounded-lg border border-gray-700 bg-gray-800/40 p-3 sm:grid-cols-3">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
        />
        <input
          type="number"
          min={0}
          value={minTaskCount}
          onChange={(e) => setMinTaskCount(e.target.value)}
          className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
          placeholder="Min task count"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="createdAt:desc">Newest first</option>
          <option value="createdAt:asc">Oldest first</option>
          <option value="name:asc">Name A-Z</option>
          <option value="name:desc">Name Z-A</option>
          <option value="taskCount:desc">Most tasks</option>
          <option value="taskCount:asc">Fewest tasks</option>
        </select>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="py-8 text-center text-gray-400">
          No projects match your current filters.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
