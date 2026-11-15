import { dalDbOperation, dalRequireAuth, dalRequireSubscriber } from '@/dal/helpers';
import { titleCase } from '@/lib/str';
import { isAmongstDefaultSubjects } from '@/utils/subjects';
import { db } from '@/db';
import { notesTable } from '@/db/schemas';
import { sanitise } from '@/utils/extractJson';
import { and, desc, eq } from 'drizzle-orm';
import LoadingPage from '../loading';
import LyricGimmickPage from './LyricGimmickPage'

type LyricGimmickProps = {
   params: Promise<{
      level: string;
      subjectName: string;
   }>,
   searchParams: Promise<{
      noteId?: string;
   }>
}

export const dynamic = "force-dynamic";

export default async function page({ params , searchParams}: LyricGimmickProps) {
   await dalRequireSubscriber();

   const { subjectName: sn, level } = await params;
   const actualLevel = level == "none" ? "" : level.replaceAll("-"," ");

   const subjectName = sn.replaceAll("-"," ");
   const folderCodeName = `${actualLevel ? actualLevel+' ' : ''}${subjectName}`.toLowerCase().replaceAll("-"," ");
   const subjectInfo = titleCase(`${actualLevel} ${subjectName}`.trim());
   const isDefaultSubject = isAmongstDefaultSubjects(subjectInfo);

   const customSubjectNotes = await dalRequireAuth(user => 
      dalDbOperation(async () => {
         const res = (!isDefaultSubject)
            ?  await db.select().from(notesTable)
                  .where(and(
                     eq(notesTable.userid, user.userid!),
                     eq(notesTable.folderCodeName, folderCodeName)
                  ))
                  .orderBy(desc(notesTable.createdAt))
            :  [[]]
         
         return res;
      })
   );

   if (customSubjectNotes.success) {
      return (
         <LyricGimmickPage 
            subjectLevel={titleCase(actualLevel.replaceAll("-"," "))}
            subject={subjectName.replaceAll("-"," ")}
            notes={sanitise(customSubjectNotes.data)}
         />
      );
   } else {
      return <LoadingPage />;
   }
}
