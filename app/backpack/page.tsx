import { dalDbOperation, dalRequireSubscribedAuth, dalRequireSubscriber } from "@/dal/helpers";
import { db } from "@/db";
import { quizzesTable, notesTable } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { sanitise } from "@/utils/extractJson";
import LoadingPage from "./loading";
import BackPackPage from "./BackPack";


export default async function BackPack () {
   await dalRequireSubscriber();

   const dataReq = await dalRequireSubscribedAuth(user => 
      dalDbOperation(async () => {
         const quizzes = await db.select().from(quizzesTable).where(eq(quizzesTable.userid, user.userid!));
         const notes = await db.select().from(notesTable).where(eq(notesTable.userid, user.userid!))
         return { quizzes, notes }
      })
   );

   if (dataReq.success) {
      const { quizzes, notes } = dataReq.data;
      return <BackPackPage 
         quizzes={sanitise(quizzes)}
         notes={sanitise(notes)}
      />;
   } else {
      return <LoadingPage />;
   }
}