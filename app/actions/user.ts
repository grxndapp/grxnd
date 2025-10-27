"use server"
import { dalDbOperation, dalRequireAuth } from "@/dal/helpers";
import { db } from "@/db";
import { scoresTable, usersTable } from "@/db/schemas";
import { authOptions } from "@/lib/authOptions"
import { hashPwd, uuid } from "@/utils/uuid";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth"

export async function getCurrentUser (): Promise<User | null> {
   try {
      const session = await getServerSession(authOptions);

      if (!session) return null;
      if (!session.user) return null;

      const user = await db.select().from(usersTable).where(eq(usersTable.email, session.user.email!)).limit(1);
      
      return user[0] as User;
   } catch (err) {
      return null;
   }
}

export async function getUserByEmail (email: string): Promise<User | null> {
   try {
      const user = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
      return user[0] as User;
   } catch (err) {
      return null;
   }
}

export async function manageUserSubscription (email: string, subscribe: boolean): Promise<boolean> {
   try {
      const result = await db
         .update(usersTable)
         .set({ is_subscribed: subscribe })
         .where(eq(usersTable.email, email));

      return (result.rowCount === 1);
   } catch (err) {
      return false;
   }
}

export async function createUserAccount (user: Omit<User, 'userid' | 'createdAt' | 'id' | 'oauth_provider' | 'user_role' | 'is_subscribed'>) {
   try {
      const userid = uuid();
      await db.insert(usersTable).values({
         userid,
         name: user.name,
         email: user.email,
         password: hashPwd(user.password),
         oauth_provider: "nv-credentials",
         user_role: "user",
         is_subscribed: false
      });
      await db.insert(scoresTable).values({ userid, score: 0 })
      return true;
   } catch (e) {
      return false;
   }
}

export async function changeUserPassword (password: string) {
   try {
      const user = await getCurrentUser();
      if (user == null) return false;
      
      const hashed = hashPwd(password);
      const result = await db
      .update(usersTable)
      .set({ password: hashed })
      .where(
         and(
            eq(usersTable.userid, user.userid!),
            eq(usersTable.email, user.email!)
         )
      );
      return (result.rowCount === 1);
   } catch (e) {
      return false;
   }
}

export async function deleteUserAccount () {
   try {
      const user = await getCurrentUser();
      if (user == null) return false;
      
      const res = await dalRequireAuth(user => 
         dalDbOperation(async () => {
            const result = await db
            .delete(usersTable)
            .where(
               and(
                  eq(usersTable.userid, user.userid!),
                  eq(usersTable.email, user.email!)
               )
            )
            if (!(result.rowCount > 0)) return false;
            const result2 = await db
            .delete(scoresTable)
            .where(eq(scoresTable.userid, user.userid!))
            return (result2.rowCount > 0);
         })
      )
      return res;
   } catch (e) {
      return false;
   }
}

export async function checkForNoExistingUser (email: string): Promise<boolean | 'google-auth'> {
   try {
      const users = await db
      .select().from(usersTable)
      .where(and(
         eq(usersTable.email, email)
      )).limit(1);

      if (users.length < 1) {
         return true;
      } else {
         if (users[0].oauth_provider === "google") return "google-auth";
         return false;
      }
   } catch (e) {
      return false;
   }
}