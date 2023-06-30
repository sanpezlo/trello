import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

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

  updateIndex: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        index: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const todo = await ctx.prisma.todo.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!todo)
        throw new TRPCError({ code: "NOT_FOUND", message: "Todo not found" });

      if (todo.index === input.index) return todo;

      if (todo.index > input.index) {
        const todos = await ctx.prisma.todo.findMany({
          where: {
            userId: ctx.session.user.id,
            deletedAt: null,
            status: todo.status,
            index: {
              gte: input.index,
              lt: todo.index,
            },
          },
        });

        await Promise.all(
          todos.map(async (todo) => {
            return await ctx.prisma.todo.update({
              where: {
                id: todo.id,
              },
              data: {
                index: todo.index + 1,
              },
            });
          })
        );
      } else {
        const todos = await ctx.prisma.todo.findMany({
          where: {
            id: {
              not: todo.id,
            },
            userId: ctx.session.user.id,
            deletedAt: null,
            status: todo.status,
            index: {
              lte: input.index,
              gt: todo.index,
            },
          },
        });

        await Promise.all(
          todos.map(async (todo) => {
            return await ctx.prisma.todo.update({
              where: {
                id: todo.id,
              },
              data: {
                index: todo.index - 1,
              },
            });
          })
        );
      }

      return await ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          index: input.index,
        },
      });
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
        index: z.number(),
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

      await ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
          index: index,
        },
      });

      // Update index

      const todo = await ctx.prisma.todo.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!todo)
        throw new TRPCError({ code: "NOT_FOUND", message: "Todo not found" });

      if (todo.index === input.index) return todo;

      if (todo.index > input.index) {
        const todos = await ctx.prisma.todo.findMany({
          where: {
            userId: ctx.session.user.id,
            deletedAt: null,
            status: todo.status,
            index: {
              gte: input.index,
              lt: todo.index,
            },
          },
        });

        await Promise.all(
          todos.map(async (todo) => {
            return await ctx.prisma.todo.update({
              where: {
                id: todo.id,
              },
              data: {
                index: todo.index + 1,
              },
            });
          })
        );
      } else {
        const todos = await ctx.prisma.todo.findMany({
          where: {
            id: {
              not: todo.id,
            },
            userId: ctx.session.user.id,
            deletedAt: null,
            status: todo.status,
            index: {
              lte: input.index,
              gt: todo.index,
            },
          },
        });

        await Promise.all(
          todos.map(async (todo) => {
            return await ctx.prisma.todo.update({
              where: {
                id: todo.id,
              },
              data: {
                index: todo.index - 1,
              },
            });
          })
        );
      }

      return await ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          index: input.index,
        },
      });
    }),
});
