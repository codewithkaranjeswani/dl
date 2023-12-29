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
