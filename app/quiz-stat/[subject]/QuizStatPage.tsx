'use client'
import { titleCase } from "@/lib/str"
import { subjectColors } from "@/utils/subjects"
import { CSSProperties } from "react"
import { formatMilliseconds } from "@/utils/date"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Spacing from "@/components/Spacing/Spacing"
import Card from "@/components/Card/Card"
import ProgressRing from "@/components/ProgressRing/ProgressRing"
import QuizBarChart from "@/components/QuizBarChart/QuizBarChart"

export default function QuizStatPage ({ quizzes, subject }: { quizzes: QuizT[], subject: string }) {
   const chartCardStyles: CSSProperties = {
      padding: "20px", width: "100%",
      borderColor: subjectColors[titleCase(subject)]
   }

   const decideColor = (score: number) => {
      if (score < 40) {
         return '#ef4444'; // red-500 (bad)
      } else if (score < 75) {
         return '#f97316'; // orange-500 (fair)
      } else {
         return '#22c55e'; // green-500 (great)
      }
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

   return (
      <AppWrapper>
         <div className="box w-full h-full">
            <div className="text-xl bold-700 full text-center mb-2" style={{ color: subjectColors[titleCase(subject)] }}>{titleCase(subject)} Quizzes</div>
            
            <Card styles={chartCardStyles}>
               <div className="box full dfb align-center gap-10">
                  <div className="box dfb column full" style={{width:"100%"}}>
                     <div className="text-s bold-600 pd-05">Average {titleCase(subject)} Score</div>
                     <div className="text-xxs">You have taken {newQuizArray.length} {subject} quizzes</div>
                  </div>
                  <div className="box dfb fit justify-center">
                     <ProgressRing 
                        progress={averagePercentage}
                        color={decideColor(averagePercentage)}
                     />
                  </div>
               </div>
            </Card>
            <Spacing size={1} />

            <QuizBarChart
               color={subjectColors[titleCase(subject)]}
               data={newQuizArray}
               subject={titleCase(subject)}
               barDataKey="score"
            />
            <Spacing size={2} />
            
            <div className="text-ml bold-700 full mb-15">{titleCase(subject)} Quiz History</div>
            <div className="box full dfb column" style={{gap:"7px"}}>
               {newQuizArray.toReversed().map((quizInfo: any, index: number) => (
                  <Card key={index} styles={{ padding: "10px 20px" }}>
                     <div className="box full dfb align-center pd-1 mb-05" style={{gap:"10px"}}>
                        <div className="box full dfb column">
                           <div className="text-s bold-600 full">{quizInfo.subjectLevel} {titleCase(subject)}</div>
                           <div className="text-xxxs pd-05 grey-5 full">{quizInfo.topic}</div>
                           <div className="text-xxxs grey-5 full">Quiz taken on {formatMilliseconds(new Date(quizInfo.createdAt).getTime())}</div>
                        </div>
                        <div className="text-sm bold-800 fit" style={{color:subjectColors[titleCase(subject)]}}>{quizInfo.score}%</div>
                     </div>
                  </Card>
               ))}
            </div>
            <Spacing size={5} />
         </div>
      </AppWrapper>
   )
}
