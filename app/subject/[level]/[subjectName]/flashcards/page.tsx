import { dalDbOperation, dalRequireAuth, dalRequireSubscriber } from "@/dal/helpers";
import { db } from "@/db";
import { notesTable } from "@/db/schemas";
import { and, desc, eq } from "drizzle-orm";
import { titleCase } from "@/lib/str";
import { sanitise } from "@/utils/extractJson";
import { isAmongstDefaultSubjects } from "@/utils/subjects";
import LoadingPage from "../loading";
import CustomSubFlashcardsPage from "./CustomSubFlashcards";
import DefaultSubFlashcards from "./DefaultSubFlashcards";

type FlashcardProps = {
   params: Promise<{
      level: string;
      subjectName: string;
   }>,
   searchParams: Promise<{
      noteId?: string;
   }>
}

export const dynamic = "force-dynamic";

export default async function SubjectFlashcards ({ params, searchParams }: FlashcardProps) {
   await dalRequireSubscriber();

   const { noteId } = await searchParams;
   const { subjectName: sn, level } = await params;
   const actualLevel = level == "none" ? "" : level.replaceAll("-"," ");

   const subjectName = sn.replaceAll("-"," ");
   const folderCodeName = `${actualLevel ? actualLevel+' ' : ''}${subjectName}`.toLowerCase().replaceAll("-"," ");
   const subjectInfo = titleCase(`${actualLevel} ${subjectName}`.trim());
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
               :  [undefined]
            
            return {
               notes: noteId ? undefined : res,
               noteSelected: noteId ? res[0] : undefined
            }
         })
      );
   
      if (subjectNotesForQuiz.success) {
         return (
            <DefaultSubFlashcards 
               subjectLevel={titleCase(actualLevel.replaceAll("-"," "))}
               subject={subjectName.replaceAll("-"," ")}
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
            <CustomSubFlashcardsPage 
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