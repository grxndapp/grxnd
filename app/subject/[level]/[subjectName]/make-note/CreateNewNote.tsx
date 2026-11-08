'use client'
import { titleCase } from "@/lib/str";
import { customSubjectToBoldColor, subjectColors } from "@/utils/subjects";
import { ArrowLeft, File, LibraryBig } from "lucide-react"
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { getSubjectPageUrl } from "../helper";
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import SwitchSlide from "@/components/SwitchSlide/SwitchSlide";
import DocumentNoteMaker from "./DocumentNoteMaker";
import SubjectNoteMaker from "./SubjectNoteMaker";
import Spacing from "@/components/Spacing/Spacing";

type CreateNewNoteProps = {
   isDefaultSubject: boolean;
   subjectLevel: string;
   subject: string;
}

export default function CreateNewNote ({ subject, subjectLevel, isDefaultSubject }: CreateNewNoteProps) {
   const router = useRouter();

   // default subject states and references
   const contentRef = useRef<HTMLDivElement | null>(null);
   const [formType, setFormType] = useState<'document' | 'subject'>('subject');

   // cosmetics
   const subjectColor = subjectLevel ? subjectColors[titleCase(subject)] : customSubjectToBoldColor(titleCase(subject));
   const subjectPageUrl = getSubjectPageUrl(subject, subjectLevel);
   const subjectFullName = titleCase(`${subjectLevel} ${subject}`);
   
   return (
      <AppWrapper contentRef={contentRef}>
         <div className="box full">
            <div className="text-xxs fit visible-link mb-1 accent-color" onClick={() => router.push(subjectPageUrl)}>Backpack</div>
            <div className="text-xl bold-700 full no-trans" style={{ color: subjectColor }}>Create Note</div>
            <div className="text-xxs full mb-1 no-trans" style={{ color: subjectColor }}>{titleCase(subjectLevel)} {titleCase(subject)}</div>
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

               {(formType == "document") && (<DocumentNoteMaker subjectFullName={subjectFullName}  />)}
               {(formType == "subject") && (<SubjectNoteMaker contentRef={contentRef} subjectFullName={subjectFullName} />)}
            </>) : (<>
               <DocumentNoteMaker subjectFullName={subjectFullName}  />
            </>)}
         </div>
      </AppWrapper>
   )
}

