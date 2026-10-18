import { redirect } from "next/navigation";
import { dalCheckUserSubscription, dalDbOperation, dalRequireSubscribedAuth } from "@/dal/helpers";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { quizzesTable, scoresTable } from "@/db/schemas";
import HomePage from "./HomePage";
import LoadingPage from "./loading";
import NonSubHomePage from "./NonSubHomePage";

export default async function Home () {
   const subscriptionStatus = await dalCheckUserSubscription();

   if (subscriptionStatus == "no-user") redirect("/sign-in");

   if (subscriptionStatus == "not-subscribed") return <NonSubHomePage />;

   const dataReq = await dalRequireSubscribedAuth(user => 
      dalDbOperation(async () => {
         const quizzes = await db
            .select()
            .from(quizzesTable)
            .where(eq(quizzesTable.userid, user.userid!))

         const scores = await db
            .select()
            .from(scoresTable)
            .where(eq(scoresTable.userid, user.userid!))
            .limit(1);
         
         const allUsersScores = await db.select({ score: scoresTable.score }).from(scoresTable);
         
         return { quizzes, score: scores[0].score, allUsersScores: allUsersScores.map(s => s.score) }
      })
   );

   if (dataReq.success) {
      const { quizzes, score, allUsersScores } = dataReq.data;
      const welcomeQuestions = [
         "Ready to study today?",
         "One hour of study keeps the F away.",
         "Brain: loading... are you logging in?",
         "Time to lock in or keep scrolling?",
         "Your future self is watching. Start studying?",
         "Let's turn confusion into conclusion.",
         "Books won't bite... probably. Start?",
         "Want to flex those brain muscles?",
         "Studying now = chilling later. You in?",
         "Ready to escape the homework matrix?",
         "Grades don't grind themselves. Shall we?",
         "Your GPA just texted me... it needs help.",
         "One session today, less panic tomorrow."
      ];
      const randomItem = welcomeQuestions[Math.floor(Math.random() * welcomeQuestions.length)];


      const usersBehind = allUsersScores?.filter(s => s! < score!);
      const overallPercentage = (usersBehind.length / allUsersScores.length) * 100;

      return <HomePage 
         quizzes={quizzes as any}
         score={score as any}
         welcomeString={randomItem}
         overallPercentage={overallPercentage}
      />;
   } else {
      return <LoadingPage />;
   }
}