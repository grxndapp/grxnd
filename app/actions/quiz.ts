"use server"
import { dalDbOperation, dalRequireAuth } from "@/dal/helpers"
import { db } from "@/db"
import { quizzesTable, scoresTable } from "@/db/schemas"
import { eq, sql } from "drizzle-orm";

export async function addQuizScore (subjectLevel: string, subject: string, subjectTopic: string, score: number, pointsGained: number) {
   const result = await dalRequireAuth((user) => 
      dalDbOperation(async () => {
         const [newQuiz] = await db.insert(quizzesTable).values({
            userid: user.userid,
            subjectLevel, subject, score,
            topic: subjectTopic
         })
         .returning({ id: quizzesTable.userid });

         await db
            .update(scoresTable)
            .set({
               score: sql`${scoresTable.score} + ${pointsGained}`
            })
            .where(eq(scoresTable.userid, user.userid!))
   
         return (newQuiz.id === user.userid);
      })
   );

   return result.success;
}