import { dalDbOperation, dalRequireSubscribedAuth } from "@/dal/helpers";
import { db } from "@/db";
import { notesTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import NotebookPage from "./NotebookPage";
import LoadingPage from "./loading";

type NoteBookProps = {
   params: Promise<{
      noteid: string;
   }>
}

export default async function NoteBook ({ params }: NoteBookProps) {
   const { noteid } = await params;

   const notes = await dalRequireSubscribedAuth(user =>
      dalDbOperation(async () => {
         return await db
            .select()
            .from(notesTable)
            .where(and(eq(notesTable.userid, user.userid!), eq(notesTable.noteid, noteid)))
            .limit(1)
      })
   )

   if (notes.success) {
      return <NotebookPage note={notes.data[0] as any} />;
   } else {
      return <LoadingPage />;
   }
}