import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { TaskModelSchema } from "generated/zod/schemas/variants/pure/Task.pure";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  TaskForListSchema,
  TaskForDetailsSchema,
  TaskFilterInputSchema,
  TaskGetByIdInputSchema,
  TaskCreateInputSchema,
  TaskUpdateInputSchema,
  TaskDeleteInputSchema,
} from "~/types/task";

export const taskRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(TaskFilterInputSchema)
    .output(z.array(TaskForListSchema))
    .query(async ({ ctx, input }) => {
      const sortBy = input?.sortBy ?? "createdAt";
      const sortDir = input?.sortDir ?? "desc";
      const orderBy =
        sortBy === "updatedAt"
          ? { updatedAt: sortDir }
          : sortBy === "title"
            ? { title: sortDir }
            : sortBy === "priority"
              ? { priority: sortDir }
              : sortBy === "status"
                ? { status: sortDir }
                : { createdAt: sortDir };

      const tasks = await ctx.db.task.findMany({
        where: {
          projectId: input?.projectId,
          priority: input?.priority,
          status: input?.status,
          title: input?.search
            ? {
                contains: input.search,
              }
            : undefined,
        },
        include: { project: true, user: true },
        orderBy,
      });

      return tasks.map((t) => ({
        ...t,
        project: { id: t.project.id, name: t.project.name },
        user: t.user ? { id: t.user.id, name: t.user.name } : null,
      }));
    }),

  getById: publicProcedure
    .input(TaskGetByIdInputSchema)
    .output(TaskForDetailsSchema)
    .query(async ({ ctx, input }) => {
      const t = await ctx.db.task.findUnique({
        where: { id: input.id },
        include: { project: true, user: true },
      });

      if (!t) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Task with id "${input.id}" not found`,
        });
      }

      return {
        ...t,
        project: {
          id: t.project.id,
          name: t.project.name,
          description: t.project.description,
          createdAt: t.project.createdAt,
        },
        user: t.user ? { id: t.user.id, name: t.user.name } : null,
      };
    }),

  create: publicProcedure
    .input(TaskCreateInputSchema)
    .output(TaskModelSchema.omit({ project: true, user: true }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          title: input.title,
          priority: input.priority,
          projectId: input.projectId,
        },
      });
    }),

  update: publicProcedure
    .input(TaskUpdateInputSchema)
    .output(TaskModelSchema.omit({ project: true, user: true }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.task.update({ where: { id }, data });
    }),

  delete: publicProcedure
    .input(TaskDeleteInputSchema)
    .output(TaskModelSchema.omit({ project: true, user: true }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.delete({ where: { id: input.id } });
    }),
});
