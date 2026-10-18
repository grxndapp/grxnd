import { dalDbOperation, dalRequireAuth, dalRequireSubscriber } from "@/dal/helpers";
import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import { notesTable } from "@/db/schemas";
import NoteBooksPage from "./NoteBooksPage";
import LoadingPage from "./loading";

export default async function NoteBooks () {   
   await dalRequireSubscriber();
   const notes = await dalRequireAuth(user => 
      dalDbOperation(async () => {
         return await db
            .select()
            .from(notesTable)
            .where(eq(notesTable.userid, user.userid!))
            .orderBy(desc(notesTable.createdAt))
      })
   );

   if (notes.success) {
      return <NoteBooksPage notes={notes.data as any} />;
   } else {
      return <LoadingPage />;
   }
}