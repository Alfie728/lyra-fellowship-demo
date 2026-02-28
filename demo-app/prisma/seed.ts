import { PrismaClient } from "../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./db.sqlite" });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean existing data
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create a user
  const user = await prisma.user.create({
    data: {
      name: "Alice Johnson",
      email: "alice@example.com",
    },
  });

  // Create projects
  const webApp = await prisma.project.create({
    data: {
      name: "Web App Redesign",
      description: "Redesign the main marketing website",
    },
  });

  const mobileApp = await prisma.project.create({
    data: {
      name: "Mobile App",
      description: "Build the iOS and Android app",
    },
  });

  // Create tasks
  await prisma.task.createMany({
    data: [
      {
        title: "Design homepage mockup",
        priority: "HIGH",
        status: "IN_PROGRESS",
        projectId: webApp.id,
        userId: user.id,
      },
      {
        title: "Set up CI/CD pipeline",
        priority: "MEDIUM",
        status: "TODO",
        projectId: webApp.id,
        userId: user.id,
      },
      {
        title: "Write API documentation",
        priority: "LOW",
        status: "DONE",
        projectId: webApp.id,
        userId: user.id,
      },
      {
        title: "Implement auth flow",
        priority: "HIGH",
        status: "TODO",
        projectId: mobileApp.id,
        userId: user.id,
      },
      {
        title: "Design onboarding screens",
        priority: "MEDIUM",
        status: "TODO",
        projectId: mobileApp.id,
        userId: null,
      },
    ],
  });

  console.log("Seeded: 1 user, 2 projects, 5 tasks");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
