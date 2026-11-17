import { redirect } from "next/navigation";
import { dalCheckUserSubscription} from "@/dal/helpers";
import HomePage from "./HomePage";
import LoadingPage from "./loading";
import NonSubHomePage from "./NonSubHomePage";

export default async function Home () {
   const subscriptionStatus = await dalCheckUserSubscription();

   if (subscriptionStatus == "session-no-user") redirect("/logout");
   if (subscriptionStatus == "no-user") redirect("/sign-in");
   if (subscriptionStatus == "not-subscribed") return <NonSubHomePage />;

   // const dataReq = await dalRequireSubscribedAuth(user => 
   //    dalDbOperation(async () => {
   //       const quizzes = await db.select().from(quizzesTable).where(eq(quizzesTable.userid, user.userid!));
   //       const notes = await db.select().from(notesTable).where(eq(notesTable.userid, user.userid!))
   //       return { quizzes, notes }
   //    })
   // );

   if (true) {
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
      />;
      // quizzes={sanitise(quizzes)}
      // notes={sanitise(notes)}
   } else {
      return <LoadingPage />;
   }
}