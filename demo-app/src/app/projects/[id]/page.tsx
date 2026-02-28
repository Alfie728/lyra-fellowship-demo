import { api, HydrateClient } from "~/trpc/server";
import { ProjectDetails } from "~/features/projects/components/ProjectDetails";
import { NavBar } from "~/app/_components/NavBar";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  void api.project.getById.prefetch({ id });

  return (
    <HydrateClient>
      <main className="min-h-screen bg-gray-950 text-white">
        <NavBar />
        <div className="mx-auto max-w-3xl px-4 py-8">
          <ProjectDetails projectId={id} />
        </div>
      </main>
    </HydrateClient>
  );
}
