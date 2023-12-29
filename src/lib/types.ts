export const USER_ROLE = {
  USER: "User",
  EDUCATOR: "Educator",
  ADMIN: "Admin",
} as const;
type ObjectValues<T> = T[keyof T];
export type UserRole = ObjectValues<typeof USER_ROLE>;
