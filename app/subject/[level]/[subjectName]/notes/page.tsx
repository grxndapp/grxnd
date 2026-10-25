import { dalDbOperation, dalRequireAuth, dalRequireSubscriber } from "@/dal/helpers";
import { db } from "@/db";
import { notesTable } from "@/db/schemas";
import { and, desc, eq } from "drizzle-orm";
import { titleCase } from "@/lib/str";
import SubjectNotesPage from "./SubjectNotesPage";
import LoadingPage from "./loading";

type SubjectStatProps = {
   params: Promise<{
      level: string;
      subjectName: string;
   }>
}

export default async function SubjectNotes ({ params }: SubjectStatProps) {
   await dalRequireSubscriber();

   const { subjectName, level } = await params;
   const actualLevel = level == "none" ? "" : level.replaceAll("-"," ");

   const folderCodeName = `${actualLevel ? actualLevel+' ' : ''}${subjectName}`.toLowerCase().replaceAll("-"," ");

   const subjectNotes = await dalRequireAuth(user => 
      dalDbOperation(async () => {
         return await db
            .select()
            .from(notesTable)
            .where(and(
               eq(notesTable.userid, user.userid!),
               eq(notesTable.folderCodeName, folderCodeName)
            ))
            .orderBy(desc(notesTable.createdAt))
      })
   );

   if (subjectNotes.success) {
      return (
         <SubjectNotesPage 
            subjectLevel={titleCase(actualLevel.replaceAll("-"," "))}
            subject={subjectName.replaceAll("-"," ")} 
            notes={subjectNotes.data as any}
         />
      );
   } else {
      return <LoadingPage />;
   }
}