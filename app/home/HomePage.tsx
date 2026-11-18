'use client'
import { Lightbulb, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CustomRawIcon } from "@/components/Icons/Icon";
import { CustomIconUrls } from "@/lib/icons";
import { HomePageCardStyles } from "@/styles-extra/styles";
import { subjectCombinator } from "../subject/[level]/[subjectName]/clientHelper";
import { NotesIllustration, QuizIllustration } from "@/components/StudyMethodIcons/StudyMethodIcons";
import { fullSubjectBreakDown } from "@/utils/subjects";
import { timeAgo } from "@/utils/date";
import { WavingCharacterLoader } from "@/components/SubjectLoaders/SubjectLoaders";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Card from "@/components/Card/Card";
import Spacing from "@/components/Spacing/Spacing";

type HomePageProps = {
   lastQuizDone: QuizT | null;
   lastNoteTaken: Note | null;
   welcomeString: string;
}


export default function HomePage ({ welcomeString, lastNoteTaken, lastQuizDone }: HomePageProps) {
   const router = useRouter();
   const { data: session } = useSession();

   return (
      <AppWrapper>
         <div className="box full h-full mw-1200">
            <div className="box full">
               <div className="box full mb-1 dfb align-center justify-center">
                  {(lastNoteTaken == null && lastQuizDone == null) ? (
                     <QuizIllustration size={100} />
                  ) : (lastNoteTaken == null || lastQuizDone == null) ? (
                     <QuizIllustration size={100} />
                  ) : (
                     <CustomRawIcon url={CustomIconUrls.WelcomeIcon} size={100} />
                  )}
               </div>
               <div className="text-l full dfb wrap gap-5 align-center justify-center">
                  Hello, 
                  <span className="text-l bold-700 fit accent-color-gradient-dark-text">{session?.user?.name}</span>
               </div>
               <div className="text-xxs full pd-05 text-center">{welcomeString}</div>
            </div>

            <Spacing />

            <div className="box full dfb column gap-10 align-center">
               {(lastNoteTaken == null && lastQuizDone == null) ? (<>
                  <Card styles={HomePageCardStyles}>
                     <div className="box full pd-1">
                        <WavingCharacterLoader size={100} />
                     </div>
                     <div className="text-m bold-600 full">
                        First Time Studying with <span className="accent-color">Grxnd</span>
                     </div>
                     <div className="text-xs mb-1">
                        Take a quiz on a subject and let's see how well you get on
                     </div>
                     <div className="box full dfb column gap-10 align-center pd-2">
                        <button className="xs pd-15 full mw-500 radius-20 accent-hover" onClick={() => router.push("/quiz-maker")}>
                           <div className="box full dfb column align-center">
                              <span className="text-xs full bold-600 dfb justify-center align-center gap-5"><Lightbulb size={19} strokeWidth={3} /> Take A Quiz</span>
                              <div className="text-t full bold-500" style={{ opacity: 0.8 }}>It's time to challenge yourself</div>
                           </div>
                        </button>
                     </div>
                  </Card>
               </>) : (lastNoteTaken == null || lastQuizDone == null) ? (<>
                  {lastNoteTaken && ( <NoteSuggestionCard lastNoteTaken={lastNoteTaken} /> )}
                  {lastQuizDone && ( <QuizSuggestionCard lastQuizDone={lastQuizDone} /> )}
               </>) : (<>
                  {lastQuizDone.createdAt > lastNoteTaken.createdAt ? (<>
                     <QuizSuggestionCard lastQuizDone={lastQuizDone} />
                  </>) : (
                     <NoteSuggestionCard lastNoteTaken={lastNoteTaken} />
                  )}
               </>)}
            </div>
         </div>
      </AppWrapper>
   )
}

