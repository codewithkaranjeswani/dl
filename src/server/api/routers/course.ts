import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { courses } from "@/server/db/schema";
import { ZCourseCreate } from "@/lib/types";
import { eq } from "drizzle-orm";

export const courseRouter = createTRPCRouter({
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  create: protectedProcedure
    .input(ZCourseCreate)
    .mutation(async ({ ctx, input }) => {
      const dt = new Date();
      await ctx.db.insert(courses).values({
        title: input.title,
        description: input.description,
        cost: -1,
        authorId: ctx.session.user.id,
        createdAt: dt,
        updatedAt: dt,
      });
    }),

  getMine: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.courses.findMany({
      where: eq(courses.authorId, ctx.session.user.id),
      orderBy: (courses, { desc }) => [desc(courses.createdAt)],
    });
  }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});
