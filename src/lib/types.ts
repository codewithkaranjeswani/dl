import { z } from "zod";

export const USER_ROLE = {
  USER: "User",
  EDUCATOR: "Educator",
  ADMIN: "Admin",
} as const;
type ObjectValues<T> = T[keyof T];
export type UserRole = ObjectValues<typeof USER_ROLE>;

export const ZCourseCreate = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
});

export type TCourseCreate = z.infer<typeof ZCourseCreate>;

export const ZQuizCreate = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  courseId: z.number(),
});

export type TQuizCreate = z.infer<typeof ZQuizCreate>;

export const ZQuesCreate = z.object({
  qtext: z.string().min(2, {
    message: "Question Text must have atleast 2 characters.",
  }),
  atext: z.string().min(2, {
    message: "Answer Text must have atleast 2 characters.",
  }),
  order: z.coerce.number(),
  description: z.string(),
  quizId: z.number(),
});

export type TQuesCreate = z.infer<typeof ZQuesCreate>;
