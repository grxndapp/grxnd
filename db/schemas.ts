import { boolean, integer, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
   id: serial("id").primaryKey(),
   userid: text("userid"),
   name: text("name"),
   email: text("email"),
   password: text("password"),
   oauth_provider: text("oauth_provider"),
   user_role: text("user_role"),
   is_subscribed: boolean("is_subscribed"),
   createdAt: timestamp("created_at").defaultNow(),
});

export const quizzesTable = pgTable("quizzes", {
   id: serial("id").primaryKey(),
   userid: text("userid"),
   subjectLevel: text("subjectLevel"),
   subject: text("subject"),
   topic: text("topic"),
   score: integer("score"),
   createdAt: timestamp("created_at").defaultNow(),
});

export const savedQuizzesTable = pgTable("saved_quizzes", {
   id: uuid("id").defaultRandom().primaryKey(),
   userid: text("userid").notNull(),
   subjectLevel: text("subjectLevel").notNull(),
   subject: text("subject").notNull(),
   topic: text("topic").notNull(),
   score: integer("score").notNull(),
   quizJson: text("quiz_json").notNull(),
   createdAt: timestamp("created_at").defaultNow(),
});

export const tempQuizzesTable = pgTable("temp_quizzes", {
   id: uuid("id").defaultRandom().primaryKey(),
   quizJson: text("quiz_json").notNull(),
   title: text("title").notNull(),
   subject: text("subject").notNull()
});

export const notesTable = pgTable("notes", {
   id: serial("id").primaryKey(),
   userid: text("userid"),
   noteid: text("noteid"),
   subject: text("subject").default(""),
   noteJson: text("note_json"),
   createdAt: timestamp("created_at").defaultNow(),
});

export const scoresTable = pgTable("scores", {
   id: serial("id").primaryKey(),
   userid: text("userid"),
   score: integer("score"),
})