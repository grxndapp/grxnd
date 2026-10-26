import { dalDbOperation, dalRequireAuth, dalRequireSubscriber } from "@/dal/helpers";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { titleCase } from "@/lib/str";
import { savedQuizzesTable } from "@/db/schemas";
import LoadingPage from "./loading";
import SavedQuizPage from "./SavedQuizPage";

type SavedQuizProps = {
   params: Promise<{
      savedQuizId: string;
      level: string;
      subjectName: string;
   }>
}

export const dynamic = "force-dynamic";

export default async function SavedQuiz ({ params }: SavedQuizProps) {   
   await dalRequireSubscriber();

   const { subjectName, level, savedQuizId } = await params;
   const actualLevel = level == "none" ? "" : level.replaceAll("-"," ");

   const savedQuiz = await dalRequireAuth(user => 
      dalDbOperation(async () => {
         const [res] = await db.select().from(savedQuizzesTable)
            .where(and(
               eq(savedQuizzesTable.userid, user.userid!),
               eq(savedQuizzesTable.id, savedQuizId!),
            )).limit(1);
         
         return res;
      })
   );

   if (savedQuiz.success && savedQuiz.data) {
      return <SavedQuizPage 
         subjectLevel={titleCase(actualLevel.replaceAll("-"," "))}
         subject={subjectName.replaceAll("-"," ")}
         savedQuiz={JSON.parse(JSON.stringify(savedQuiz.data))}
       />
   } else {
      return <LoadingPage />;
   }
}