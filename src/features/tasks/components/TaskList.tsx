"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import { StatusBadge } from "./StatusBadge";

type TaskItem = RouterOutputs["task"]["getAll"][number];
type ProjectItem = RouterOutputs["project"]["getAll"][number];

const PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
const STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;

const statusLabels: Record<string, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const priorityBadge: Record<string, string> = {
  LOW: "bg-gray-700 text-gray-300",
  MEDIUM: "bg-yellow-700 text-yellow-200",
  HIGH: "bg-red-700 text-red-200",
};

function TaskRow({ task, projects }: { task: TaskItem; projects: ProjectItem[] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);
  const [projectId, setProjectId] = useState(task.project.id);
  const utils = api.useUtils();

  const updateTask = api.task.update.useMutation({
    onSuccess: async () => {
      setIsEditing(false);
      await Promise.all([
        utils.task.getAll.invalidate(),
        utils.task.getById.invalidate({ id: task.id }),
        utils.project.getAll.invalidate(),
      ]);
    },
  });

  const deleteTask = api.task.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.task.getAll.invalidate(),
        utils.project.getAll.invalidate(),
        utils.project.getById.invalidate({ id: task.project.id }),
      ]);
    },
  });

  if (isEditing) {
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
          />
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskItem["priority"])}
            className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
          >
            {PRIORITIES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskItem["status"])}
            className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
          >
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {statusLabels[value]}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() =>
              updateTask.mutate({
                id: task.id,
                title: title.trim(),
                priority,
                status,
                projectId,
              })
            }
            disabled={updateTask.isPending || !title.trim()}
            className="rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {updateTask.isPending ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setTitle(task.title);
              setPriority(task.priority);
              setStatus(task.status);
              setProjectId(task.project.id);
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
    <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800/50 p-4">
      <div className="flex flex-col gap-1">
        <Link
          href={`/tasks/${task.id}`}
          className="font-medium text-white hover:text-purple-400"
        >
          {task.title}
        </Link>
        <span className="text-sm text-gray-400">
          <Link
            href={`/projects/${task.project.id}`}
            className="hover:text-purple-400"
          >
            {task.project.name}
          </Link>
          {task.user && ` · ${task.user.name}`}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityBadge[task.priority] ?? "bg-gray-700"}`}
        >
          {task.priority}
        </span>
        <StatusBadge id={task.id} status={task.status} />
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
            if (!window.confirm(`Delete task "${task.title}"?`)) return;
            deleteTask.mutate({ id: task.id });
          }}
          disabled={deleteTask.isPending}
          className="rounded-md border border-red-700 px-2 py-1 text-xs text-red-200 hover:bg-red-900/40 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export function TaskList() {
  const [search, setSearch] = useState("");
  const [projectId, setProjectId] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("createdAt:desc");

  const [sortBy, sortDir] = sort.split(":") as [
    "createdAt" | "updatedAt" | "title" | "priority" | "status",
    "asc" | "desc",
  ];

  const queryInput = useMemo(
    () => ({
      search: search.trim() || undefined,
      projectId: projectId || undefined,
      priority: (priority || undefined) as TaskItem["priority"] | undefined,
      status: (status || undefined) as TaskItem["status"] | undefined,
      sortBy,
      sortDir,
    }),
    [priority, projectId, search, sortBy, sortDir, status],
  );

  const { data: tasks, isLoading, error } = api.task.getAll.useQuery(queryInput);
  const { data: projects } = api.project.getAll.useQuery();

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
        Error loading tasks: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2 rounded-lg border border-gray-700 bg-gray-800/40 p-3 sm:grid-cols-2 lg:grid-cols-5">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
        />
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="">All projects</option>
          {projects?.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="">All priorities</option>
          {PRIORITIES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="">All statuses</option>
          {STATUSES.map((value) => (
            <option key={value} value={value}>
              {statusLabels[value]}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="createdAt:desc">Newest first</option>
          <option value="createdAt:asc">Oldest first</option>
          <option value="updatedAt:desc">Recently updated</option>
          <option value="title:asc">Title A-Z</option>
          <option value="title:desc">Title Z-A</option>
          <option value="priority:desc">Priority high-low</option>
          <option value="priority:asc">Priority low-high</option>
          <option value="status:asc">Status A-Z</option>
        </select>
      </div>

      {!tasks || tasks.length === 0 ? (
        <div className="py-8 text-center text-gray-400">
          No tasks match your current filters.
        </div>
      ) : (
        tasks.map((task) => (
          <TaskRow key={task.id} task={task} projects={projects ?? []} />
        ))
      )}
    </div>
  );
}
