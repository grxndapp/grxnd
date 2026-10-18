'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Card from "@/components/Card/Card"
import ProgressBar from "@/components/ProgressBar/ProgressBar"
import RenderMarkdown from "@/components/RenderMarkdown/RenderMarkdown"
import Spacing from "@/components/Spacing/Spacing"
import { QuizQuestionReviewCardStyles } from "@/styles-extra/styles"

function questionTypeFormatting (type: string) {
   if (type.includes('1')) {
      return <>This is an <b style={{color: "#ffabab"}}>A type question</b></>
   } else if (type.includes('2')) {
      return <>This is a <b style={{color: "#ffac69   "}}>B type question</b></>
   } else if (type.includes('3')) {
      return <>This is a <b style={{color: "#4ac76b"}}>C type question</b></>
   }
}

export default function SavedQuizPage ({ savedQuiz }: { savedQuiz: SavedQuiz }) {
   return (
      <AppWrapper>
         <div className="box full pd-3">
            <div className="text-xxl bold-700 full">
               {savedQuiz.subjectLevel} {savedQuiz.subject} {savedQuiz.topic}
            </div>

            <div className="box full pd-1 dfb column gap-5">
               <div className="text-s bold-500">
                  You scored {Math.round((savedQuiz.score/JSON.parse(savedQuiz.quizJson).length)*100)}%
               </div>
               <ProgressBar percentage={(savedQuiz.score/JSON.parse(savedQuiz.quizJson).length)*100} />
            </div>

            <div className="box full pd-1 dfb column gap-20">
               {JSON.parse(savedQuiz.quizJson).map((quizQuestion: QuizQuestion, index: number) => (
                  <Card key={index} styles={QuizQuestionReviewCardStyles}>
                     <div className="text-xs full bold-600 accent-color">Question {index+1}</div>
                     <div className="text-xs full pd-05"><RenderMarkdown content={quizQuestion.question} /></div>
                     <div className="text-xxs no-trans">{questionTypeFormatting(quizQuestion.questionType)}</div>
                     <Spacing />
                     <div className="text-xs full bold-600 accent-color">Answer</div>
                     <div className="text-xs pd-05" style={{ whiteSpace: "pre-line" }}>
                        <RenderMarkdown content={quizQuestion.answerExplanation} />
                     </div>
                     <Spacing />
                  </Card>
               ))}
            </div>
            
            <Spacing size={4} />
         </div>
      </AppWrapper>
   )
}
