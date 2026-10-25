'use client'
import { useRef, useState } from "react"
import { subjectLevels } from "@/utils/subjects"
import { ArrowLeft, CircleCheck } from "lucide-react"
import { toast } from "sonner"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import DocumentNoteMaker from "./DocumentNoteMaker"
import SubjectNoteMaker from "./SubjectNoteMaker"
import FullSelect from "@/components/FullSelect/FullSelect"
import Spacing from "@/components/Spacing/Spacing"

type StepSection = "subject-level" | "custom-subject" | "document" | "subject";

export default function NoteMakerPage ({ allUserFolders }: { allUserFolders: string[] }) {
   const contentRef = useRef<HTMLDivElement | null>(null);

   const [stepSections, setStepSections] = useState<StepSection>("subject-level");

   // note creation states
   const [subjectLevelSelected, setSubjectLevelSelected] = useState("");
   const [nameOfCustomSubject, setNameOfCustomSubject] = useState("");

   return (
      <AppWrapper contentRef={contentRef}>
         <div className="box full h-full pd-15 dfb column align-center">
            <div className="text-l full bold-700 text-center accent-color-gradient-text">LEARN ANYTHING</div>
            <div className="text-xxxs full text-center">Make notes on any subject in the world, just tell us what you want to learn</div>
            
            {(stepSections == "subject-level") && (
               <FullSelect
                  title="Choose Subject Level"
                  description="It doesn't have to be an Advanced Higher, Higher or National 5"
                  options={[...subjectLevels,"None of the Above"].map(n => ({ option: n, optionName: n == "None of the Above" ? "" : n }))}
                  onSelect={(option) => {
                     setSubjectLevelSelected(option.optionName)
                     setStepSections(option.optionName ? "subject" : "custom-subject")
                  }}
               />
            )}
            
            {(stepSections == "subject") && (
               <SubjectNoteMaker 
                  contentRef={contentRef}
                  defaultSubjectLevel={subjectLevelSelected}
               />
            )}
            
            {(stepSections == "custom-subject") && (
               <div className="box full pd-3 dfb column align-center" style={{ gap: "0px" }}>
                  <div className="text-sm bold-600 full text-center">Subject Name</div>
                  <div className="text-xxs pd-1 grey-5 full text-center">Enter the name of the subject you would like to learn.</div>
                  <input 
                     type="text" className="xs pd-14 pdx-2 full mw-500" placeholder="Name here..."
                     value={nameOfCustomSubject} onChange={e => setNameOfCustomSubject(e.target.value)}
                  />
                  <Spacing size={2} />
                  <div className="full-select-choice-btn">
                     <button 
                        className="xxs pd-13 full mw-500 radius-20" 
                        onClick={() => {
                           if (allUserFolders.map(f => f.toLowerCase()).includes(nameOfCustomSubject.replaceAll('-',' ').toLowerCase())) {
                              toast.error("You already have a subject with that name");
                           } else {
                              setStepSections("document")
                           }
                        }}
                     >
                        <CircleCheck size={18} /> Choose
                     </button>
                     <button className="xxs pd-13 full mw-500 radius-20 outline-black" onClick={() => setStepSections("subject-level")}>
                        <ArrowLeft size={18} /> Back
                     </button>
                  </div>
               </div>
            )}
            
            {(stepSections == "document") && (
               <DocumentNoteMaker
                  saveNoteFolderName={nameOfCustomSubject.replaceAll('-',' ').toLowerCase()}
               />
            )}
         </div>
      </AppWrapper>
   )
}