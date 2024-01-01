import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { courses } from "@/server/db/schema";
import { ZCourseCreate } from "@/lib/types";
import { and, eq } from "drizzle-orm";

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
        publish: false,
        cost: -1,
        authorId: ctx.session.user.id,
        createdAt: dt,
        updatedAt: dt,
      });
    }),

  getAllPublished: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.courses.findMany({
      where: eq(courses.publish, true),
      orderBy: (courses, { desc }) => [desc(courses.createdAt)],
    });
  }),

  getByIdPublished: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.courses.findFirst({
        where: and(eq(courses.id, input.courseId), eq(courses.publish, true)),
        with: { quizes: true },
      });
    }),

  getMine: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.courses.findMany({
      where: eq(courses.authorId, ctx.session.user.id),
      orderBy: (courses, { desc }) => [desc(courses.createdAt)],
    });
  }),

  getMineById: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ ctx, input }) => {
      const dbCourse = await ctx.db.query.courses.findFirst({
        where: eq(courses.id, input.courseId),
      });
      if (!dbCourse) {
        return undefined;
      }
      if (dbCourse.authorId === ctx.session.user.id) {
        return dbCourse;
      } else {
        return undefined;
      }
    }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});
