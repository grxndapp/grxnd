"use server"
import { dalDbOperation, dalRequireSubscribedAuth } from "@/dal/helpers";
import { getCurrentUser } from "./user";
import { db } from "@/db";
import { feedbackTable } from "@/db/schemas";
import { count, desc, eq, sql } from "drizzle-orm";
import { formatMilliseconds } from "@/utils/date";

export async function canSendFeedback () {
   try {
      const user = await getCurrentUser();
      if (!user) {
         return {
            canSend: false,
            reason: "Please sign in to send your feedback"
         }
      }

      const lastUserFeedback = await dalDbOperation(async () => {
         const [res] = await db
            .select({ createdAt: feedbackTable.createdAt }).from(feedbackTable)
            .where(eq(feedbackTable.userid, user.userid))
            .orderBy(desc(feedbackTable.createdAt))
            .limit(1);
         
         const res2 = await db
            .select({ howMuch: count(feedbackTable.feedbackId) })
            .from(feedbackTable)
            .where(eq(feedbackTable.resolved, false));
         
         return {
            lastUserFeedback: res,
            isMaxFeedbacks: res2[0].howMuch == 20
         };
      })

      console.log(lastUserFeedback)

      if (lastUserFeedback.success) {
         if (!lastUserFeedback.data.lastUserFeedback) {
            return {
               canSend: true,
               reason: "Has not sent a feedback."
            };
         } else if (lastUserFeedback.data.isMaxFeedbacks) {
            return {
               canSend: false,
               reason: "You cannot send feedback at this time. Please check again later."
            };
         } else {
            const lastUserFeedbackDate = new Date(lastUserFeedback.data.lastUserFeedback.createdAt);
            const currentDate = new Date();
            const sevenDays = 7 * 24 * 60 * 60 * 1000;
            if (lastUserFeedbackDate.getTime() < (currentDate.getTime() - sevenDays)) {
               return {
                  canSend: true,
                  reason: "Has not sent a feedback in the last seven days."
               };
            } else {
               const allowedDate = new Date(lastUserFeedbackDate.getTime() + sevenDays);
               return {
                  canSend: false,
                  reason: `You can send your next feedback after ${formatMilliseconds(allowedDate.getTime())}.`
               };
            }
         }
      } else {
         return {
            canSend: false,
            reason: "You cannot send feedback at this time. Please check again later."
         };
      }
   } catch (err) {
      console.error(err);
      return {
         canSend: false,
         reason: "You cannot send feedback at this time. Please check again later."
      };
   }
}


export async function userCreateFeedback (feedback: string) {
   try {
      const user = await getCurrentUser();
      if (!user) return {
         sent: false,
         error: "Please sign in!"
      };

      const canUserSendFeedback = await canSendFeedback();
      if (!canUserSendFeedback.canSend) return {
         sent: false,
         error: canUserSendFeedback.reason
      };

      const addedFeedback = await dalRequireSubscribedAuth(user => 
         dalDbOperation(async () => {
            const res = await db
               .insert(feedbackTable)
               .values({ userid: user.userid!, feedback });
            
            return res.rowCount === 1;
         })
      );

      return addedFeedback.success 
         ? { sent: true, error: undefined }
         : { sent: false, error: "You cannot send feedback at this time. Please check again later." };
   } catch (err) {
      console.error(err);
      return {
         sent: false,
         error: "You cannot send feedback at this time. Please check again later."
      };
   }
}

export async function upvoteFeedback (feedbackId: string, accumulator: number) {
   try {
      const user = await getCurrentUser();
      if (!user) return false;

      const addedFeedbackUpVote = await dalRequireSubscribedAuth(user => 
         dalDbOperation(async () => {
            const res = await db
               .update(feedbackTable)
               .set({ votes: sql`${feedbackTable.votes} + ${accumulator}` })
               .where(eq(feedbackTable.feedbackId, feedbackId));
            
            return res.rowCount === 1;
         })
      );

      return addedFeedbackUpVote.success ? addedFeedbackUpVote.data : false;
   } catch (err) {
      console.error(err);
      return false;
   }
}

export async function getAllRecentFeedback () {
   try {
      const user = await getCurrentUser();
      if (!user) return false;

      const allRecentFeedback = await dalRequireSubscribedAuth(user => 
         dalDbOperation(async () => {
            return await db
               .select().from(feedbackTable)
               .where(eq(feedbackTable.resolved, false))
               .orderBy(desc(feedbackTable.createdAt));
         })
      );

      return allRecentFeedback.success ? allRecentFeedback.data : false;
   } catch (err) {
      console.error(err);
      return false;
   }
}