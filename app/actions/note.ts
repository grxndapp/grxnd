"use server"
import { dalDbOperation, dalRequireAuth, dalRequireSubscribedAuth } from "@/dal/helpers"
import { db } from "@/db"
import { notesTable } from "@/db/schemas"
import { uuid } from "@/utils/uuid"
import { and, eq } from "drizzle-orm"

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

export async function deleteSubjectNote (noteId: string) {
   try {
      const deleted = await dalRequireSubscribedAuth(async user => 
         await dalDbOperation(async () => {
            const res = await db.delete(notesTable).where(and(
               eq(notesTable.userid, user.userid!),
               eq(notesTable.noteid, noteId),
            ));
            return res.rowCount === 1;
         })
      );
      return deleted.success ? deleted.data : false;
   } catch (err) {
      console.error(err);
      return false;
   }
}