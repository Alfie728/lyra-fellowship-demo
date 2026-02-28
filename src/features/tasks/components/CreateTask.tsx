"use client";

import { useState } from "react";
import type { Task } from "~/types/task";
import { api } from "~/trpc/react";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;

type CreateTaskProps = Pick<Task, "projectId">;

export function CreateTask({ projectId }: CreateTaskProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] =
    useState<(typeof PRIORITIES)[number]>("MEDIUM");

  const utils = api.useUtils();

  const createTask = api.task.create.useMutation({
    onSuccess: () => {
      setTitle("");
      void utils.task.getAll.invalidate();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        createTask.mutate({ title, priority, projectId });
      }}
      className="flex gap-2"
    >
      <input
        type="text"
        placeholder="New task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
      />
      <select
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value as (typeof PRIORITIES)[number])
        }
        className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
      >
        {PRIORITIES.map((value) => (
          <option key={value} value={value}>
            {value.charAt(0) + value.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={createTask.isPending || !title.trim()}
        className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700 disabled:opacity-50"
      >
        {createTask.isPending ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}