function QuizSuggestionCard ({ lastQuizDone }: { lastQuizDone: QuizT }) {
   const router = useRouter();

   function getSubjectInformation (subjectLevel: string, subject: string) {
      return subjectCombinator(subject, subjectLevel);
   }

   return (
      <Card styles={HomePageCardStyles}>
         <div className="box full pd-1">
            <QuizIllustration size={70} />
         </div>

         {(lastQuizDone.score >= 70) ? (<>

            <div className="text-m bold-600 full">
               Study More
               <span style={{ color: getSubjectInformation(lastQuizDone.subjectLevel, lastQuizDone.subject).subjectColor }}>
                  {getSubjectInformation(lastQuizDone.subjectLevel, lastQuizDone.subject).subjectFullName}
               </span>
            </div>
            <div className="text-xs full pd-1">
               <b style={{ color: getSubjectInformation(lastQuizDone.subjectLevel, lastQuizDone.subject).subjectColor }}>{lastQuizDone.score}%</b> on
               {" "}<b>{lastQuizDone.topic}</b> {" "}
               last time.</div>
            <div className="text-xs mb-2">Since you did well, practice another topic in your notes, let's head there now! Click below!</div>
            <button 
               className="xxs pd-15 full accent-hover radius-20"
               onClick={() => {
                  router.push(`${getSubjectInformation(lastQuizDone.subjectLevel, lastQuizDone.subject).subjectPageUrl}/notes`)
               }}
            >
               <Zap size={16} /> Let's Go!
            </button>

         </>) : (<>

            <div className="text-m bold-600 full">
               Practice{" "}
               <span style={{ color: getSubjectInformation(lastQuizDone.subjectLevel, lastQuizDone.subject).subjectColor }}>
                  {getSubjectInformation(lastQuizDone.subjectLevel, lastQuizDone.subject).subjectFullName}
               </span>
               {" "}Again
            </div>
            <div className="text-xs full pd-1">
               <b style={{ color: getSubjectInformation(lastQuizDone.subjectLevel, lastQuizDone.subject).subjectColor }}>{lastQuizDone.score}%</b> on
               {" "}<b>{lastQuizDone.topic}</b> {" "}
               last time.</div>
            <div className="text-xs mb-2">Redo the quiz and get a better grade!</div>
            <button 
               className="xxs pd-15 full accent-hover radius-20"
               onClick={() => {
                  router.push(`${getSubjectInformation(lastQuizDone.subjectLevel, lastQuizDone.subject).subjectPageUrl}/start-quiz`)
               }}
            >
               <Zap size={16} /> Practice Now!
            </button>

         </>)}
      </Card>
   )
}

function NoteSuggestionCard ({ lastNoteTaken }: { lastNoteTaken: Note }) {
   const router = useRouter();

   function getSubjectInformation (subjectLevel: string, subject: string) {
      return subjectCombinator(subject, subjectLevel);
   }

   return (
      <Card styles={HomePageCardStyles}>
         <div className="box full pd-1">
            <NotesIllustration size={70} />
         </div>
         <div className="text-sm bold-600 full">
            Continue Studying
            <span 
               style={{
                  color: getSubjectInformation(
                     fullSubjectBreakDown(lastNoteTaken.folderCodeName).subjectLevel,
                     fullSubjectBreakDown(lastNoteTaken.folderCodeName).subject,
                  ).subjectColor
               }}
            >
               {getSubjectInformation(
                  fullSubjectBreakDown(lastNoteTaken.folderCodeName).subjectLevel,
                  fullSubjectBreakDown(lastNoteTaken.folderCodeName).subject,
               ).subjectFullName}
            </span>
         </div>

         <div className="text-xs pd-05">
            {timeAgo(new Date(lastNoteTaken.createdAt).getTime())} you were studying <b>{JSON.parse(lastNoteTaken.noteJson).title}</b>
         </div>
         <div className="text-xs mb-2">Test what you've learned!</div>
         <button 
            className="xxs pd-15 full accent-hover radius-20"
            onClick={() => {
               router.push(`${getSubjectInformation(
                  fullSubjectBreakDown(lastNoteTaken.folderCodeName).subjectLevel,
                  fullSubjectBreakDown(lastNoteTaken.folderCodeName).subject,
               ).subjectPageUrl}/start-quiz?noteId=${lastNoteTaken.noteid}`)
            }}
         >
            <Zap size={16} /> Practice Now!
         </button>
      </Card>
   )
}
