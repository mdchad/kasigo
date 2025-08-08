import {
  protectedProcedure, publicProcedure,
  router,
} from "@/lib/trpc";
import { todoRouter } from "./todo";
import { onkernelRouter } from "./onkernel";

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
  onkernel: onkernelRouter,
});
export type AppRouter = typeof appRouter;
