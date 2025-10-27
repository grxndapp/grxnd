'use client'
import { useState } from "react";
import { callChatGPT } from "../actions/ai";
import { toast } from "sonner";
import { useModal } from "@/contexts/useModal";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Spacing from "@/components/Spacing/Spacing";
import EssayInput from "@/components/EssayInput/EssayInput";
import essayGraderPrompt from "@/prompts/essayGrader";
import ToolHeading from "@/components/ToolHeading/ToolHeading";
import LoadingDots from "@/components/LoadingDots/LoadingDots";

export default function EssayGraderPage () {
   const [essayGradeReport, setEssayGradeReport] = useState<EssayGradeReport | null>(null)
   const { showModal, close } = useModal();

   const callChatGPTEssayMarker = async (question: string, answer: string) => {
      showModal({
         children: <>
            <div className="text-xl bold-700 full mb-1 text-center">Essay Grader</div>
            <div className="text-xxs full text-center">
               AI is currently grading your essay...
            </div>
            <div className="box pd-2 full dfb justify-center">
               <LoadingDots />
            </div>
         </>
      });
      const data = await callChatGPT(essayGraderPrompt(question, answer));
      close();
      if (data == false) {
         toast.error("Failed to chat with AI. Please try again later.")
         return;
      }
      setEssayGradeReport(data.grader_report);
   }

   return (
      <AppWrapper>
         <div className="box full h-full">
            {(essayGradeReport == null) && (<>
               <ToolHeading title="AI Essay Grader" description="Paste or Upload in your essay below and Press Grade" idClassName="essay-grader" />
               <Spacing size={1} />
               <EssayInput promptAI={callChatGPTEssayMarker} />
            </>)}
         
            {(essayGradeReport !== null) && (<div className="box full h-fit mt-1">
               <div className="text-xxl bold-700 mb-05 full text-center">Essay Grade Report</div>
               <div className="text-l bold-700">Grade: {essayGradeReport.grade * 10}%</div>
               <div className="text-xxs pd-05">{essayGradeReport.comments}</div>

               <div className="text-sm bold-700 mt-1">Strengths</div>
               {essayGradeReport.strengths.map((strength, index) => (
                  <div className="text-xxs pd-05" key={index}>- {strength}</div>
               ))}
               
               <div className="text-sm bold-700 mt-1">Weaknesses</div>
               {essayGradeReport.weaknesses.map((weakness, index) => (
                  <div className="text-xxs pd-05" key={index}>- {weakness}</div>
               ))}
               
               <div className="text-sm bold-700 mt-1">Improvements to make</div>
               {essayGradeReport.improvements.map((improvement, index) => (
                  <div className="text-xxs pd-05" key={index}>- {improvement}</div>
               ))}
               <Spacing size={1} />
               <button className="xxs pd-1 full" onClick={() => setEssayGradeReport(null)}>Grade Another Essay</button>
               <Spacing size={4} />
            </div>)}
         </div>
      </AppWrapper>
   )
}
