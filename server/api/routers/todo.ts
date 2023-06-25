import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const todoRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany({
      where: {
        userId: ctx.session.user.id,
        deletedAt: null,
      },
      include: {
        user: true,
      },
      orderBy: {
        index: "asc",
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const todos = await ctx.prisma.todo.findMany({
        where: {
          userId: ctx.session.user.id,
          deletedAt: null,
          status: input.status,
        },
      });

      const index = todos.length;

      return ctx.prisma.todo.create({
        data: {
          title: input.title,
          index: index,
          status: input.status,
          image: input.image,
          userId: ctx.session.user.id,
        },
      });
    }),

  deleteSave: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    }),
});
