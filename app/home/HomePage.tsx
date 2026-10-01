'use client'
import { ChevronRight, Download, Drama } from "lucide-react";
import { useSession } from "next-auth/react";
import { subjectColors, subjectPastelBgColors } from "@/utils/subjects";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Spacing from "@/components/Spacing/Spacing";
import Card from "@/components/Card/Card";
import Link from "next/link";

type HomePageProps = {
   quizzes: QuizT[];
   score: number;
   welcomeString: string;
}

export default function HomePage ({ quizzes, score, welcomeString }: HomePageProps) {
   const router = useRouter();
   const { data: session } = useSession();
   const [iPhoneOrIpadUser, setIPhoneOrIpadUser] = useState(false);

   const newQuizArray = quizzes.reduce((agg: any, quiz) => {
      if (!agg[quiz.subject]) {
         agg[quiz.subject] = [{
            score: quiz.score
         }];

         return agg;
      }
      agg[quiz.subject].push({
         score: quiz.score
      })
      return agg;
   }, {});
   const existingQuizSubjects = Object.keys(newQuizArray);


   function isIphoneOrIpad(): boolean {
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
      const platform = navigator.platform;

      const isIOS = /iPhone|iPad|iPod/.test(ua);
      const isMacWithTouch = platform === 'MacIntel' && navigator.maxTouchPoints > 1;

      return isIOS || isMacWithTouch;
   }

   useEffect(() => {
      setIPhoneOrIpadUser(isIphoneOrIpad());
   }, [])

   return (
      <AppWrapper>
         <div className="box full h-full">
            <div className="box full pd-3">
               <div className="text-s full dfb align-center gap-5 bold-600">
                  Welcome <div className="span box accent-color">{session?.user?.name}</div>
               </div>
               <div className="text-xxs full pd-05">{welcomeString}</div>
               <div className="box full dfb align-end pd-05" style={{ gap: "5px" }}>
                  <div className="text-xxb fit bold-600">{score}</div>
                  <div className="text-xxs grey-5 pdx-05 full pd-1" style={{ padding: "10px 0" }}>points</div>
               </div>
               <Link className="text-xxs fit visible-link accent-color dfb align-center" href="/leaderboard">
                  Global Leaderboard <ChevronRight size={17} />
               </Link>
            </div>

            {(quizzes.length < 1) && (<div className="box full">
               <Card styles={{ width: "100%", padding: "25px" }}>
                  <div className="text-sm bold-600 full mb-05">Looks like you have never taken a quiz</div>
                  <div className="text-xxs full mb-15">Let's change that, test your brain</div>
                  <button className="xxs pd-1 full" onClick={() => router.push("/quiz-maker")}>Take a Quiz</button>
               </Card>
               <Spacing size={1} />
            </div>)}

            
            {(existingQuizSubjects.length > 0) && (<>
               <div className="text-xxl full pd-15 bold-600">Quizzes</div>
               <div className="box full dfb column" style={{ gap: "10px" }}>
                  {existingQuizSubjects.map((subject, index) => {
                     return (<Card
                        key={index} 
                        styles={{
                           width: "100%",
                           borderRadius: "25px", padding: "25px",
                           background: `${subjectPastelBgColors[subject]}`
                        }}
                        className="box fit"
                     >
                        <div className="text-sm bold-600 full mb-05">{subject}</div>
                        <div className="text-xxl bold-700 full" style={{color:subjectColors[subject]}}>
                           {((newQuizArray[subject]
                           .reduce((agg: any, quiz: any) => (agg + quiz.score), 0)/newQuizArray[subject].length).toFixed(1))}%
                        </div>
                        <div className="box full pd-05">
                           <Link className="text-xxs fit visible-link accent-color dfb align-center" href={`/quiz-stat/${subject.toLowerCase().replaceAll(" ","-")}`}>
                              View Stats <ChevronRight size={17} />
                           </Link>
                        </div>
                     </Card>)
                  })}
               </div>
            </>)}
            <Spacing size={2} />

            <Card styles={{ width: "100%", padding: "25px" }}>
               <div className="text-sm bold-600 full mb-05">Tournament</div>
               <div className="text-xxs full mb-15">Answer quizzes and play games with your friends</div>
               <button className="xxs pd-11 full" onClick={() => router.push("/quiz-room")}>Start Tournament</button>
            </Card>
            {(iPhoneOrIpadUser) && (<>            
               <Spacing size={1} />
               <Card styles={{ width: "100%", padding: "25px" }}>
                  <div className="text-sm bold-600 full mb-05">iPhone?</div>
                  <div className="text-xxs full mb-15">Install the Grxnd App by following these simple steps</div>
                  <button className="xxs pd-11 full" onClick={() => router.push("/install-ios")}>
                     Install <Download size={17} />
                  </button>
               </Card>
            </>)}
            <Spacing size={3} />
         </div>
      </AppWrapper>
   )
}
