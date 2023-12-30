import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  int,
  mysqlTableCreator,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
/**
 * For db fields: Use camelCase in ts and snake_case in mysql, except wherever nextauth interferes!
 */

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `dl_${name}`);

export const courses = mysqlTable(
  "course",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    cost: bigint("cost", { mode: "number" }),
    authorId: varchar("author_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (course) => ({
    authorIdIdx: index("author_id_idx").on(course.authorId),
    descriptionIndex: index("description_idx").on(course.description),
  }),
);

export const courseRelations = relations(courses, ({ one, many }) => ({
  quizes: many(quizes),
  usersToCourses: many(usersToCourses),
  author: one(users, {
    fields: [courses.authorId],
    references: [users.id],
  }),
}));

export const quizes = mysqlTable("quiz", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  authorId: varchar("author_id", { length: 255 }).notNull(),
  courseId: bigint("course_id", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const quizesRelations = relations(quizes, ({ one, many }) => ({
  questions: many(questions),
  course: one(courses, {
    fields: [quizes.courseId],
    references: [courses.id],
  }),
  author: one(users, {
    fields: [quizes.authorId],
    references: [users.id],
  }),
}));

export const questions = mysqlTable("question", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  qtext: varchar("qtext", { length: 255 }).notNull(),
  atext: varchar("atext", { length: 255 }).notNull(),
  order: int("order").notNull(),
  description: varchar("description", { length: 255 }),
  authorId: varchar("author_id", { length: 255 }).notNull(),
  quizId: bigint("quiz_id", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const questionsRelations = relations(questions, ({ one }) => ({
  author: one(users, {
    fields: [questions.authorId],
    references: [users.id],
  }),
  quiz: one(quizes, {
    fields: [questions.quizId],
    references: [quizes.id],
  }),
}));

export const answers = mysqlTable("answer", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  content: varchar("content", { length: 255 }).notNull(),
  correct: boolean("correct").default(false).notNull(),
  description: varchar("description", { length: 255 }),
  authorId: varchar("author_id", { length: 255 }).notNull(),
  questionId: bigint("question_id", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}));

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
  role: varchar("role", { length: 255, enum: ["User", "Educator", "Admin"] }),
  password: varchar("password", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  usersToCourses: many(usersToCourses),
}));

export const usersToCourses = mysqlTable("users_to_courses", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  userId: bigint("user_id", { mode: "number" }),
  courseId: bigint("course_id", { mode: "number" }),
});

export const usersToCoursesRelations = relations(usersToCourses, ({ one }) => ({
  course: one(courses, {
    fields: [usersToCourses.courseId],
    references: [courses.id],
  }),
  user: one(users, {
    fields: [usersToCourses.userId],
    references: [users.id],
  }),
}));

export const accounts = mysqlTable(
  "account",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", {
      length: 255,
    }).notNull(),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: int("expires_at"),
    refresh_token: varchar("refresh_token", { length: 255 }),
    refresh_token_expires_at: int("refresh_token_expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: varchar("id_token", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (account) => ({
    providerProviderAccountIdIndex: uniqueIndex(
      "accounts__provider__providerAccountId__idx",
    ).on(account.provider, account.providerAccountId),
    userIdIndex: index("accounts__userId__idx").on(account.userId),
  }),
);

export const sessions = mysqlTable(
  "session",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (session) => ({
    sessionTokenIndex: uniqueIndex("sessions__sessionToken__idx").on(
      session.sessionToken,
    ),
    userIdIndex: index("sessions__userId__idx").on(session.userId),
  }),
);

export const verificationTokens = mysqlTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull().primaryKey(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (vt) => ({
    tokenIndex: uniqueIndex("verification_tokens__token__idx").on(vt.token),
  }),
);
