"use server"
import { dalDbOperation, dalRequireSubscribedAuth } from "@/dal/helpers";
import { db } from "@/db";
import { subjectFoldersTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";

export async function createSubjectFolder (folderName: string) {
   try {
      const created = await dalRequireSubscribedAuth(async user => 
         await dalDbOperation(async () => {
            const res = await db.insert(subjectFoldersTable).values({
               userid: user.userid!, name: folderName
            });
            return res.rowCount === 1;
         })
      );

      return created.success ? created.data : false;
   } catch (err) {
      console.error(err);
      return false;
   }
}


export async function getUserSubjectFolders () {
   try {
      const folders = await dalRequireSubscribedAuth(async user => 
         await dalDbOperation(async () => {
            const res = await db.select().from(subjectFoldersTable).where(eq(subjectFoldersTable.userid, user.userid!));
            return res;
         })
      );
      return folders.success ? folders.data : null;
   } catch (err) {
      console.error(err);
      return null;
   }
}

export async function deleteSubjectFolder (folderId: string) {
   try {
      const folders = await dalRequireSubscribedAuth(async user => 
         await dalDbOperation(async () => {
            const res = await db.delete(subjectFoldersTable).where(and(
               eq(subjectFoldersTable.userid, user.userid!),
               eq(subjectFoldersTable.folderId, folderId),
            ));
            return res.rowCount === 1;
         })
      );
      return folders.success ? folders.data : false;
   } catch (err) {
      console.error(err);
      return false;
   }
}