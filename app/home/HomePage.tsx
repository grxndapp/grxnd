'use client'
import {  BookOpen, Download, GraduationCap, Lightbulb } from "lucide-react";
import { useSession } from "next-auth/react";
import { customSubjectToBoldColor, customSubjectToPastelColor, fullSubjectBreakDown, retrieveSubjectTopic, subjectColors, subjectIcon, subjectPastelBgColors } from "@/utils/subjects";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NormalCardStyles, SubjectIconBubble, SubjectProgressCardStyles } from "@/styles-extra/styles";
import { pluralSuffixer } from "@/lib/str";
import { CustomRawIcon } from "@/components/Icons/Icon";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Spacing from "@/components/Spacing/Spacing";
import Card from "@/components/Card/Card";
import ProgressBar from "@/components/ProgressBar/ProgressBar";
import OverallProgress from "@/components/OverallProgress/OverallProgress";
import { CustomIconUrls } from "@/lib/icons";
import { BiLogoApple } from "react-icons/bi";

type HomePageProps = {
   quizzes: QuizT[];
   score: number;
   welcomeString: string;
   overallPercentage: number;
}


export default function HomePage ({ quizzes, overallPercentage, score, welcomeString }: HomePageProps) {
   const router = useRouter();
   const { data: session } = useSession();
   const [iPhoneOrIpadUser, setIPhoneOrIpadUser] = useState(false);
   
   const subjectProgressQuizzes = quizzes.reduce((agg: any, quiz) => {
      if (quiz.topic == '') return agg;
      if (!quiz.subjectLevel) {
         const subjectKey = quiz.subject;
         if (!agg[subjectKey]) {
            agg[subjectKey] = [ { [quiz.topic]: quiz.score } ];
            return agg;
         }
         agg[subjectKey].push({ [quiz.topic]: quiz.score });
         return agg;
      }


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
            {(quizzes.length < 1) ? (

               <div className="box full">
                  <div className="box full mt-15">
                     <div className="box full mb-1 dfb align-center justify-center">
                        <CustomRawIcon url={CustomIconUrls.WelcomeIcon} size={150} />
                     </div>
                     <div className="text-l full dfb wrap gap-5 align-center justify-center">Hello, <span className="text-l bold-600 fit">{session?.user?.name}</span></div>
                     <div className="text-xxs full pd-05 text-center">{welcomeString}</div>
                  </div>

                  <div className="box full dfb column gap-10 align-center pd-4">
                     <button className="xs pd-15 full mw-500 radius-20" onClick={() => router.push("/quiz-maker")}>
                        <Lightbulb size={19} /> Start A Quiz
                     </button>
                     <button className="xs pd-15 full mw-500 radius-20 outline-black" onClick={() => router.push("/note-maker")}>
                        <BookOpen size={19} /> Learn Something
                     </button>
                     {(iPhoneOrIpadUser) && (<div className="box full pd-15 dfb justify-center">
                        <div className="box text-xs fit dfb align-center justify-center gap-5 cursor-pointer visible-link" onClick={() => router.push("/install-ios")}>
                           <BiLogoApple size={19} /> Got an iPhone?
                        </div>
                     </div>)}
                  </div>

                  <Spacing size={1} />
               </div>

            ) : (<>

               <div className="box full mt-15">
                  <div className="box full mb-1 dfb align-center justify-center">
                     <CustomRawIcon url={CustomIconUrls.WelcomeIcon} size={150} />
                  </div>
                  <div className="text-l full dfb wrap gap-5 align-center justify-center">Hello, <span className="text-l bold-600 fit">{session?.user?.name}</span></div>
                  <div className="text-xxs full pd-05 text-center">{welcomeString}</div>
               </div>
               

               <div className="box full dfb column gap-10 align-center pd-4">
                  <button className="xs pd-15 full mw-500 radius-20" onClick={() => router.push("/quiz-maker")}>
                     <Lightbulb size={19} /> Start A Quiz
                  </button>
                  <button className="xs pd-15 full mw-500 radius-20 outline-black" onClick={() => router.push("/note-maker")}>
                     <BookOpen size={19} /> Learn Something
                  </button>
               </div>

               <div className="box full dfb wrap justify-center pd-2" style={{ gap: "20px" }}>
                  {Object.keys(subjectProgressQuizzes).sort((a,b) => a.localeCompare(b )).map((subject, index) => {
                     const subjectFolderName = fullSubjectBreakDown(subject).subject.toLowerCase().replaceAll(" ","-");
                     const subjectLevel = fullSubjectBreakDown(subject).subjectLevel;
                     const isCustomSubject = (subjectLevel == '');
                     const subjectLevelUrlParam = subjectLevel ? `${subjectLevel.replaceAll(" ","-").toLowerCase()}` : 'none';
                     
                     const subjectLevelUrlParams = subjectLevel 
                        ? `${subjectLevel} ${subjectFolderName}`.replaceAll(" ","-").toLowerCase()
                        : subjectFolderName;
                     
                     // Progress
                     const subjectProgressBg = isCustomSubject ? customSubjectToPastelColor(subject) : subjectPastelBgColors[fullSubjectBreakDown(subject).subject];
                     const subjectProgressBoldBg = isCustomSubject ? customSubjectToBoldColor(subject) : subjectColors[fullSubjectBreakDown(subject).subject];
                     const totalTopics = isCustomSubject
                        ? subjectProgressQuizzes[subject].length
                        : retrieveSubjectTopic(fullSubjectBreakDown(subject).subjectLevel, fullSubjectBreakDown(subject).subject)?.length;
                     
                     const subjectProgressRaw = isCustomSubject
                        ? subjectProgressQuizzes[subject].map((s: any) => s[Object.keys(s)[0]]).reduce((agg: number, s: any) => agg + s, 0) / subjectProgressQuizzes[subject].length
                        : (subjectProgressQuizzes[subject].filter((i: any) => i[Object.keys(i)[0]] == true).length / totalTopics!) * 100

                     const subjectProgressRounded = subjectProgressRaw.toFixed(2);

                     return (<Card
                        key={index} 
                        styles={{ ...SubjectProgressCardStyles, background: subjectProgressBg }}
                        className="box dfb column gap-10"
                        onClick={() => router.push(`/subject/${subjectLevelUrlParam}/${subjectFolderName}`)}
                     >
                        <div style={SubjectIconBubble}>
                           {isCustomSubject
                              ? <GraduationCap size={20} />
                              : subjectIcon[fullSubjectBreakDown(subject).subject]
                           }
                        </div>
                        <div className="box full dfb column gap-5">
                           <div className="text-s bold-700 full mb-05">{subject}</div>
                           <div className="text-xs full grey-5 bold-500">
                              {totalTopics} {pluralSuffixer('topic', totalTopics!, 's')} {isCustomSubject && 'completed'}
                           </div>
                           <div className="text-xxs full grey-5 mt-05">
                              {subjectProgressRounded}%
                              {isCustomSubject ? ' average score' : ' complete'}
                           </div>
                           <div className="box pd-05 mt-05">
                              <ProgressBar percentage={subjectProgressRaw} color={subjectProgressBoldBg} />
                           </div>
                        </div>
                     </Card>)
                  })}
               </div>
               
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

               <Spacing size={7} />
            </>)}
         </div>
      </AppWrapper>
   )
}
