"use server"
import { dalDbOperation, dalRequireAuth } from "@/dal/helpers"
import { db } from "@/db"
import { notesTable } from "@/db/schemas"
import { uuid } from "@/utils/uuid"

export async function addNoteToBackpack (noteInfo: NoteMaker, subject: string) {
   const result = await dalRequireAuth((user) => 
      dalDbOperation(async () => {
         const res = await db.insert(notesTable).values({
            userid: user.userid, subject,
            noteid: uuid(),
            noteJson: JSON.stringify(noteInfo)
         });
         return res.rowCount === 1;
      })
   );

   return result.success ? result.data : false;
}

export async function addNoteToFolder (noteInfo: NoteMaker, folderCodeName: string) {
   const result = await dalRequireAuth((user) => 
      dalDbOperation(async () => {
         const res = await db.insert(notesTable).values({
            userid: user.userid, subject: '',
            noteid: uuid(), folderCodeName,
            noteJson: JSON.stringify(noteInfo)
         });
         return res.rowCount === 1;
      })
   );

   return result.success ? result.data : false;
}