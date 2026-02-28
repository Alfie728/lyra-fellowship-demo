"use client";

import Link from "next/link";
import { api, type RouterOutputs } from "~/trpc/react";
import { StatusBadge } from "./StatusBadge";

type TaskItem = RouterOutputs["task"]["getAll"][number];

const priorityBadge: Record<string, string> = {
  LOW: "bg-gray-700 text-gray-300",
  MEDIUM: "bg-yellow-700 text-yellow-200",
  HIGH: "bg-red-700 text-red-200",
};

function TaskRow({ task }: { task: TaskItem }) {
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
      </div>
    </div>
  );
}

export function TaskList() {
  const { data: tasks, isLoading, error } = api.task.getAll.useQuery();

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

  if (!tasks || tasks.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400">
        No tasks yet. Create one above!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} />
      ))}
    </div>
  );
}
