'use client'
import { ChevronRight, Download, Drama } from "lucide-react";
import { useSession } from "next-auth/react";
import { subjectColors } from "@/utils/subjects";
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
            <div className="text-xxl bold-700 full dfb align-center justify-center gap-7">
               Hello <div className="span box accent-color">{session?.user?.name}</div>
            </div>
            <div className="text-xs full text-center pd-1">{welcomeString}</div>
            <Spacing size={1} />

            <Card styles={{ width: "100%", padding: "25px", border: `1px solid #1121ff` }}>
               <div className="box full dfb align-center gap-20">
                  <div className="box full dfb column">
                     <div className="text-sm bold-500 full">Your Score</div>
                     <div className="box full pd-05">
                        <Link className="text-xxs fit visible-link accent-color dfb align-center" href="/leaderboard">
                           Global Leaderboard <ChevronRight size={17} />
                        </Link>
                     </div>
                  </div>
                  <div className="text-xl bold-700 fit dfb align-center justify-end">{score}</div>
               </div>
            </Card>
            <Spacing size={1} />

            <Card styles={{ width: "100%", padding: "25px", border: `1px solid #db8f00ff`, cursor: "pointer" }} onClick={() => router.push("/imposter")}>
               <div className="box full dfb align-center gap-20">
                  <div className="box full dfb column">
                     <div className="text-sm bold-500 mb-05 full dfb align-center gap-8">Play Imposter <Drama size={22} /></div>
                     <div className="box full">
                        <div className="box fit pd-05 pdx-1" style={{
                           background:"#1121ff", color:"white", borderRadius:"15px"
                        }}>
                           <span className="text-xxt">NEW</span>
                        </div>
                     </div>
                  </div>
                  <div className="text-xl bold-700 fit dfb align-center justify-end">
                     <ChevronRight size={40} strokeWidth={2} />
                  </div>
               </div>
            </Card>
            <Spacing size={1} />

            {(quizzes.length < 1) && (<div className="box full">
               <Card styles={{ width: "100%", padding: "25px" }}>
                  <div className="text-sm bold-600 full mb-05">Looks like you have never taken a quiz</div>
                  <div className="text-xxs full mb-15">Let's change that, test your brain</div>
                  <button className="xxs pd-1 full" onClick={() => router.push("/quiz-maker")}>Take a Quiz</button>
               </Card>
               <Spacing size={1} />
            </div>)}
            {existingQuizSubjects.map((subject, index) => {
               return (<div className="box full" key={index}>
                  <Card styles={{ width: "100%", padding: "25px", border: `1px solid ${subjectColors[subject]}` }}>
                     <div className="text-sm bold-600 full mb-05">{subject} Quizzes</div>
                     <div className="text-xxs full mb-05">Average Score</div>
                     <div className="text-xxl bold-700 full" style={{color:subjectColors[subject]}}>
                        {((newQuizArray[subject]
                        .reduce((agg: any, quiz: any) => (agg + quiz.score), 0)/newQuizArray[subject].length).toFixed(1))}%</div>
                     <div className="box full pd-05">
                        <Link className="text-xxs fit visible-link accent-color dfb align-center" href={`/quiz-stat/${subject.toLowerCase().replaceAll(" ","-")}`}>
                           View Stats <ChevronRight size={17} />
                        </Link>
                     </div>
                  </Card>
                  <Spacing size={1} />
               </div>)
            })}

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
