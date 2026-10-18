'use client'
import { titleCase } from "@/lib/str"
import { subjectColors } from "@/utils/subjects"
import { formatMilliseconds } from "@/utils/date"
import { NormalCardStyles } from "@/styles-extra/styles"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Spacing from "@/components/Spacing/Spacing"
import Card from "@/components/Card/Card"
import QuizBarChart from "@/components/QuizBarChart/QuizBarChart"

export default function QuizStatPage ({ quizzes, subject, subjectLevel }: { quizzes: QuizT[], subject: string, subjectLevel: string }) {
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
         <div className="box w-full h-full pd-2">
            <div className="text-xl bold-700 full mb-1 pd-1" style={{ color: subjectColors[titleCase(subject)] }}>
               {subjectLevel} {titleCase(subject)} Quizzes
            </div>
            
            <div className="box full dfb wrap gap-20">
               <div className="box full mw-500 dfb column gap-5 align-center justify-center">
                  <div className="text-xxb fit bold-700" style={{ color:subjectColors[titleCase(subject)] }}>
                     {Math.round(averagePercentage)}%
                  </div>
                  <div className="text-xs fit bold-600 text-center">Average {subjectLevel} {titleCase(subject)} Score</div>
                  <div className="text-xxs fit text-center">You have taken {newQuizArray.length} {subject} quizzes</div>
               </div>

               <div className="box full mw-500 dfb column gap-10">
                  <QuizBarChart
                     color={subjectColors[titleCase(subject)]}
                     percentages={newQuizArray.map((q: any) => q.score).toReversed().slice(0,7).toReversed()}
                  />
               </div>
            </div>
            <Spacing size={3} />
            
            <div className="text-ml bold-700 full mb-15">{subjectLevel} {titleCase(subject)} Quiz History</div>
            <div className="box full dfb column gap-15">
               {newQuizArray.toReversed().map((quizInfo: any, index: number) => (
                  <Card key={index} styles={NormalCardStyles}>
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
