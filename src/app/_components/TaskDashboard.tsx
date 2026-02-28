"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { TaskList } from "~/features/tasks/components/TaskList";
import { CreateTask } from "~/features/tasks/components/CreateTask";

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
          <CreateTask
            projects={projects}
            projectId={projectId}
            onProjectChange={setSelectedProjectId}
          />
        )}
      </div>

      {/* ── Task list ── */}
      <TaskList />
    </>
  );
}
