'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Card from "@/components/Card/Card"
import ProgressBar from "@/components/ProgressBar/ProgressBar"
import RenderMarkdown from "@/components/RenderMarkdown/RenderMarkdown"
import Spacing from "@/components/Spacing/Spacing"
import { titleCase } from "@/lib/str"
import { QuizQuestionReviewCardStyles } from "@/styles-extra/styles"
import { customSubjectToBoldColor, subjectColors } from "@/utils/subjects"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { getSubjectPageUrl } from "../../helper"

function questionTypeFormatting (type: string) {
   if (type.includes('1')) {
      return <>This is an <b style={{color: "#ffabab"}}>A type question</b></>
   } else if (type.includes('2')) {
      return <>This is a <b style={{color: "#ffac69   "}}>B type question</b></>
   } else if (type.includes('3')) {
      return <>This is a <b style={{color: "#4ac76b"}}>C type question</b></>
   }
}

export default function SavedQuizPage ({ subject, subjectLevel, savedQuiz }: { savedQuiz: SavedQuiz, subjectLevel: string, subject: string }) {
   const router = useRouter();
   const subjectColor = subjectLevel ? subjectColors[titleCase(subject)] : customSubjectToBoldColor(titleCase(subject));
   const subjectPageUrl = getSubjectPageUrl(subject, subjectLevel);
   
   return (
      <AppWrapper>
         <div className="box full pd-3">
            <div className="box full pd-1 dfb align-center gap-10 mb-1">
               <button 
                  className="xxxs pd-13 pdx-15 outline-black no-shadow radius-40"
                  onClick={() => router.push(`${subjectPageUrl}/saved-quizzes`)}
               >
                  <ArrowLeft size={16} />
               </button>
            </div>
            
            <div className="text-l bold-700 full text-center" style={{ color: subjectColor }}>
               {savedQuiz.subjectLevel} {savedQuiz.subject} {savedQuiz.topic}
            </div>

            <div className="box full pd-3 dfb column align-center gap-5">
               <div className="text-s fit bold-500">
                  You scored {Math.round((savedQuiz.score/JSON.parse(savedQuiz.quizJson).length)*100)}%
               </div>
               <ProgressBar percentage={(savedQuiz.score/JSON.parse(savedQuiz.quizJson).length)*100} color={subjectColor} />
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
