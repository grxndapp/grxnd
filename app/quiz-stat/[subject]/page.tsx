import { redirect } from "next/navigation";
import { dalDbOperation, dalRequireSubscribedAuth } from "@/dal/helpers";
import { db } from "@/db";
import { quizzesTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import { titleCase } from "@/lib/str";
import QuizStatPage from "./QuizStatPage";
import LoadingPage from "./loading";

type QuizStatProps = {
   params: Promise<{
      subject: string;
   }>
}

export default async function NoteBook ({ params }: QuizStatProps) {
   const { subject } = await params;

   const quizzes = await dalRequireSubscribedAuth(user =>
      dalDbOperation(async () => {
         return await db
            .select()
            .from(quizzesTable)
            .where(and(
               eq(quizzesTable.userid, user.userid!), 
               eq(quizzesTable.subject, `${titleCase(subject.replaceAll("-"," "))}`)
            ))
      })
   )

   if (quizzes.success) {
      if (quizzes.data.length < 1) redirect("/home");
      return <QuizStatPage subject={subject.replaceAll("-"," ")} quizzes={quizzes.data as any} />;
   } else {
      return <LoadingPage />;
   }
}