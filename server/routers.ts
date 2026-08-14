import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,

  // TODO: add feature routers here, e.g.
  // programs: router({ list: publicProcedure.query(...) }),
});

export type AppRouter = typeof appRouter;
