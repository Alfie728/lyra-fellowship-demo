import { z } from "zod";
import { ProjectModelSchema } from "generated/zod/schemas/variants/pure/Project.pure";
import { TaskModelSchema } from "generated/zod/schemas/variants/pure/Task.pure";
import { UserModelSchema } from "generated/zod/schemas/variants/pure/User.pure";
import { ProjectInputSchema } from "generated/zod/schemas/variants/input/Project.input";

// ── Inferred types ────────────────────────────────────────

export type Project = z.infer<typeof ProjectModelSchema>;

// ── View schemas ─────────────────────────────────────────

export const ProjectForListSchema = ProjectModelSchema
  .omit({ tasks: true })
  .extend({ taskCount: z.number() });

export type ProjectForList = z.infer<typeof ProjectForListSchema>;

export const ProjectForDetailsSchema = ProjectModelSchema
  .omit({ tasks: true })
  .extend({
    tasks: z.array(
      TaskModelSchema
        .pick({ id: true, title: true, priority: true, status: true, createdAt: true, updatedAt: true })
        .extend({ user: UserModelSchema.pick({ id: true, name: true }).nullable() }),
    ),
  });

export type ProjectForDetails = z.infer<typeof ProjectForDetailsSchema>;

// ── Input schemas ────────────────────────────────────────

export const ProjectFilterInputSchema = ProjectInputSchema
  .pick({ name: true })
  .partial()
  .extend({
    search: ProjectInputSchema.shape.name.optional(),
    minTaskCount: z.number().int().nonnegative().optional(),
    sortBy: z.enum(["createdAt", "name", "taskCount"]).optional(),
    sortDir: z.enum(["asc", "desc"]).optional(),
  })
  .optional();

export const ProjectGetByIdInputSchema = ProjectInputSchema.pick({ id: true });

export const ProjectCreateInputSchema = ProjectInputSchema
  .pick({ name: true, description: true })
  .extend({ name: ProjectInputSchema.shape.name.min(1, "Project name is required") });

export const ProjectUpdateInputSchema = ProjectInputSchema
  .pick({ id: true, name: true, description: true })
  .extend({ name: ProjectInputSchema.shape.name.min(1, "Project name is required") })
  .partial({ name: true, description: true });

export const ProjectDeleteInputSchema = ProjectInputSchema.pick({ id: true });
