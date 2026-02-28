"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function CreateProject() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const utils = api.useUtils();

  const createProject = api.project.create.useMutation({
    onSuccess: () => {
      setName("");
      setDescription("");
      void utils.project.getAll.invalidate();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        createProject.mutate({
          name,
          description: description || undefined,
        });
      }}
      className="flex gap-2"
    >
      <input
        type="text"
        placeholder="Project name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="flex-1 rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={createProject.isPending || !name.trim()}
        className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700 disabled:opacity-50"
      >
        {createProject.isPending ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
