'use client'
import { titleCase } from "@/lib/str";
import { anySubjectDefIcon, subjectIcon } from "@/utils/subjects";
import { File, LibraryBig } from "lucide-react";
import { useRef, useState } from "react";
import { subjectCombinator } from "../clientHelper";
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import SwitchSlide from "@/components/SwitchSlide/SwitchSlide";
import DocumentNoteMaker from "./DocumentNoteMaker";
import SubjectNoteMaker from "./SubjectNoteMaker";
import Spacing from "@/components/Spacing/Spacing";
import BackpackBreadcrumb from "@/components/BackpackBreadcrumb/BackpackBreadcrumb";

type CreateNewNoteProps = {
   isDefaultSubject: boolean;
   subjectLevel: string;
   subject: string;
}

export default function CreateNewNote ({ subject, subjectLevel, isDefaultSubject }: CreateNewNoteProps) {
   // default subject states and references
   const contentRef = useRef<HTMLDivElement | null>(null);
   const [formType, setFormType] = useState<'document' | 'subject'>('subject');

   // cosmetics
   const subjectInfo = subjectCombinator(subject, subjectLevel)
   
   return (
      <AppWrapper contentRef={contentRef}>
         <div className="box full">
            <BackpackBreadcrumb
               startingBackpack
               links={[
                  {
                     label: <>{subjectInfo.isDefaultSubject ? subjectIcon[subjectInfo.subject] : anySubjectDefIcon} {titleCase(subjectLevel)} {titleCase(subject)}</>,
                     link: subjectInfo.subjectPageUrl
                  }
               ]}
            />
            <div className="text-xl full bold-700 accent-color-gradient-dark-text">Create Note</div>
            <div className="text-xs full bold-500" style={{ color: subjectInfo.subjectColor }}>
               {subjectInfo.subjectLevel} {subjectInfo.subject}
            </div>
            <Spacing />

            {isDefaultSubject ? (<>
               <SwitchSlide 
                  items={[
                     { label: <><File size={17} /> Upload</>, key: "document" },
                     { label: <><LibraryBig size={17} /> Choose Subject</>, key: "subject" },
                  ]}
                  onItemSelected={(key: any) => setFormType(key)}
                  defaultKeySelectedIndex={1}
               />

               {(formType == "document") && (<DocumentNoteMaker subjectFullName={subjectInfo.subjectFullName}  />)}
               {(formType == "subject") && (<SubjectNoteMaker contentRef={contentRef} subjectFullName={subjectInfo.subjectFullName} />)}
            </>) : (<>
               <DocumentNoteMaker subjectFullName={subjectInfo.subjectFullName}  />
            </>)}
         </div>
      </AppWrapper>
   )
}

