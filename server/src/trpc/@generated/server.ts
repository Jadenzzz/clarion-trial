import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  users: t.router({
    createUser: publicProcedure.input(z.object({ name: z.string(), email: z.string() })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getUserById: publicProcedure.input(z.object({ id: z.string() })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getAllUsers: publicProcedure.output(z.array(z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      role: z.enum(['INTERN', 'ENGINEER', 'ADMIN']),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

