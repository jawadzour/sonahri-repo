import { z } from "zod";
import bcrypt from "bcryptjs";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { ADMIN_COOKIE_NAME, signAdminSession } from "./_core/auth";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { createInquiry, listInquiries, deleteInquiry } from "./db";
import { sendContactNotification } from "./_core/mailer";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),

    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
          throw new Error(
            "Admin credentials are not configured on the server (ADMIN_EMAIL / ADMIN_PASSWORD_HASH)."
          );
        }

        const emailMatches = input.email.toLowerCase() === adminEmail.toLowerCase();
        const passwordMatches = emailMatches
          ? await bcrypt.compare(input.password, adminPasswordHash)
          : false;

        if (!emailMatches || !passwordMatches) {
          throw new Error("Invalid email or password.");
        }

        const token = await signAdminSession(adminEmail);
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(ADMIN_COOKIE_NAME, token, {
          ...cookieOptions,
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        return { success: true, email: adminEmail } as const;
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(ADMIN_COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  contact: router({
    submitInquiry: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required"),
          email: z.string().email("Valid email is required"),
          phone: z.string().optional(),
          subject: z.string().optional(),
          message: z.string().min(10, "Message must be at least 10 characters"),
          inquiryType: z.string().default("general"),
        })
      )
      .mutation(async ({ input }) => {
        await createInquiry(input);
        await sendContactNotification(input);
        return {
          success: true,
          message: "Thank you! Your inquiry has been received. We will get back to you soon.",
        } as const;
      }),
  }),

  admin: router({
    listInquiries: adminProcedure.query(async () => {
      return listInquiries();
    }),
    deleteInquiry: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteInquiry(input.id);
        return { success: true } as const;
      }),
  }),

  // TODO: add feature routers here, e.g.
  // programs: router({ list: publicProcedure.query(...) }),
});

export type AppRouter = typeof appRouter;
