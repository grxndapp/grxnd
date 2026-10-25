import { dalDbOperation, dalRequireAuth, dalRequireSubscriber } from "@/dal/helpers";
import { db } from "@/db";
import { notesTable } from "@/db/schemas";
import { and, desc, eq } from "drizzle-orm";
import { titleCase } from "@/lib/str";
import { sanitise } from "@/utils/extractJson";
import { fullSubjectBreakDown, isAmongstDefaultSubjects, retrieveSubjectTopic } from "@/utils/subjects";
import LoadingPage from "./loading";
import SubjectStartQuiz from "./SubjectStartQuiz";
import DefaultSubjectStartQuiz from "./DefaultSubjectStartQuiz";

type SubjectStatProps = {
   params: Promise<{
      level: string;
      subjectName: string;
   }>,
   searchParams: Promise<{
      noteId?: string;
   }>
}

export default async function SubjectNotesStartQuiz ({ params, searchParams }: SubjectStatProps) {
   await dalRequireSubscriber();

   const { noteId } = await searchParams;
   const { subjectName, level } = await params;
   const actualLevel = level == "none" ? "" : level.replaceAll("-"," ");

   const folderCodeName = `${actualLevel ? actualLevel+' ' : ''}${subjectName}`.toLowerCase().replaceAll("-"," ");
   const subjectInfo = titleCase(`${actualLevel} ${subjectName}`);
   const fullSubjectInfo = fullSubjectBreakDown(subjectInfo);
   const isDefaultSubject = isAmongstDefaultSubjects(subjectInfo);

   if (isDefaultSubject) {
      const subjectNotesForQuiz = await dalRequireAuth(user => 
         dalDbOperation(async () => {
            const res = noteId
               ?  await db.select().from(notesTable).where(and(
                     eq(notesTable.userid, user.userid!),
                     eq(notesTable.folderCodeName, folderCodeName),
                     eq(notesTable.noteid, noteId)
                  )).limit(1)
               :  [
                  ...retrieveSubjectTopic(fullSubjectInfo.subjectLevel, fullSubjectInfo.subject)!
               ]
            
            return {
               notes: noteId ? undefined : res,
               noteSelected: noteId ? res[0] : undefined
            }
         })
      );
   
      if (subjectNotesForQuiz.success) {
         return (
            <DefaultSubjectStartQuiz 
               subjectLevel={titleCase(actualLevel.replaceAll("-"," "))}
               subject={subjectName.replaceAll("-"," ")} 
               subjectTopics={subjectNotesForQuiz.data.notes ? sanitise(subjectNotesForQuiz.data.notes) : undefined}
               noteSelected={subjectNotesForQuiz.data.noteSelected ? sanitise(subjectNotesForQuiz.data.noteSelected) : undefined}
            />
         );
      } else {
         return <LoadingPage />;
      }

   } else {
      const subjectNotesForQuiz = await dalRequireAuth(user => 
         dalDbOperation(async () => {
            const res = noteId
               ?  await db.select().from(notesTable).where(and(
                     eq(notesTable.userid, user.userid!),
                     eq(notesTable.folderCodeName, folderCodeName),
                     eq(notesTable.noteid, noteId)
                  )).limit(1)
               :  await db.select().from(notesTable).where(and(
                     eq(notesTable.userid, user.userid!),
                     eq(notesTable.folderCodeName, folderCodeName)
                  )).orderBy(desc(notesTable.createdAt));
            
            return {
               notes: noteId ? undefined : res,
               noteSelected: noteId ? res[0] : undefined
            }
         })
      );
   
      if (subjectNotesForQuiz.success) {
         return (
            <SubjectStartQuiz 
               subjectLevel={titleCase(actualLevel.replaceAll("-"," "))}
               subject={subjectName.replaceAll("-"," ")} 
               notes={subjectNotesForQuiz.data.notes ? sanitise(subjectNotesForQuiz.data.notes) : undefined}
               noteSelected={subjectNotesForQuiz.data.noteSelected ? sanitise(subjectNotesForQuiz.data.noteSelected) : undefined}
            />
         );
      } else {
         return <LoadingPage />;
      }
   }
}