'use client'
import { titleCase } from "@/lib/str"
import { customSubjectToBoldColor, subjectColors } from "@/utils/subjects"
import { formatMilliseconds } from "@/utils/date"
import { NormalCardStyles, NotebookCardStyles, SubjectIconBubble } from "@/styles-extra/styles"
import { ArrowLeft, Bookmark, Notebook, NotebookPen } from "lucide-react"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { getSubjectPageUrl } from "./helper"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Spacing from "@/components/Spacing/Spacing"
import Card from "@/components/Card/Card"
import QuizBarChart from "@/components/QuizBarChart/QuizBarChart"

export default function SubjectStatPage ({ quizzes, subject, subjectLevel }: { quizzes: QuizT[], subject: string, subjectLevel: string }) {
   const [showQuizHistory, setShowQuizHistory] = useState(false);
   const router = useRouter();
   const contentRef = useRef<HTMLDivElement | null>(null);

   function handleShowQuizHistory () {
      setShowQuizHistory(true);
      contentRef?.current?.scrollTo({ top: 0, behavior: "instant" })
   }

   const newQuizArray = quizzes.reduce((agg: any, quiz) => {
      if (quiz.subject.toLowerCase() === subject) {
         agg.push({
            subjectLevel: quiz.subjectLevel,
            topic: quiz.topic,
            score: quiz.score,
            createdAt: new Date(quiz.createdAt).toUTCString(),
            name: `Quiz ${agg.length+1}`
         });
         return agg;
      }
      return agg;
   }, []);

   const averagePercentage = quizzes.reduce((agg: number, quiz) => {
      if (quiz.subject.toLowerCase() === subject) {
         agg += quiz.score;
         return agg;
      }
      return agg;
   }, 0) / (quizzes.filter(quiz => quiz.subject.toLowerCase() === subject).length);

   const subjectColor = subjectLevel ? subjectColors[titleCase(subject)] : customSubjectToBoldColor(titleCase(subject));
   const subjectPageUrl = getSubjectPageUrl(subject, subjectLevel);

   return (
      <AppWrapper contentRef={contentRef}>
         <div className="box w-full h-full pd-2 no-trans">
            {showQuizHistory ? (<>
               <div className="box full dfb align-center gap-10">
                  <button className="xxxs pd-13 pdx-15 outline-black no-shadow radius-40 no-trans" onClick={() => setShowQuizHistory(false)}>
                     <ArrowLeft size={16} />
                  </button>
               </div>

               <div className="box full pd-1">
                  <div className="text-xl bold-700 full text-center pd-1 no-trans" style={{ color: subjectColor }}>{subjectLevel} {titleCase(subject)}</div>
                  <div className="box full pd-05 dfb justify-center">
                     <button className="xs pd-14 full mw-500 radius-25" onClick={() => router.push(`${subjectPageUrl}/start-quiz`)}>
                        <NotebookPen size={18} /> Take a Quiz
                     </button>
                  </div>
               </div>
               <Spacing />
               
               <div className="text-s bold-700 full mb-15">Quiz History</div>
               {quizzes.length == 0 && (
                  <div className="text-xs full grey-5">No quizzes taken</div>
               )}
               <div className="box full dfb column gap-15">
                  {newQuizArray.toReversed().map((quizInfo: any, index: number) => (
                     <Card key={index} styles={NormalCardStyles}>
                        <div className="box full dfb align-center pd-1 mb-05" style={{gap:"10px"}}>
                           <div className="box full dfb column">
                              <div className="text-s bold-600 full">{quizInfo.subjectLevel} {titleCase(subject)}</div>
                              <div className="text-xxxs pd-05 grey-5 full">{quizInfo.topic}</div>
                              <div className="text-xxxs grey-5 full">Quiz taken on {formatMilliseconds(new Date(quizInfo.createdAt).getTime())}</div>
                           </div>
                           <div className="text-sm bold-800 fit" style={{ color: subjectColor }}>{quizInfo.score}%</div>
                        </div>
                     </Card>
                  ))}
               </div>
               <Spacing size={5} />
            </>) : (<>
               <div className="text-xl bold-700 full mb-1 pd-1 text-center no-trans" style={{ color: subjectColor }}>
                  {titleCase(subjectLevel)} {titleCase(subject)}
               </div>

               {quizzes.length > 0 && (<>
                  <div className="box full dfb wrap justify-center gap-20">
                     <div className="box full mw-500 dfb column gap-5 align-center justify-center">
                        <div className="text-xxb fit bold-700" style={{ color: subjectColor }}>
                           {Math.round(averagePercentage)}%
                        </div>
                        <div className="text-xs fit bold-600 text-center">Average {subjectLevel} {titleCase(subject)} Score</div>
                        <div className="text-xxs fit text-center">You have taken {newQuizArray.length} {subject} quizzes</div>
                     </div>

                     <div className="box full mw-500 dfb column gap-10">
                        <QuizBarChart
                           color={subjectColor}
                           percentages={newQuizArray.map((q: any) => q.score).toReversed().slice(0,7).toReversed()}
                        />
                     </div>
                  </div>
                  <Spacing size={3} />
               </>)}

               <div className="box full dfb justify-center wrap gap-10">
                  <Card styles={NotebookCardStyles} onClick={() => router.push(`${subjectPageUrl}/notes`)}>
                     <div className="box full dfb align-center gap-5">
                        <div className="box full dfb column">
                           <div className="text-s bold-700 full">{subjectLevel} {titleCase(subject)} Notes</div>
                           <div className="text-xxs grey-4 full">All Notes</div>
                        </div>
                        <div style={{ ...SubjectIconBubble, background: `${subjectColor}88` }}>
                           <Notebook size={19} />
                        </div>
                     </div>
                  </Card>
                  <Card styles={NotebookCardStyles} onClick={handleShowQuizHistory}>
                     <div className="box full dfb align-center gap-5">
                        <div className="box full dfb column">
                           <div className="text-s bold-700 full">Take a Quiz</div>
                           <div className="text-xxs grey-4 full">Quizzes</div>
                        </div>
                        <div style={{ ...SubjectIconBubble, background: `${subjectColor}88` }}>
                           <NotebookPen size={19} />
                        </div>
                     </div>
                  </Card>
                  <Card styles={NotebookCardStyles} onClick={() => router.push(`${subjectPageUrl}/saved-quizzes`)}>
                     <div className="box full dfb align-center gap-5">
                        <div className="box full dfb column">
                           <div className="text-s bold-700 full">View Saved Tests</div>
                           <div className="text-xxs grey-4 full">Revise Quizzes</div>
                        </div>
                        <div style={{ ...SubjectIconBubble, background: `${subjectColor}88` }}>
                           <Bookmark size={19} />
                        </div>
                     </div>
                  </Card>
               </div>
               <Spacing size={5} />
            </>)}
         </div>
      </AppWrapper>
   )
}
