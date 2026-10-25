import { dalDbOperation, dalRequireAuth, dalRequireSubscriber } from "@/dal/helpers";
import { db } from "@/db";
import { and, desc, eq } from "drizzle-orm";
import { titleCase } from "@/lib/str";
import { savedQuizzesTable } from "@/db/schemas";
import LoadingPage from "./loading";
import QuizzesPage from "./QuizzesPage";

type SubjectStatProps = {
   params: Promise<{
      level: string;
      subjectName: string;
   }>
}

export default async function SubjectSavedQuizzes ({ params }: SubjectStatProps) {
   await dalRequireSubscriber();

   const { subjectName, level } = await params;
   const actualLevel = level == "none" ? "" : titleCase(level.replaceAll("-"," "));
   const subject = titleCase(subjectName.replaceAll("-"," "))

   const savedQuizzes = await dalRequireAuth(user => 
      dalDbOperation(async () => {
         return await db
            .select().from(savedQuizzesTable)
            .where(and(
               eq(savedQuizzesTable.userid, user.userid!),
               eq(savedQuizzesTable.subjectLevel, actualLevel),
               eq(savedQuizzesTable.subject, subject)
            ))
            .orderBy(desc(savedQuizzesTable.createdAt))
      })
   );

   if (savedQuizzes.success) {
      return <QuizzesPage subject={subject} subjectLevel={actualLevel} savedQuizzes={JSON.parse(JSON.stringify(savedQuizzes.data))} />
   } else {
      return <LoadingPage />;
   }
}