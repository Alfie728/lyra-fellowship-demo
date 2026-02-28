import { z } from "zod";
import { TaskModelSchema } from "generated/zod/schemas/variants/pure/Task.pure";
import { TaskInputSchema } from "generated/zod/schemas/variants/input/Task.input";
import { PrioritySchema } from "generated/zod/schemas/enums/Priority.schema";
import { TaskStatusSchema } from "generated/zod/schemas/enums/TaskStatus.schema";

// ── Inferred types ────────────────────────────────────────

export type Task = z.infer<typeof TaskModelSchema>;
export type Priority = z.infer<typeof PrioritySchema>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

// ── View schemas ─────────────────────────────────────────

export const TaskForListSchema = TaskModelSchema
  .omit({ project: true, user: true })
  .extend({
    project: z.object({ id: z.string(), name: z.string() }),
    user: z.object({ id: z.string(), name: z.string() }).nullable(),
  });

export type TaskForList = z.infer<typeof TaskForListSchema>;

export const TaskForDetailsSchema = TaskModelSchema
  .omit({ project: true, user: true })
  .extend({
    project: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      createdAt: z.date(),
    }),
    user: z.object({ id: z.string(), name: z.string() }).nullable(),
  });

export type TaskForDetails = z.infer<typeof TaskForDetailsSchema>;

// ── Input schemas ────────────────────────────────────────

export const TaskFilterInputSchema = z
  .object({
    projectId: z.string().optional(),
    priority: PrioritySchema.optional(),
  })
  .optional();

export const TaskGetByIdInputSchema = z.object({ id: z.string() });

export const TaskCreateInputSchema = TaskInputSchema
  .pick({ title: true, priority: true, projectId: true })
  .extend({ title: z.string().min(1, "Title is required") });

export const TaskUpdateInputSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  priority: PrioritySchema.optional(),
  status: TaskStatusSchema.optional(),
});

export const TaskDeleteInputSchema = z.object({ id: z.string() });
