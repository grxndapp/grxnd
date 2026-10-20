import { dalDbOperation, dalRequireSubscribedAuth, dalRequireSubscriber } from '@/dal/helpers'
import { db } from '@/db';
import { quizzesTable } from '@/db/schemas';
import { eq } from 'drizzle-orm';
import { sanitise } from '@/utils/extractJson';
import LoadingPage from './loading';
import ExamReadyScorePage from './ExamReadyScorePage';

export default async function page() {
   await dalRequireSubscriber();

   const dataReq = await dalRequireSubscribedAuth(user => 
      dalDbOperation(async () => {
         const quizzes = await db
            .select()
            .from(quizzesTable)
            .where(eq(quizzesTable.userid, user.userid!))
         
         return quizzes;
      })
   );

   if (dataReq.success) {
      return <ExamReadyScorePage quizzes={sanitise(dataReq.data)} />
   } else {
      return <LoadingPage />
   }

}
