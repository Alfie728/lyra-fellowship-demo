import { api, HydrateClient } from "~/trpc/server";
import { TaskDetails } from "~/features/tasks/components/TaskDetails";
import { NavBar } from "~/app/_components/NavBar";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  void api.task.getById.prefetch({ id });

  return (
    <HydrateClient>
      <main className="min-h-screen bg-gray-950 text-white">
        <NavBar />
        <div className="mx-auto max-w-3xl px-4 py-8">
          <TaskDetails taskId={id} />
        </div>
      </main>
    </HydrateClient>
  );
}
