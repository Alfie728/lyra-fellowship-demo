import { z } from "zod";
import { TaskModelSchema } from "generated/zod/schemas/variants/pure/Task.pure";
import { ProjectModelSchema } from "generated/zod/schemas/variants/pure/Project.pure";
import { UserModelSchema } from "generated/zod/schemas/variants/pure/User.pure";
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
    project: ProjectModelSchema.pick({ id: true, name: true }),
    user: UserModelSchema.pick({ id: true, name: true }).nullable(),
  });

export type TaskForList = z.infer<typeof TaskForListSchema>;

export const TaskForDetailsSchema = TaskModelSchema
  .omit({ project: true, user: true })
  .extend({
    project: ProjectModelSchema.pick({ id: true, name: true, description: true, createdAt: true }),
    user: UserModelSchema.pick({ id: true, name: true }).nullable(),
  });

export type TaskForDetails = z.infer<typeof TaskForDetailsSchema>;

// ── Input schemas ────────────────────────────────────────

export const TaskFilterInputSchema = TaskInputSchema
  .pick({ projectId: true, priority: true, status: true })
  .partial()
  .extend({
    search: TaskInputSchema.shape.title.optional(),
    sortBy: z.enum(["createdAt", "updatedAt", "title", "priority", "status"]).optional(),
    sortDir: z.enum(["asc", "desc"]).optional(),
  })
  .optional();

export const TaskGetByIdInputSchema = TaskInputSchema.pick({ id: true });

export const TaskCreateInputSchema = TaskInputSchema
  .pick({ title: true, priority: true, projectId: true })
  .extend({ title: TaskInputSchema.shape.title.min(1, "Title is required") });

export const TaskUpdateInputSchema = TaskInputSchema
  .pick({ id: true, title: true, priority: true, status: true, projectId: true })
  .extend({ title: TaskInputSchema.shape.title.min(1) })
  .partial({ title: true, priority: true, status: true, projectId: true });

export const TaskDeleteInputSchema = TaskInputSchema.pick({ id: true });
