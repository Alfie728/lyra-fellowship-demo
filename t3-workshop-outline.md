# 2-Week T3 Stack + FDE Workshop

**Audience:** New grad engineers with big-tech experience, no exposure to T3/full-stack TypeScript
**Format:** 1 hr live session → self-directed project work for the rest of the day
**Project:** Each person builds a real feature set in a T3 app (task manager, CRM, whatever fits your team's domain). They apply each session's lesson to their project same-day.

---

## Week 1: Full-Stack Fundamentals (3 sessions, spread across the week)

### Session 1: The Stack + Schema-First Development

**Why this first:** Everything in T3 starts at the database. If they get this, the rest of the week flows naturally.

#### Live session (1 hr)

**The T3 mental model (10 min)**

- The typesafety chain: Prisma → tRPC → Frontend. Draw it. This is the north star for the whole week.
- Live demo: change a column name in the schema, watch type errors cascade to the UI. This is the "aha" moment — lead with it.

**Scaffold + orient (10 min)**

- `npm create t3-app@latest` together
- 5-minute folder tour: `prisma/schema.prisma`, `src/server/api`, `src/app`. Don't explain every file — just "here's where your data lives, here's your backend, here's your frontend."

**Prisma — schema to typed queries (30 min live coding)**

- Define 2-3 models with a relation (e.g., `Project` has many `Task`s, `Task` has an assignee `User`)
- `prisma migrate dev`, `prisma generate` — the two commands they'll run 50 times this week
- Open Prisma Studio — show the data is real
- Write a few typed queries in a scratch script: `findMany`, `create`, `include` for relations
- Show the autocompletion: "Notice I didn't write a single type by hand — it all came from the schema"

**The workflow (5 min)**

- Requirement → Schema change → `migrate dev` → `generate` → Typed queries just work
- "This is step 1 of every feature you'll ever build in this stack"

**Assignment intro (5 min)**

- Explain their project (or let them pick from 2-3 options)
- Today's task: design your schema (at least 3 models with relations), run migrations, seed some test data, write queries to verify everything works

#### Self-directed work for the rest of the day

- Design and iterate on their schema
- Get comfortable with the migration loop
- Seed data and query it — verify relations work
- Explore Prisma Studio
- Stretch: read the Next.js App Router docs (file-based routing, `page.tsx`, layouts) — they'll need it for Session 2

---

### Session 2: tRPC — Your Backend is Just Functions

**Why this second:** They have a schema and typed queries. Now wrap them in an API layer.

#### Live session (1 hr)

**Quick check-in (5 min)**

- "Show me your schema." Quick scan for common issues (missing relations, bad naming).
- Address 1-2 common questions from their self-directed work.

**tRPC mental model (10 min)**

- "It's just functions your frontend can call, with automatic types and validation"
- Anatomy: Router → Procedures → Input (Zod) → Business logic (Prisma) → Return
- Quick Zod primer: `z.object({ title: z.string(), priority: z.enum(["low", "med", "high"]) })` — one definition gives you runtime validation AND a TypeScript type

**Live coding: build a full CRUD router (35 min)**

- Build a `taskRouter` step by step:
  - `getAll` query — call Prisma, return results. Show: "The return type flows automatically to the client."
  - `getById` query with Zod input validation
  - `create` mutation — validate input, insert, return the new record
  - `update` and `delete` mutations
- Add a second, simpler router (e.g. `projectRouter`) faster to show the pattern repeats
- Error handling: throw `TRPCError` with `code: "NOT_FOUND"` — show what the client will see
- `protectedProcedure` — briefly show how auth gates a route (don't deep-dive NextAuth yet, just show the pattern)

**The workflow, extended (5 min)**

- Requirement → Schema change → Migrate → **Write/update tRPC procedures** → Frontend (tomorrow)
- "After today, your backend is done for any feature. The pattern is always the same."

**Assignment intro (5 min)**

- Build routers for every model in your schema. Full CRUD.
- Add at least one filtered query (e.g., "get tasks by project" or "get tasks by priority")
- Add input validation to every mutation
- Stretch: add a `protectedProcedure` and read the NextAuth T3 docs

#### Self-directed work for the rest of the day

- Build all their routers
- Practice the pattern: Zod input → Prisma query → return
- Test procedures (they can use Prisma Studio to verify data changes, or write quick test scripts)
- If they finish early: explore NextAuth setup, read TanStack Query docs

---

### Session 3: Frontend — Consuming Your API + The Full Loop

**Why this last:** They have a schema AND a backend. Now connect the UI and close the loop.

#### Live session (1 hr)

**Quick check-in (5 min)**

- "Show me your routers." Spot-check one or two. Address common issues.

**tRPC client + TanStack Query (20 min live coding)**

- The key insight: `trpc.task.getAll.useQuery()` = TanStack Query's `useQuery` but with automatic types and fetch logic. No URL strings, no manual typing.
- Build a task list component:
  - `useQuery` — handle loading, error, success states
  - Show the autocompletion: "Notice the return type matches exactly what your router returns"
- Build a create-task form:
  - `useMutation` — `onSuccess` → `utils.task.getAll.invalidate()`
  - **Emphasize cache invalidation hard:** "This is the #1 thing that will bite you. After a mutation, you must tell TanStack Query which data is stale. Forget this and your UI shows old data."

**Tailwind in 5 minutes (5 min)**

- Don't teach it — just show the workflow: search Tailwind docs → copy utility classes → iterate
- Quick demo: take the ugly task list, add `flex`, `gap-4`, `rounded-lg`, `p-4`, `shadow` — looks decent in 30 seconds
- "You'll learn Tailwind by using it. Bookmark the docs. That's the whole lesson."

**The full feature loop — live (20 min)**

- Simulate a ticket: "Add a `status` field to tasks (todo/in-progress/done) with the ability to update status from the UI"
- Do it end to end at full speed, narrating decisions:
  1. Add `status` to Prisma schema, migrate
  2. Update `create` procedure to accept status, add an `updateStatus` mutation
  3. Add a status badge to the task list, add a dropdown that calls the mutation, invalidate
- "This is what your day-to-day looks like. Requirement → Schema → Backend → Frontend. Every feature, same loop."

**Assignment intro (5 min)**

- Wire up your frontend to your routers. Display data, create/update/delete from the UI.
- Build at least 2 complete features end-to-end using the full loop
- Focus on getting the data flow right — styling can be minimal
- Stretch: add auth with NextAuth, protect a route

#### Self-directed work for the rest of the day (and the rest of the week)

- Build out their app's frontend
- Practice the full loop repeatedly: requirement → schema → backend → frontend
- By end of week they should have a working app with multiple features built independently

---

## Week 2: Engineering Excellence (2 sessions, spread across the week)

### Session 4: Using AI Effectively + Client Communication

#### Live session (1 hr)

**AI as a tool, not a crutch (20 min)**

- The rule: if you can't explain every line of AI-generated code, you don't ship it
- **4 workflows, live demo using their T3 project:**
  1. **Comprehension:** paste unfamiliar tRPC middleware → "explain this"
  2. **Debugging:** structured prompt — error message + what you tried + context → get targeted help
  3. **Boilerplate:** "Generate a Zod schema for a user profile form with these fields" → review and adjust
  4. **Design rubber-ducking:** "I need to add tagging to tasks. Should I use a separate table or a JSON field? Here's my current schema." → discuss tradeoffs
- The prompting formula: **context + constraint + specific ask**. Bad: "fix my code." Good: "Here's my tRPC router [paste]. The create mutation throws [error] when I send [input]. I expect [behavior]. What's wrong?"
- When NOT to use AI: architectural decisions you don't understand yet, security-sensitive code, anything where you're tempted to skip understanding

**Communicating with clients (20 min)**

- "Translate, don't educate" — clients need to know when their feature ships, not how tRPC works
- **Status updates formula:** what's done → what's in progress → what's blocked → what I need from you
- **Delivering bad news:** acknowledge → explain impact → propose path forward. Never just report a problem without a recommendation.
- **Asking questions:** don't say "the requirements are unclear." Say "I want to confirm: when you say X, do you mean A or B? I'm leaning toward A because [reason]."
- **Live exercise:** show 2 bad status updates on screen, rewrite them together as a group

**Demo skills (10 min)**

- Structure: context → what you built → show it working → what's next
- Rule: show the product, not the code. Clients don't care about your router.
- **Quick practice:** each person gives a 60-second demo of one feature to a partner. Partner gives one piece of feedback.

**Assignment intro (5 min)**

- Write a mock status update for your project as if reporting to a client
- Pick a feature in your app. Use AI to help build it. For every AI-generated block, add a comment explaining what it does and why you kept/modified it.
- Practice a 2-minute demo of your app — you'll give one in Session 5

#### Self-directed work

- Continue building their app using AI-assisted workflows
- Practice the communication frameworks
- Prepare a short demo

---

### Session 5: Flagging Issues + Capstone Demo

#### Live session (1 hr)

**Flagging issues early (20 min)**

- The 30-minute rule: stuck with no forward progress → escalate. This isn't failure, it's professional judgment. In consulting/small teams, silent struggling burns the project.
- **Red flags to recognize:**
  - Technical: vague requirements, scope creep disguised as "small changes," you're building something you can't explain
  - Process: client unresponsive on blocking questions, priorities shifting with no updated timeline
  - Personal: you're guessing instead of knowing, you're avoiding the hard part of the ticket
- **How to flag well:** "I've identified [issue]. Impact is [X]. I recommend [Y]. I need [Z] to proceed."
- **Quick exercise:** show 2 scenarios on screen. Each person writes an escalation message in 2 minutes. Share and critique 1-2 as a group.

**Engineering judgment, fast (10 min)**

- Build vs. library, "good enough" vs. perfect, push back vs. just build it
- The key question: "What's the cost of being wrong?" Low cost → move fast. High cost → slow down, ask, validate.
- Connect to their experience: "Client asks for real-time updates. Do you add WebSockets or poll every 5 seconds? How do you decide, and how do you communicate the tradeoff?"

**Capstone demos (25 min)**

- Each person gives a **2-3 minute demo** of their app, client-facing style
- Format: what the app does → walk through 1-2 features → what you'd build next
- Group gives brief feedback on each demo (clarity, confidence, product vs. code focus)

**Closing (5 min)**

- The two things to remember:
  1. **The workflow:** Requirement → Schema → Backend → Frontend → Ship
  2. **The mindset:** Communicate early, flag fast, own your work
- Resources: T3 docs, Prisma docs, tRPC docs, TanStack Query docs, Tailwind docs
- 30/60/90-day growth prompt: "Where do you want to be in 30 days? What would make you confident?"

---

## Summary

| Session | Week | Topic | They walk away able to... |
|---------|------|-------|--------------------------|
| 1 | W1 | Stack + Schema-First Development | Design schemas, run migrations, write typed queries |
| 2 | W1 | tRPC — Backend is Just Functions | Build full CRUD routers with validation |
| 3 | W1 | Frontend + Full Feature Loop | Consume APIs, handle cache, build features end-to-end |
| 4 | W2 | AI Workflows + Client Communication | Use AI responsibly, write status updates, demo their work |
| 5 | W2 | Flagging Issues + Capstone Demos | Recognize red flags, escalate well, present confidently |

The real learning happens in the self-directed time between sessions. The live hours plant the seed and set the direction. The project work is where it takes root.
