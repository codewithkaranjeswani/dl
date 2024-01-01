import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { quizes } from "@/server/db/schema";
import { ZQuizCreate } from "@/lib/types";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

export const quizRouter = createTRPCRouter({
  create: protectedProcedure
    .input(ZQuizCreate)
    .mutation(async ({ ctx, input }) => {
      const dt = new Date();
      return await ctx.db.insert(quizes).values({
        title: input.title,
        description: input.description,
        authorId: ctx.session.user.id,
        courseId: input.courseId,
        createdAt: dt,
        updatedAt: dt,
      });
    }),

  getByIdWithQuestions: protectedProcedure
    .input(z.object({ quizId: z.number() }))
    .query(async ({ ctx, input }) => {
      // questions should be ordered by order
      return await ctx.db.query.quizes.findFirst({
        where: eq(quizes.id, input.quizId),
        with: { questions: true },
      });
    }),
  getMineById: protectedProcedure
    .input(z.object({ quizId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.quizes.findFirst({
        where: and(
          eq(quizes.id, input.quizId),
          eq(quizes.authorId, ctx.session.user.id),
        ),
      });
    }),

  getMineByCourseId: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.quizes.findMany({
        where: and(
          eq(quizes.courseId, input.courseId),
          eq(quizes.authorId, ctx.session.user.id),
        ),
        orderBy: (quizes, { desc }) => [desc(quizes.createdAt)],
      });
    }),
});
