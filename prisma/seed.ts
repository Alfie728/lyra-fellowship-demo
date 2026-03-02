import { PrismaClient } from "../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./db.sqlite" });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean existing data
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const [alice, bob, charlie, dana, eva] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alice Johnson",
        email: "alice@example.com",
      },
    }),
    prisma.user.create({
      data: {
        name: "Bob Smith",
        email: "bob@example.com",
      },
    }),
    prisma.user.create({
      data: {
        name: "Charlie Kim",
        email: "charlie@example.com",
      },
    }),
    prisma.user.create({
      data: {
        name: "Dana Patel",
        email: "dana@example.com",
      },
    }),
    prisma.user.create({
      data: {
        name: "Eva Martinez",
        email: "eva@example.com",
      },
    }),
  ]);

  // Create projects
  const [webApp, mobileApp, analytics, platform, qa] = await Promise.all([
    prisma.project.create({
      data: {
        name: "Web App Redesign",
        description: "Redesign the main marketing website",
      },
    }),
    prisma.project.create({
      data: {
        name: "Mobile App",
        description: "Build the iOS and Android app",
      },
    }),
    prisma.project.create({
      data: {
        name: "Analytics Revamp",
        description: "Improve product analytics and dashboards",
      },
    }),
    prisma.project.create({
      data: {
        name: "Platform Reliability",
        description: "Stability and performance improvements",
      },
    }),
    prisma.project.create({
      data: {
        name: "QA Automation",
        description: "Expand end-to-end and regression coverage",
      },
    }),
  ]);

  // Create tasks
  await prisma.task.createMany({
    data: [
      {
        title: "Design homepage mockup",
        priority: "HIGH",
        status: "IN_PROGRESS",
        projectId: webApp.id,
        userId: alice.id,
      },
      {
        title: "Set up CI/CD pipeline",
        priority: "MEDIUM",
        status: "TODO",
        projectId: webApp.id,
        userId: bob.id,
      },
      {
        title: "Write API documentation",
        priority: "LOW",
        status: "DONE",
        projectId: webApp.id,
        userId: charlie.id,
      },
      {
        title: "Implement auth flow",
        priority: "HIGH",
        status: "TODO",
        projectId: mobileApp.id,
        userId: dana.id,
      },
      {
        title: "Design onboarding screens",
        priority: "MEDIUM",
        status: "TODO",
        projectId: mobileApp.id,
        userId: null,
      },
      {
        title: "Implement dark mode toggle",
        priority: "LOW",
        status: "DONE",
        projectId: webApp.id,
        userId: bob.id,
      },
      {
        title: "Refactor shared button components",
        priority: "MEDIUM",
        status: "IN_PROGRESS",
        projectId: webApp.id,
        userId: dana.id,
      },
      {
        title: "Add push notification support",
        priority: "HIGH",
        status: "IN_PROGRESS",
        projectId: mobileApp.id,
        userId: charlie.id,
      },
      {
        title: "Build offline sync queue",
        priority: "HIGH",
        status: "TODO",
        projectId: mobileApp.id,
        userId: eva.id,
      },
      {
        title: "Instrument checkout funnel events",
        priority: "HIGH",
        status: "TODO",
        projectId: analytics.id,
        userId: alice.id,
      },
      {
        title: "Create weekly KPI dashboard",
        priority: "MEDIUM",
        status: "IN_PROGRESS",
        projectId: analytics.id,
        userId: bob.id,
      },
      {
        title: "Backfill missing event metadata",
        priority: "LOW",
        status: "DONE",
        projectId: analytics.id,
        userId: charlie.id,
      },
      {
        title: "Set SLO for API latency",
        priority: "HIGH",
        status: "TODO",
        projectId: platform.id,
        userId: dana.id,
      },
      {
        title: "Add circuit breaker for external calls",
        priority: "HIGH",
        status: "IN_PROGRESS",
        projectId: platform.id,
        userId: eva.id,
      },
      {
        title: "Tune database indexes",
        priority: "MEDIUM",
        status: "IN_PROGRESS",
        projectId: platform.id,
        userId: bob.id,
      },
      {
        title: "Create smoke test suite",
        priority: "MEDIUM",
        status: "TODO",
        projectId: qa.id,
        userId: alice.id,
      },
      {
        title: "Run nightly cross-browser tests",
        priority: "LOW",
        status: "DONE",
        projectId: qa.id,
        userId: null,
      },
      {
        title: "Fix flaky signup test",
        priority: "HIGH",
        status: "IN_PROGRESS",
        projectId: qa.id,
        userId: dana.id,
      },
      {
        title: "Document release checklist",
        priority: "LOW",
        status: "DONE",
        projectId: qa.id,
        userId: charlie.id,
      },
      {
        title: "Migrate image assets to CDN",
        priority: "MEDIUM",
        status: "TODO",
        projectId: webApp.id,
        userId: eva.id,
      },
      {
        title: "Polish project settings screen",
        priority: "LOW",
        status: "TODO",
        projectId: mobileApp.id,
        userId: bob.id,
      },
      {
        title: "Enable alerting for failed jobs",
        priority: "HIGH",
        status: "DONE",
        projectId: platform.id,
        userId: alice.id,
      },
      {
        title: "Add retention cohort report",
        priority: "MEDIUM",
        status: "TODO",
        projectId: analytics.id,
        userId: dana.id,
      },
      {
        title: "Improve empty states copy",
        priority: "LOW",
        status: "IN_PROGRESS",
        projectId: webApp.id,
        userId: charlie.id,
      },
      {
        title: "Support deep links from email",
        priority: "MEDIUM",
        status: "DONE",
        projectId: mobileApp.id,
        userId: eva.id,
      },
    ],
  });

  console.log("Seeded: 5 users, 5 projects, 25 tasks");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
