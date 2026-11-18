import { redirect } from "next/navigation";
import { dalCheckUserSubscription, dalDbOperation, dalRequireSubscribedAuth} from "@/dal/helpers";
import { notesTable, quizzesTable } from "@/db/schemas";
import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import { sanitise } from "@/utils/extractJson";
import HomePage from "./HomePage";
import LoadingPage from "./loading";
import NonSubHomePage from "./NonSubHomePage";

export default async function Home () {
   const subscriptionStatus = await dalCheckUserSubscription();

   if (subscriptionStatus == "session-no-user") redirect("/logout");
   if (subscriptionStatus == "no-user") redirect("/sign-in");
   if (subscriptionStatus == "not-subscribed") return <NonSubHomePage />;

   const dataReq = await dalRequireSubscribedAuth(user => 
      dalDbOperation(async () => {
         const [quiz] = await db.select().from(quizzesTable).where(eq(quizzesTable.userid, user.userid!)).orderBy(desc(quizzesTable.createdAt)).limit(1);
         const [note] = await db.select().from(notesTable).where(eq(notesTable.userid, user.userid!)).orderBy(desc(notesTable.createdAt)).limit(1);
         return { quiz, note }
      })
   );

   if (dataReq.success) {
      // const { quizzes, notes } = dataReq.data;
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


      return <HomePage 
         welcomeString={randomItem}
         lastNoteTaken={dataReq.data.note ? sanitise(dataReq.data.note) : null}
         lastQuizDone={dataReq.data.quiz ? sanitise(dataReq.data.quiz) : null}
      />;
   } else {
      return <LoadingPage />;
   }
}