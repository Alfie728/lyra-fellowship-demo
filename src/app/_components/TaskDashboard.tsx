"use client";

import { useState } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import { TaskList } from "~/features/tasks/components/TaskList";
import { CreateTask } from "~/features/tasks/components/CreateTask";

type ProjectItem = RouterOutputs["project"]["getAll"][number];

function ProjectSelector({
  projects,
  value,
  onChange,
}: {
  projects: ProjectItem[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-gray-400">Project:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-1.5 text-sm text-white focus:border-purple-500 focus:outline-none"
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.taskCount})
          </option>
        ))}
      </select>
    </div>
  );
}

export function TaskDashboard() {
  const { data: projects } = api.project.getAll.useQuery();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const projectId = selectedProjectId || projects?.[0]?.id || "";

  return (
    <>
      {/* ── Create task section ── */}
      <div className="mb-8">
        {!projects || projects.length === 0 ? (
          <div className="text-sm text-gray-500">
            No projects found. Seed the database first.
          </div>
        ) : (
          <div className="space-y-3">
            <ProjectSelector
              projects={projects}
              value={projectId}
              onChange={setSelectedProjectId}
            />
            {projectId && <CreateTask projectId={projectId} />}
          </div>
        )}
      </div>

      {/* ── Task list ── */}
      <TaskList />
    </>
  );
}
