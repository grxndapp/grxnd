import { redirect } from "next/navigation";
import { dalDbOperation, dalRequireSubscribedAuth } from "@/dal/helpers";
import { db } from "@/db";
import { quizzesTable } from "@/db/schemas";
import { and, eq, or } from "drizzle-orm";
import { titleCase } from "@/lib/str";
import SubjectStatPage from "./SubjectStatPage";
import LoadingPage from "./loading";

type SubjectStatProps = {
   params: Promise<{
      level: string;
      subjectName: string;
   }>
}

export default async function SubjectStat ({ params }: SubjectStatProps) {
   const { subjectName, level } = await params;
   const actualLevel = level == "none" ? "" : level;

   const quizzes = await dalRequireSubscribedAuth(user =>
      dalDbOperation(async () => {
         return await db
            .select()
            .from(quizzesTable)
            .where(and(
               eq(quizzesTable.userid, user.userid!),
               or(
                  and(
                     eq(quizzesTable.subject, `${titleCase(subjectName.replaceAll("-"," "))}`),
                     eq(quizzesTable.subjectLevel, `${titleCase(actualLevel.replaceAll("-"," "))}`),
                  ),
                  and(
                     eq(quizzesTable.subject, `${titleCase(subjectName.replaceAll("-"," "))}`),
                     eq(quizzesTable.subjectLevel, ''),
                  )
               )
            ))
      })
   )

   if (quizzes.success) {
      if (quizzes.data.length < 1) redirect("/home");
      return (
         <SubjectStatPage 
            subject={subjectName.replaceAll("-"," ")} 
            quizzes={quizzes.data as any}
            subjectLevel={titleCase(actualLevel.replaceAll("-"," "))}
         />
      );
   } else {
      return <LoadingPage />;
   }
}