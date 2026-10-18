import { dalDbOperation, dalRequireAuth, dalRequireSubscriber } from "@/dal/helpers";
import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import { savedQuizzesTable } from "@/db/schemas";
import LoadingPage from "./loading";
import QuizzesPage from "./QuizzesPage";

export default async function SavedQuizzes () {   
   await dalRequireSubscriber();

   const savedQuizzes = await dalRequireAuth(user => 
      dalDbOperation(async () => {
         return await db
            .select()
            .from(savedQuizzesTable)
            .where(eq(savedQuizzesTable.userid, user.userid!))
            .orderBy(desc(savedQuizzesTable.createdAt))
      })
   );

   if (savedQuizzes.success) {
      return <QuizzesPage savedQuizzes={JSON.parse(JSON.stringify(savedQuizzes.data))} />
   } else {
      return <LoadingPage />;
   }
}