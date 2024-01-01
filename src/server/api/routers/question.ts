import { z } from "zod";
import { ZQuesCreate } from "@/lib/types";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { questions } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const questionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(ZQuesCreate)
    .mutation(async ({ ctx, input }) => {
      const dt = new Date();
      return await ctx.db.insert(questions).values({
        qtext: input.qtext,
        atext: input.atext,
        order: input.order,
        description: input.description,
        authorId: ctx.session.user.id,
        quizId: input.quizId,
        createdAt: dt,
        updatedAt: dt,
      });
    }),

  listByQuizId: protectedProcedure
    .input(z.object({ quizId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.questions.findMany({
        where: eq(questions.quizId, input.quizId),
        orderBy: (questions, { asc }) => [asc(questions.order)],
      });
    }),

  getMineByQuizId: protectedProcedure
    .input(z.object({ quizId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.questions.findMany({
        where: and(
          eq(questions.quizId, input.quizId),
          eq(questions.authorId, ctx.session.user.id),
        ),
        orderBy: (questions, { asc }) => [asc(questions.order)],
      });
    }),
});
