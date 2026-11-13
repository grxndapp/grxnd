'use client'
import { useSplashScreen } from "@/components/SplashScreen/SplashScreenContext";
import { titleCase } from "@/lib/str";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { subjectCombinator } from "../clientHelper";
import { Play, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { generateUsingAi } from "@/app/actions/ai";
import { fitbNoteMakerPrompt } from "@/prompts/aiFillInTheBlankMaker";
import { ResponseFormats } from "@/prompts/responseFormats";
import { anySubjectDefIcon } from "@/utils/subjects";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import ModalSelect from "@/components/ModalSelect/ModalSelect";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import FillInTheBlankCard from "@/components/FillInTheBlankCard/FillInTheBlankCard";
import BackpackBreadcrumb from "@/components/BackpackBreadcrumb/BackpackBreadcrumb";

type CustomFitbPageProps = {
   noteSelected: Note;
   notes: Note[];
   subject: string;
   subjectLevel: string;
}

export default function CustomFitbPage ({ notes, subject, subjectLevel }: CustomFitbPageProps) {
   const router = useRouter();
   const subInfo = subjectCombinator(subject, subjectLevel);
   const [numQuestions, setNumQuestions] = useState<string>('5');
   const [noteSelected, setNoteSelected] = useState<Note | null>(null);
   const [aiFitb, setAiFitb] = useState<FillInTheBlank | null>(null);
   
   const { openSplash, closeSplash } = useSplashScreen();

   function handleLoadingCreateFitb () {
      openSplash({
         title: <>Creating Questions</>,
         description: <>We are getting your fill in the blank <b>{titleCase(subjectLevel)} {titleCase(subject)} {JSON.parse(noteSelected?.noteJson!).title!}</b> questions...</>,
         style: "flashcard",
         actions: []
      })
   }

   async function handleCreateFitbQuestionsAI (callback: Function) {
      if (!noteSelected) {
         toast.error("Please select a note");
         callback();
         return;
      }
      handleLoadingCreateFitb();
      const data = await generateUsingAi({
         prompt: fitbNoteMakerPrompt({
            numberOfQuestions: parseInt(numQuestions), note: noteSelected.noteJson
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
                     label: <>{anySubjectDefIcon} {titleCase(subjectLevel)} {titleCase(subject)}</>,
                     link: subInfo.subjectPageUrl
                  }
               ]}
            />
            {aiFitb ? (<>
               <FillInTheBlankCard 
                  title={`${subInfo.subjectLevel} ${subInfo.subject} ${JSON.parse(noteSelected?.noteJson!).title!}`} questions={aiFitb} subjectInfo={subInfo}
                  onMakeNew={() => setAiFitb(null)} topic={JSON.parse(noteSelected?.noteJson!).title!}
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
                     <div className="text-m full bold-600">Choose Note</div>
                     <ModalSelect
                        title="Choose Note"
                        options={notes.map(n => JSON.parse(n.noteJson).title)}
                        onSelect={(option, index) => setNoteSelected(notes.find((_,i) => i == index)!)}
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
