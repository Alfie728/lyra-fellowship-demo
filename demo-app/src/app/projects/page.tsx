import { api, HydrateClient } from "~/trpc/server";
import { ProjectList } from "~/features/projects/components/ProjectList";
import { CreateProject } from "~/features/projects/components/CreateProject";
import { NavBar } from "~/app/_components/NavBar";

export default async function ProjectsPage() {
  void api.project.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="min-h-screen bg-gray-950 text-white">
        <NavBar />
        <div className="mx-auto max-w-3xl px-4 py-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Projects</h1>
          <p className="mb-6 text-gray-400">
            Manage your projects and their tasks.
          </p>

          <div className="mb-8">
            <CreateProject />
          </div>

          <ProjectList />
        </div>
      </main>
    </HydrateClient>
  );
}
