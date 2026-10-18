'use client'
import { Download, Lightbulb } from "lucide-react";
import { useSession } from "next-auth/react";
import { fullSubjectBreakDown, retrieveSubjectTopic, subjectIcon, subjectPastelBgColors, subjectTopics } from "@/utils/subjects";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NormalCardStyles, SubjectIconBubble } from "@/styles-extra/styles";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Spacing from "@/components/Spacing/Spacing";
import Card from "@/components/Card/Card";
import ProgressBar from "@/components/ProgressBar/ProgressBar";
import OverallProgress from "@/components/OverallProgress/OverallProgress";

type HomePageProps = {
   quizzes: QuizT[];
   score: number;
   welcomeString: string;
   overallPercentage: number;
}

export default function HomePage ({ quizzes, overallPercentage, welcomeString }: HomePageProps) {
   const router = useRouter();
   const { data: session } = useSession();
   const [iPhoneOrIpadUser, setIPhoneOrIpadUser] = useState(false);
   
   const subjectProgressQuizzes = quizzes.reduce((agg: any, quiz) => {
      if (quiz.topic == '') return agg;
      if (quiz.subjectLevel == 'Extra' || quiz.subjectLevel == '') return agg;
      const subjectKey = `${quiz.subjectLevel} ${quiz.subject}`;

      if (!agg[subjectKey]) {
         agg[subjectKey] = [];

         const subjectTopics = retrieveSubjectTopic(quiz.subjectLevel, quiz.subject);
         agg[subjectKey] = subjectTopics?.map(subjectTopic => ({
            [subjectTopic]: (subjectTopic == quiz.topic && quiz.score >= 70) ? true : false
         }))

         return agg;
      }
      

      agg[subjectKey] = agg[subjectKey].map((i: any) => {
         if (Object.keys(i)[0] == quiz.topic && !i[quiz.topic] && quiz.score >= 70) {
            return {
               [quiz.topic]: ((quiz.score >= 70) ? true : false)
            }
         }
         return i;
      })

      return agg;
   }, {})

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
         <div className="box full h-full pd-1">
            <div className="box full mt-15">
               <div className="text-l full dfb wrap gap-5 justify-center">Hello, <span className="text-l bold-600 fit">{session?.user?.name}</span></div>
               <div className="text-xxs full pd-05 text-center">{welcomeString}</div>
            </div>

            <div className="box full">
               <OverallProgress percentage={overallPercentage} />
            </div>

            {(quizzes.length < 1) ? (
               <div className="box full">
                  <Card styles={NormalCardStyles}>
                     <div className="text-sm bold-600 full mb-05">Looks like you have never taken a quiz</div>
                     <div className="text-xxs full mb-15">Let's change that, test your brain</div>
                     <button className="xxs pd-13 pdx-2 fit" onClick={() => router.push("/quiz-maker")}>
                        <Lightbulb size={16} /> Take a Quiz
                     </button>
                  </Card>
                  <Spacing size={1} />
               </div>
            ) : (<>
               <div className="text-xxl full pd-15 bold-600">Your Progress</div>
               <div className="box full dfb wrap" style={{ gap: "20px" }}>
                  {Object.keys(subjectProgressQuizzes).sort((a,b) => a.localeCompare(b )).map((subject, index) => {
                     return (<Card
                        key={index} 
                        styles={{
                           width: "100%", maxWidth: "370px",
                           borderRadius: "25px", padding: "25px", cursor: "pointer",
                           background: `${subjectPastelBgColors[fullSubjectBreakDown(subject).subject]}`
                        }}
                        className="box dfb column gap-10"
                        onClick={() => router.push(
                           `/quiz-stat/${fullSubjectBreakDown(subject).subject.toLowerCase().replaceAll(" ","-")}?level=${fullSubjectBreakDown(subject).subjectLevel}
                        `)}
                     >
                        <div style={SubjectIconBubble}>{subjectIcon[fullSubjectBreakDown(subject).subject]}</div>
                        <div className="box full dfb column gap-5">
                           <div className="text-s bold-700 full mb-05">{subject}</div>
                           {(["Advanced Higher","Higher","National 5"].some(s => subject.startsWith(s))) && (<div className="text-xs full grey-5 bold-500">
                              {retrieveSubjectTopic(fullSubjectBreakDown(subject).subjectLevel, fullSubjectBreakDown(subject).subject)?.length}
                              {" "}
                              topic(s)
                           </div>)}
                           <div className="text-xxs full grey-5 mt-05">
                              {subjectProgressQuizzes[subject].filter((i: any) => i[Object.keys(i)[0]] == true).length}% complete
                           </div>
                           <div className="box pd-05 mt-05">
                              <ProgressBar 
                                 percentage={subjectProgressQuizzes[subject].filter((i: any) => i[Object.keys(i)[0]] == true).length}
                              />
                           </div>
                        </div>
                     </Card>)
                  })}
               </div>
            </>)}
            <Spacing size={2} />

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
            <Spacing size={5} />
         </div>
      </AppWrapper>
   )
}
