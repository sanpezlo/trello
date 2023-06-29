import { createTRPCRouter } from "@/server/api/trpc";
import { todoRouter } from "@/server/api/routers/todo";
import { userRouter } from "@/server/api/routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  todo: todoRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
