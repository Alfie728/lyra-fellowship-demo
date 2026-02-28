import Link from "next/link";
import { api, HydrateClient } from "~/trpc/server";
import { TaskDashboard } from "~/app/_components/TaskDashboard";
import { NavBar } from "~/app/_components/NavBar";

export default async function Home() {
  // Prefetch on the server so the client has data instantly
  void api.task.getAll.prefetch();
  void api.project.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="min-h-screen bg-gray-950 text-white">
        <NavBar />
        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mb-1 text-3xl font-bold tracking-tight">
                Dashboard
              </h1>
              <p className="text-gray-400">
                T3 Workshop Demo — Prisma + tRPC + Next.js
              </p>
            </div>
            <Link
              href="/projects"
              className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-purple-500 hover:text-white"
            >
              View Projects &rarr;
            </Link>
          </div>

          <TaskDashboard />
        </div>
      </main>
    </HydrateClient>
  );
}
