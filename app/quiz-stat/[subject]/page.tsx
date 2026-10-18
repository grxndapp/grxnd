import { redirect } from "next/navigation";
import { dalDbOperation, dalRequireSubscribedAuth } from "@/dal/helpers";
import { db } from "@/db";
import { quizzesTable } from "@/db/schemas";
import { and, eq, or } from "drizzle-orm";
import { titleCase } from "@/lib/str";
import QuizStatPage from "./QuizStatPage";
import LoadingPage from "./loading";

type QuizStatProps = {
   params: Promise<{
      subject: string;
   }>,
   searchParams: Promise<{
      level: string;
   }>
}

export default async function NoteBook ({ params, searchParams }: QuizStatProps) {
   const { subject } = await params;
   const { level } = await searchParams;

   const quizzes = await dalRequireSubscribedAuth(user =>
      dalDbOperation(async () => {
         return await db
            .select()
            .from(quizzesTable)
            .where(and(
               eq(quizzesTable.userid, user.userid!),
               or(
                  and(
                     eq(quizzesTable.subject, `${titleCase(subject.replaceAll("-"," "))}`),
                     eq(quizzesTable.subjectLevel, level),
                  ),
                  and(
                     eq(quizzesTable.subject, `${titleCase(subject.replaceAll("-"," "))}`),
                     eq(quizzesTable.subjectLevel, ''),
                  )
               )
            ))
      })
   )

   if (quizzes.success) {
      if (quizzes.data.length < 1) redirect("/home");
      return <QuizStatPage subject={subject.replaceAll("-"," ")} quizzes={quizzes.data as any} subjectLevel={level} />;
   } else {
      return <LoadingPage />;
   }
}