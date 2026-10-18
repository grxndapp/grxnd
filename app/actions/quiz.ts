"use server"
import { dalDbOperation, dalRequireAuth } from "@/dal/helpers"
import { db } from "@/db"
import { quizzesTable, savedQuizzesTable, scoresTable, tempQuizzesTable } from "@/db/schemas"
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

   return result.success ? result.data : false;
}

export async function userSavedQuiz(subjectLevel: string, subject: string, subjectTopic: string, score: number, quizJson: string) {
   try {
      const result = await dalRequireAuth((user) => 
         dalDbOperation(async () => {
            const res = await db.insert(savedQuizzesTable).values({
               userid: user.userid!,
               subjectLevel, subject,
               topic: subjectTopic,
               score, quizJson
            });
      
            return res.rowCount === 1;
         })
      );

      return result.success ? result.data : false;
   } catch (err) {
      console.error(err)
      return false;
   }
}

export async function createTempQuiz (title: string, subject: string, quizJson: string) {
   try {
      const result = await dalRequireAuth((user) => 
         dalDbOperation(async () => {
            const [res] = await db.insert(tempQuizzesTable).values({
               subject, title, quizJson
            }).returning({ id: tempQuizzesTable.id });
            if (!res) return false;
      
            return res.id;
         })
      );

      return result.success ? result.data : false;
   } catch (err) {
      console.error(err)
      return false;
   }
}

export async function deleteTempQuiz (tempId: string) {
   try {
      const result = await dalRequireAuth((user) => 
         dalDbOperation(async () => {
            const res = await db.delete(tempQuizzesTable).where(eq(tempQuizzesTable.id, tempId));
            return res.rowCount === 1;
         })
      );

      return result.success ? result.data : false;
   } catch (err) {
      console.error(err)
      return false;
   }
}