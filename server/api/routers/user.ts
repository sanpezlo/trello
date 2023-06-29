import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { columnsStatus } from "@/utils/todos";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
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

  updateColumnPreferences: protectedProcedure
    .input(
      z.object({
        id: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
        index: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const id = columnsStatus.findIndex((status) => status === input.id);

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!user)
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      const updates = [
        [
          () => {
            return;
          },

          async () => {
            await ctx.prisma.user.update({
              where: {
                id: ctx.session.user.id,
              },
              data: {
                first: user.second,
                second: id,
              },
            });
          },

          async () => {
            await ctx.prisma.user.update({
              where: {
                id: ctx.session.user.id,
              },
              data: {
                first: user.second,
                second: user.third,
                third: id,
              },
            });
          },
        ],
        [
          async () => {
            await ctx.prisma.user.update({
              where: {
                id: ctx.session.user.id,
              },
              data: {
                first: id,
                second: user.first,
              },
            });
          },
          () => {
            return;
          },
          async () => {
            await ctx.prisma.user.update({
              where: {
                id: ctx.session.user.id,
              },
              data: {
                second: user.third,
                third: id,
              },
            });
          },
        ],
        [
          async () => {
            await ctx.prisma.user.update({
              where: {
                id: ctx.session.user.id,
              },
              data: {
                first: id,
                second: user.first,
                third: user.second,
              },
            });
          },

          async () => {
            await ctx.prisma.user.update({
              where: {
                id: ctx.session.user.id,
              },
              data: {
                second: id,
                third: user.second,
              },
            });
          },
          () => {
            return;
          },
        ],
      ];

      await (
        (
          updates[user.first === id ? 0 : user.second === id ? 1 : 2] as [
            () => Promise<void>
          ]
        )[input.index] as () => Promise<void>
      )();
    }),
});
