"use server"
import { db } from "@/db";
import { usersTable } from "@/db/schemas";
import { eq } from "drizzle-orm";

export async function setUserAccessById (userId: string, access: boolean) {
   try {
      const updatedAccess = await db
         .update(usersTable)
         .set({ is_subscribed: access })
         .where(eq(usersTable.userid, userId))
      
      return updatedAccess.rowCount === 1;
   } catch (err) {
      console.error(err);
      return false;
   }
}

export async function getUserFromStripeCustomerId (customerId: string) {
   try {
      const res = await db
         .select().from(usersTable)
         .where(eq(usersTable.stripeCustomerId, customerId))
         .limit(1);
      return res.length > 0 ? res[0] : null;
   } catch (err) {
      console.error(err);
      return null;
   }
}