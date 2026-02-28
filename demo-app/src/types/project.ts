import { z } from "zod";
import { ProjectModelSchema } from "generated/zod/schemas/variants/pure/Project.pure";
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
      z.object({
        id: z.string(),
        title: z.string(),
        priority: z.string(),
        status: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
        user: z.object({ id: z.string(), name: z.string() }).nullable(),
      }),
    ),
  });

export type ProjectForDetails = z.infer<typeof ProjectForDetailsSchema>;

// ── Input schemas ────────────────────────────────────────

export const ProjectGetByIdInputSchema = z.object({ id: z.string() });

export const ProjectCreateInputSchema = ProjectInputSchema
  .pick({ name: true, description: true })
  .extend({ name: z.string().min(1, "Project name is required") });

export const ProjectDeleteInputSchema = z.object({ id: z.string() });
