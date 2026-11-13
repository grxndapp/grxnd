'use client'
import { useSplashScreen } from "@/components/SplashScreen/SplashScreenContext";
import { titleCase } from "@/lib/str";
import { useState } from "react";
import { subjectCombinator } from "../clientHelper";
import { PlayingCardsFan, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { generateUsingAi } from "@/app/actions/ai";
import { ResponseFormats } from "@/prompts/responseFormats";
import { anySubjectDefIcon } from "@/utils/subjects";
import { flashcardNoteMakerPrompt } from "@/prompts/aiFlashcardsMaker";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import ModalSelect from "@/components/ModalSelect/ModalSelect";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import BackpackBreadcrumb from "@/components/BackpackBreadcrumb/BackpackBreadcrumb";

type CustomSubFlashcardsPageProps = {
   noteSelected: Note;
   notes: Note[];
   subject: string;
   subjectLevel: string;
}

export default function CustomSubFlashcardsPage ({ notes, subject, subjectLevel }: CustomSubFlashcardsPageProps) {
   const subInfo = subjectCombinator(subject, subjectLevel);
   const [noteSelected, setNoteSelected] = useState<Note | null>(null);
   const [aiFlashcards, setAiFlashcards] = useState<Flashcard[] | null>(null);
   
   const { openSplash, closeSplash } = useSplashScreen();

   function handleLoadingCreateFlashcards () {
      openSplash({
         title: <>Creating Questions</>,
         description: <>We are getting your fill in the blank <b>{titleCase(subjectLevel)} {titleCase(subject)}</b>...</>,
         style: "flashcard",
         actions: []
      })
   }

   async function handleCreateFlashcards (callback: Function) {
      if (!noteSelected) {
         toast.error("Please select a note");
         callback();
         return;
      }
      handleLoadingCreateFlashcards();
      const data = await generateUsingAi({
         prompt: flashcardNoteMakerPrompt({  note: noteSelected.noteJson }),
         responseFormat: ResponseFormats.FlashcardMaker
      });

      if (data.success == false) {
         openSplash({
            title: "Error",
            description: data.error,
            style: "error",
            actions: [
               {
                  appearance: "normal",
                  action: () => handleCreateFlashcards(()=>{}),
                  label: <><RotateCcw size={18} /> Try Again</>
               }
            ],
         })
         callback();
         return;
      }
      setAiFlashcards(data.data.flashcards || null);
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
            {aiFlashcards ? (<>
               {JSON.stringify(aiFlashcards)}
            </>) : (<>
               <div className="box full pd-15">
                  <div className="text-xl full bold-700 accent-color-gradient-dark-text">Create Flashcards</div>
                  <div className="text-xs full bold-500" style={{ color: subInfo.subjectColor }}>{subInfo.subjectLevel} {subInfo.subject}</div>
               </div>
               <div className="box full pd-1 dfb column gap-15">
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
                  <AwaitButton className="xxs pd-15 pdx-3 accent-hover radius-20" onClick={handleCreateFlashcards}>
                     <PlayingCardsFan size={18} /> Create
                  </AwaitButton>
               </div>
            </>)}
         </div>
      </AppWrapper>
   )
}
