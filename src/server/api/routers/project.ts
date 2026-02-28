import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ProjectModelSchema } from "generated/zod/schemas/variants/pure/Project.pure";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  ProjectForListSchema,
  ProjectForDetailsSchema,
  ProjectGetByIdInputSchema,
  ProjectCreateInputSchema,
  ProjectDeleteInputSchema,
} from "~/types/project";

export const projectRouter = createTRPCRouter({
  getAll: publicProcedure
    .output(z.array(ProjectForListSchema))
    .query(async ({ ctx }) => {
      const projects = await ctx.db.project.findMany({
        include: { _count: { select: { tasks: true } } },
        orderBy: { createdAt: "desc" },
      });

      return projects.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        taskCount: p._count.tasks,
        createdAt: p.createdAt,
      }));
    }),

  getById: publicProcedure
    .input(ProjectGetByIdInputSchema)
    .output(ProjectForDetailsSchema)
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUnique({
        where: { id: input.id },
        include: { tasks: { include: { user: true }, orderBy: { createdAt: "desc" } } },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Project with id "${input.id}" not found`,
        });
      }

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
        tasks: project.tasks.map((t) => ({
          id: t.id,
          title: t.title,
          priority: t.priority,
          status: t.status,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
          user: t.user ? { id: t.user.id, name: t.user.name } : null,
        })),
      };
    }),

  create: publicProcedure
    .input(ProjectCreateInputSchema)
    .output(ProjectModelSchema.omit({ tasks: true }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.create({ data: input });
    }),

  delete: publicProcedure
    .input(ProjectDeleteInputSchema)
    .output(ProjectModelSchema.omit({ tasks: true }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.delete({ where: { id: input.id } });
    }),
});
