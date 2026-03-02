import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ProjectModelSchema } from "generated/zod/schemas/variants/pure/Project.pure";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  ProjectForListSchema,
  ProjectForDetailsSchema,
  ProjectFilterInputSchema,
  ProjectGetByIdInputSchema,
  ProjectCreateInputSchema,
  ProjectUpdateInputSchema,
  ProjectDeleteInputSchema,
} from "~/types/project";

export const projectRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(ProjectFilterInputSchema)
    .output(z.array(ProjectForListSchema))
    .query(async ({ ctx, input }) => {
      const projects = await ctx.db.project.findMany({
        where: input?.search
          ? {
              name: {
                contains: input.search,
              },
            }
          : undefined,
        include: { _count: { select: { tasks: true } } },
      });

      const items = projects.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        taskCount: p._count.tasks,
        createdAt: p.createdAt,
      }));

      const minTaskCount = input?.minTaskCount ?? 0;
      const filtered = items.filter((item) => item.taskCount >= minTaskCount);

      const sortBy = input?.sortBy ?? "createdAt";
      const sortDir = input?.sortDir ?? "desc";
      const multiplier = sortDir === "asc" ? 1 : -1;

      return filtered.sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name) * multiplier;
        if (sortBy === "taskCount") return (a.taskCount - b.taskCount) * multiplier;
        return (a.createdAt.getTime() - b.createdAt.getTime()) * multiplier;
      });
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

  update: publicProcedure
    .input(ProjectUpdateInputSchema)
    .output(ProjectModelSchema.omit({ tasks: true }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.project.update({ where: { id }, data });
    }),

  delete: publicProcedure
    .input(ProjectDeleteInputSchema)
    .output(ProjectModelSchema.omit({ tasks: true }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.delete({ where: { id: input.id } });
    }),
});
