"use server"
import { dalDbOperation, dalRequireAuth } from "@/dal/helpers"
import { db } from "@/db"
import { notesTable } from "@/db/schemas"
import { uuid } from "@/utils/uuid"

export async function addNoteToBackpack (noteInfo: NoteMaker) {
   const result = await dalRequireAuth((user) => 
      dalDbOperation(async () => {
         const [newQuiz] = await db.insert(notesTable).values({
            userid: user.userid,
            noteid: uuid(),
            noteJson: JSON.stringify(noteInfo)
         })
         .returning({ id: notesTable.userid });
   
         return (newQuiz.id === user.userid);
      })
   );

   return result.success;
}