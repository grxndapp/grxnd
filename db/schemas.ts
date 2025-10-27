import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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

export const notesTable = pgTable("notes", {
   id: serial("id").primaryKey(),
   userid: text("userid"),
   noteid: text("noteid"),
   noteJson: text("note_json"),
   createdAt: timestamp("created_at").defaultNow(),
});

export const scoresTable = pgTable("scores", {
   id: serial("id").primaryKey(),
   userid: text("userid"),
   score: integer("score"),
})