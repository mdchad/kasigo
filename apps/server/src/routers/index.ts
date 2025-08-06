import {
  protectedProcedure, publicProcedure,
  router,
} from "@/lib/trpc";
import { todoRouter } from "./todo";
import { automationRouter } from "./automation";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  todo: todoRouter,
  automation: automationRouter,
});
export type AppRouter = typeof appRouter;
