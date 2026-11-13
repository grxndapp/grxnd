'use client'
import { useSplashScreen } from "@/components/SplashScreen/SplashScreenContext";
import { titleCase } from "@/lib/str";
import { useState } from "react";
import { subjectCombinator } from "../clientHelper";
import { Play, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { generateUsingAi } from "@/app/actions/ai";
import { fitbDefaultSubjectMakerPrompt } from "@/prompts/aiFillInTheBlankMaker";
import { ResponseFormats } from "@/prompts/responseFormats";
import { subjectIcon } from "@/utils/subjects";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Spacing from "@/components/Spacing/Spacing";
import ModalSelect from "@/components/ModalSelect/ModalSelect";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import FillInTheBlankCard from "@/components/FillInTheBlankCard/FillInTheBlankCard";
import BackpackBreadcrumb from "@/components/BackpackBreadcrumb/BackpackBreadcrumb";

type DefaultFitbPageProps = {
   noteSelected: Note;
   subject: string;
   subjectLevel: string;
}

export default function DefaultFitbPage ({ noteSelected, subject, subjectLevel }: DefaultFitbPageProps) {
   const subInfo = subjectCombinator(subject, subjectLevel);
   const [numQuestions, setNumQuestions] = useState<string>('5');
   const [topicSelected, setTopicSelected] = useState<string | null>(null);
   const [aiFitb, setAiFitb] = useState<FillInTheBlank | null>(null);
   
   const { openSplash, closeSplash } = useSplashScreen();

   function handleLoadingCreateFitb () {
      openSplash({
         title: <>Creating Questions</>,
         description: <>We are getting your fill in the blank <b>{titleCase(subjectLevel)} {titleCase(subject)} {topicSelected!}</b> questions...</>,
         style: "flashcard",
         actions: []
      })
   }

   async function handleCreateFitbQuestionsAI (callback: Function) {
      if (!topicSelected) {
         toast.error("Please select a topic");
         callback();
         return;
      }
      handleLoadingCreateFitb();
      const data = await generateUsingAi({
         prompt: fitbDefaultSubjectMakerPrompt({
            topic: topicSelected, numberOfQuestions: parseInt(numQuestions),
            subjectLevel: subInfo.subjectLevel, subject: subInfo.subject
         }),
         responseFormat: ResponseFormats.FillInTheBlankMaker
      });

      if (data.success == false) {
         openSplash({
            title: "Error",
            description: data.error,
            style: "error",
            actions: [
               {
                  appearance: "normal",
                  action: () => handleCreateFitbQuestionsAI(()=>{}),
                  label: <><RotateCcw size={18} /> Try Again</>
               }
            ],
         })
         callback();
         return;
      }
      setAiFitb(data.data.questions || null);
      callback();
      closeSplash();
   }

   return (
      <AppWrapper>
         <div className="box full">
            <BackpackBreadcrumb
               startingBackpack
               links={[
                  {
                     label: <>{subjectIcon[subInfo.subject]} {titleCase(subjectLevel)} {titleCase(subject)}</>,
                     link: subInfo.subjectPageUrl
                  }
               ]}
            />

            {aiFitb ? (<>
               <Spacing size={2} />
               <FillInTheBlankCard 
                  title={`${subInfo.subjectLevel} ${subInfo.subject} ${topicSelected!}`} questions={aiFitb} subjectInfo={subInfo}
                  onMakeNew={() => setAiFitb(null)} topic={topicSelected!}
               />
            </>) : (<>
               <div className="box full pd-15">
                  <div className="text-xl full bold-700 accent-color-gradient-dark-text">Fill In The Blank</div>
                  <div className="text-xs full bold-500" style={{ color: subInfo.subjectColor }}>{subInfo.subjectLevel} {subInfo.subject}</div>
               </div>
               <div className="box full pd-1 dfb column gap-15">
                  <div className="box full dfb column gap-10 pd-1">
                     <div className="text-m full bold-600">Number of Questions</div>
                     <div className="text-xxs full grey-5">Default number of questions is 5</div>
                     <ModalSelect
                        title="Choose Number of Questions"
                        options={["5","10"]}
                        onSelect={option => setNumQuestions(option)}
                        defaultOption={0}
                     />
                  </div>
                  
                  <div className="box full dfb column gap-10 pd-1">
                     <div className="text-m full bold-600">Choose Topic</div>
                     <ModalSelect
                        title="Choose Topic"
                        options={subInfo.subjectTopics}
                        onSelect={option => setTopicSelected(option)}
                     />
                  </div>
               </div>
               <div className="box full pd-1 dfb column gap-15">
                  <AwaitButton className="xxs pd-15 pdx-3 accent-hover radius-20" onClick={handleCreateFitbQuestionsAI}>
                     <Play size={18} /> Begin Questions!
                  </AwaitButton>
               </div>
            </>)}
         </div>
      </AppWrapper>
   )
}
