'use client'
import { useRef, useState } from "react"
import { subjectLevels } from "@/utils/subjects"
import { ArrowLeft, ArrowRight, CircleCheck } from "lucide-react"
import { toast } from "sonner"
import { ModalCustomSelect } from "@/components/ModalSelect/ModalSelect"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import DocumentNoteMaker from "./DocumentNoteMaker"
import SubjectNoteMaker from "./SubjectNoteMaker"
import Spacing from "@/components/Spacing/Spacing"
import BackpackBreadcrumb from "@/components/BackpackBreadcrumb/BackpackBreadcrumb"

type StepSection = "subject-level" | "custom-subject" | "document" | "subject";

export default function NoteMakerPage ({ allUserFolders }: { allUserFolders: string[] }) {
   const contentRef = useRef<HTMLDivElement | null>(null);
   const [stepSections, setStepSections] = useState<StepSection>("subject-level");

   // note creation states
   const [subjectLevelSelected, setSubjectLevelSelected] = useState('');
   const [nameOfCustomSubject, setNameOfCustomSubject] = useState("");

   function handleCheckSubjectLevelChosen () {
      if (subjectLevelSelected.trim() == '') {
         toast.error("Please choose a subject level")
      } else {
         setStepSections(subjectLevelSelected !== 'none' ? "subject" : "custom-subject")
      }
   }

   function validateCustomSubjectName () {
      if (nameOfCustomSubject.trim() == "") {
         toast.error("Please enter a name for the subject")
         return;
      }
      if (allUserFolders.map(f => f.toLowerCase()).includes(nameOfCustomSubject.replaceAll('-',' ').toLowerCase())) {
         toast.error("You already have a subject with that name");
      } else {
         setStepSections("document")
      }
   }

   return (
      <AppWrapper contentRef={contentRef}>
         <div className="box full h-full dfb column align-center">
            <BackpackBreadcrumb
               startingHome links={[]}
            />
            <div className="text-l full bold-700 accent-color-gradient-dark-text">LEARN ANYTHING</div>
            <div className="text-xxs full">Make notes on any subject in the world, just tell us what you want to learn</div>
            
            {(stepSections == "subject-level") && (<>
               <div className="box full dfb column pd-2">
                  <div className="text-sm full bold-700 mb-1">Choose Subject Level</div>
                  <ModalCustomSelect
                     title="Choose Subject Level"
                     options={[...subjectLevels,"None of the Above (Custom Subject)"].map(n => ({ option: n, optionName: n == "None of the Above (Custom Subject)" ? "none" : n }))}
                     onSelect={(option) => setSubjectLevelSelected(option.optionName)}
                     defaultOption={subjectLevelSelected == ''
                        ? undefined
                        : (subjectLevelSelected == "none" ? subjectLevels.length : subjectLevels.indexOf(subjectLevelSelected))
                     }
                  />
               </div>
               <div className="box full dfb column pd-1">
                  <button className="xxs pdx-2 pd-14 tiny-shadow radius-20 accent-hover" onClick={handleCheckSubjectLevelChosen}>
                     Continue <ArrowRight size={17} />
                  </button>
               </div>
            </>)}
            
            {(stepSections == "subject") && (
               <SubjectNoteMaker 
                  contentRef={contentRef}
                  defaultSubjectLevel={subjectLevelSelected}
               />
            )}
            
            {(stepSections == "custom-subject") && (
               <div className="box full pd-3 dfb column" style={{ gap: "0px" }}>
                  <div className="text-sm bold-700 full">Subject Name</div>
                  <div className="text-xxs pd-05 mb-1 grey-5 full">Enter the name of the subject you would like to learn.</div>
                  <input 
                     type="text" className="xs pd-14 pdx-2 full mw-500" placeholder="Name here..."
                     value={nameOfCustomSubject} onChange={e => setNameOfCustomSubject(e.target.value)}
                  />
                  <Spacing size={2} />
                  <div className="box full dfb align-center wrap gap-10">
                     <button 
                        className="xxs pd-13 pdx-3 radius-20" 
                        onClick={validateCustomSubjectName}
                     >
                        <CircleCheck size={18} /> Choose
                     </button>
                     <button className="xxs pd-13 pdx-3 radius-20 outline-black tiny-shadow" onClick={() => setStepSections("subject-level")}>
                        <ArrowLeft size={18} /> Back
                     </button>
                  </div>
               </div>
            )}
            
            {(stepSections == "document") && (<>
               <div className="box full dfb column pd-1 mt-1">
                  <button className="xxs pdx-2 pd-13 tiny-shadow radius-20 outline-black tiny-shadow" onClick={() => setStepSections("custom-subject")}>
                     <ArrowLeft size={17} /> Back
                  </button>
               </div>
               
               <DocumentNoteMaker
                  saveNoteFolderName={nameOfCustomSubject.replaceAll('-',' ').toLowerCase()}
               />
            </>)}
         </div>
      </AppWrapper>
   )
}