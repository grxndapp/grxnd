import { dalDbOperation, dalRequireSubscribedAuth } from "@/dal/helpers";
import { db } from "@/db";
import { notesTable, quizzesTable } from "@/db/schemas";
import { and, desc, eq, or } from "drizzle-orm";
import { titleCase } from "@/lib/str";
import SubjectStatPage from "./SubjectStatPage";
import LoadingPage from "./loading";

type SubjectStatProps = {
   params: Promise<{
      level: string;
      subjectName: string;
   }>
}

export const dynamic = "force-dynamic";

export default async function SubjectStat ({ params }: SubjectStatProps) {
   const { subjectName: sn, level } = await params;
   const actualLevel = level == "none" ? "" : level;
   const subjectName = sn.replaceAll("-"," ");
   const folderCodeName = `${actualLevel ? actualLevel+' ' : ''}${subjectName}`.toLowerCase().replaceAll("-"," ");

   const quizzes = await dalRequireSubscribedAuth(user =>
      dalDbOperation(async () => {
         const quizzes = await db
            .select().from(quizzesTable)
            .where(and(
               eq(quizzesTable.userid, user.userid!),
               or(
                  and(
                     eq(quizzesTable.subject, `${titleCase(subjectName.replaceAll("-"," "))}`),
                     eq(quizzesTable.subjectLevel, `${titleCase(actualLevel.replaceAll("-"," "))}`),
                  ),
                  and(
                     eq(quizzesTable.subject, `${titleCase(subjectName.replaceAll("-"," "))}`),
                     eq(quizzesTable.subjectLevel, ''),
                  )
               )
            ))
         
         const notes = await db
            .select()
            .from(notesTable)
            .where(and(
               eq(notesTable.userid, user.userid!),
               eq(notesTable.folderCodeName, folderCodeName)
            ))
            .orderBy(desc(notesTable.createdAt))
            .limit(3);
         
         return { notes, quizzes }
      })
   )

   if (quizzes.success) {
      return (
         <SubjectStatPage 
            subjectLevel={titleCase(actualLevel.replaceAll("-"," "))}
            subject={subjectName.replaceAll("-"," ")} 
            quizzes={quizzes.data.quizzes as any}
            notes={quizzes.data.notes as any}
         />
      );
   } else {
      return <LoadingPage />;
   }
}