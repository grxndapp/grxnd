import { dalDbOperation, dalRequireSubscribedAuth, dalRequireSubscriber } from "@/dal/helpers";
import { db } from "@/db";
import { notesTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import { titleCase } from "@/lib/str";
import SubjectNotePage from "./SubjectNotePage";
import LoadingPage from "./loading";

type NoteBookProps = {
   params: Promise<{
      noteid: string;
      level: string;
      subjectName: string;
   }>
}

export const dynamic = "force-dynamic";

export default async function NoteBook ({ params }: NoteBookProps) {
   await dalRequireSubscriber();

   const { subjectName, level, noteid } = await params;
   const actualLevel = level == "none" ? "" : level.replaceAll("-"," ");

   const notes = await dalRequireSubscribedAuth(user =>
      dalDbOperation(async () => {
         return await db
            .select().from(notesTable)
            .where(and(eq(notesTable.userid, user.userid!), eq(notesTable.noteid, noteid)))
            .limit(1)
      })
   )

   if (notes.success) {
      return <SubjectNotePage 
         subjectLevel={titleCase(actualLevel.replaceAll("-"," "))}
         subject={subjectName.replaceAll("-"," ")} 
         note={notes.data[0] as any}
      />;
   } else {
      return <LoadingPage />;
   }
}