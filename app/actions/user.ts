"use server"
import { dalDbOperation, dalRequireAdminAuth, dalRequireAuth } from "@/dal/helpers";
import { db } from "@/db";
import { forgotPasswordTable, notesTable, quizzesTable, savedQuizzesTable, scoresTable, subjectFoldersTable, usersTable } from "@/db/schemas";
import { authOptions } from "@/lib/authOptions"
import { hashPwd, uuid } from "@/utils/uuid";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth"
import ForgotPwdEmail from "@/emails/ForgotPwdEmail";
import WelcomeToGrxndEmail from "@/emails/WelcomeEmail";
import sendMail from "@/lib/sendMail";
import SuccessResetPasswordEmail from "@/emails/SuccessResetPasswordEmail";
import FreeSubscriptionTestEmail from "@/emails/FreeSubscriptionTestEmail";

export async function getCurrentUser (): Promise<User | null> {
   try {
      const session = await getServerSession(authOptions);

      if (!session) return null;
      if (!session.user) return null;

      const [user] = await db.select().from(usersTable).where(eq(usersTable.email, session.user.email!)).limit(1);
      
      return (user ?? null) as any;
   } catch (err) {
      return null;
   }
}

export async function getUserClient (): Promise<ClientUser | null> {
   try {
      const session = await getServerSession(authOptions);

      if (!session) return null;
      if (!session.user) return null;

      const [user] = await db.select({
         userid: usersTable.userid,
         name: usersTable.name,
         is_subscribed: usersTable.is_subscribed,
      }).from(usersTable).where(eq(usersTable.email, session.user.email!)).limit(1);
      
      return (user ?? null) as any;
   } catch (err) {
      return null;
   }
}

export async function getCurrentUserScore (): Promise<number | null> {
   try {
      const session = await getServerSession(authOptions);

      if (!session) return null;
      if (!session.user) return null;

      const [user] = await db.select().from(usersTable).where(eq(usersTable.email, session.user.email!)).limit(1);
      if (!user) return null;

      const [userScore] = await db.select().from(scoresTable).where(eq(scoresTable.userid, user.userid!)).limit(1);
      if (!userScore) return null;
      
      return userScore.score;
   } catch (err) {
      return null;
   }
}

export async function getUserByEmail (email: string): Promise<User | null> {
   try {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
      return (user ?? null) as any;
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

export async function sendUserForgotPasswordEmail (email: string): Promise<boolean> {
   try {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
      
      if (user) {
         const [res] = await db.insert(forgotPasswordTable).values({
            userid: user.userid!
         }).returning({ id: forgotPasswordTable.forgottenPasswordCode });

         if (res) {
            const sentForgotPasswordEmail = await sendMail(
               user.email!, "Grxnd - Reset your Password",
               ForgotPwdEmail({ username: user.name!, code: res.id! })
            )

            return sentForgotPasswordEmail;
         } else {
            console.error("Failed to create forgotten password");
            return false;
         }
      } else {
         console.error("User not found");
         return false;
      }
   } catch (err) {
      console.error(err);
      return false;
   }
}

export async function createUserAccount (user: Omit<User, 'userid' | 'createdAt' | 'id' | 'oauth_provider' | 'user_role' | 'is_subscribed'>) {
   try {
      const userid = uuid();
      const res = await db.insert(usersTable).values({
         userid,
         name: user.name,
         email: user.email.toLowerCase(),
         password: hashPwd(user.password),
         oauth_provider: "nv-credentials",
         user_role: "user",
         is_subscribed: false
      });
      const res2 = await db.insert(scoresTable).values({ userid, score: 0 });

      if (res.rowCount == 1 && res2.rowCount == 1) {
         await sendMail(user.email, "Welcome to Grxnd", WelcomeToGrxndEmail({ username: user.name }))
      }

      return (res.rowCount == 1 && res2.rowCount == 1);
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
      console.error(e);
      return false;
   }
}

export async function resetUserPassword (forgotPasswordCode: string, userid: string, password: string) {
   try {
      const hashed = hashPwd(password);
      const result = await db.update(usersTable).set({ password: hashed }).where(eq(usersTable.userid, userid));
      const result2 = await db.delete(forgotPasswordTable).where(eq(forgotPasswordTable.forgottenPasswordCode, forgotPasswordCode));

      const [user] = await db.select().from(usersTable).where(eq(usersTable.userid, userid)).limit(1);
      if (result.rowCount === 1 && result2.rowCount === 1 && user) {
         const sentResetPasswordSuccess = await sendMail(
            user.email!, "Grxnd - Successfully Reset your Password",
            SuccessResetPasswordEmail({ username: user.name! })
         )
         return sentResetPasswordSuccess;
      } else {
         console.error("Failed to create forgotten password");
         return false;
      }
   } catch (e) {
      console.error(e);
      return false;
   }
}

export async function deleteUserAccount () {
   try {
      const user = await getCurrentUser();
      if (user == null) return false;
      
      const res = await dalRequireAuth(user => 
         dalDbOperation(async () => {
            const result = await db.delete(usersTable)
               .where(
                  and(
                     eq(usersTable.userid, user.userid!),
                     eq(usersTable.email, user.email!)
                  )
               )
            if (result.rowCount !== 1) return false;

            const result2 = await db
               .delete(scoresTable)
               .where(eq(scoresTable.userid, user.userid!))
            if (result2.rowCount !== 1) return false;

            await db.delete(quizzesTable).where(eq(quizzesTable.userid, user.userid!))
            await db.delete(notesTable).where(eq(notesTable.userid, user.userid!))
            await db.delete(subjectFoldersTable).where(eq(subjectFoldersTable.userid, user.userid!))
            await db.delete(forgotPasswordTable).where(eq(forgotPasswordTable.userid, user.userid!))

            return (result.rowCount === 1 && result2.rowCount === 1);
         })
      )
      return res.success ? res.data : false;
   } catch (e) {
      console.error(e);
      return false;
   }
}

export async function checkForNoExistingUser (email: string): Promise<boolean | 'google-auth'> {
   try {
      const users = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
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

export async function adminUpgradeUserSubscription (targetUserId: string, userEmail: string, username: string, subscribe: boolean) {
   try {
      const upgraded = await dalRequireAdminAuth(async user => 
         await dalDbOperation(async () => {
            const res = await db
               .update(usersTable).set({ is_subscribed: subscribe })
               .where(eq(usersTable.userid, targetUserId));
            
            return (res.rowCount == 1)
         })
      )

      if (upgraded.success && upgraded.data) {
         if (subscribe) {
            const sent = await sendMail(
               userEmail, "I have a gift for you",
               FreeSubscriptionTestEmail({ username })
            );
            return sent;
         }
         return true;
      } else {
         return false;
      }
   } catch (e) {
      console.error(e);
      return false;
   }
}