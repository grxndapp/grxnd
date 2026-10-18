import { dalDbOperation, dalRequireAuth, dalRequireSubscriber } from "@/dal/helpers";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { tempQuizzesTable } from "@/db/schemas";
import { redirect } from "next/navigation";
import TempQuizPage from "./TempQuizPage";

type TempQuizProps = {
   params: Promise<{
      quizId: string;
   }>
}

export default async function TempQuiz ({ params }: TempQuizProps) {   
   await dalRequireSubscriber();

   const { quizId } = await params;

   const tempQuiz = await dalRequireAuth(user => 
      dalDbOperation(async () => {
         const [res] = await db.select().from(tempQuizzesTable).where(eq(tempQuizzesTable.id, quizId)).limit(1);
         return res;
      })
   );

   if (tempQuiz.success && tempQuiz.data) {
      return <TempQuizPage tempQuiz={JSON.parse(JSON.stringify(tempQuiz.data))} />
   } else {
      redirect("/home")
   }
}