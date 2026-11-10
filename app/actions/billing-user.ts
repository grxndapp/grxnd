"use server"

import { dalDbOperation } from "@/dal/helpers";
import { db } from "@/db";
import { usersTable } from "@/db/schemas";
import { eq } from "drizzle-orm";

export async function setUserAccessById (userId: string, access: boolean) {
   try {
      const updatedAccess = await dalDbOperation(async () => {
         const res = await db
            .update(usersTable)
            .set({ is_subscribed: access })
            .where(eq(usersTable.userid, userId));
         return res.rowCount === 1;
      })
      
      return updatedAccess.success ? updatedAccess.data : false;
   } catch (err) {
      console.error(err);
      return false;
   }
}

export async function getUserFromStripeCustomerId (customerId: string) {
   try {
      const user = await dalDbOperation(async () => {
         const res = await db
            .select().from(usersTable)
            .where(eq(usersTable.stripeCustomerId, customerId))
            .limit(1);
         return res.length > 0 ? res[0] : null;
      })
      
      return user.success ? user.data : null;
   } catch (err) {
      console.error(err);
      return null;
   }
}