'use client'
import "./BackpackSubjectCard.css"
import { SubjectIconBubble } from "@/styles-extra/styles";
import { customSubjectToBoldColor, customSubjectToPastelColor, fullSubjectBreakDown, subjectColors, subjectIcon, subjectPastelBgColors } from "@/utils/subjects";
import { GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import ProgressBar from "../ProgressBar/ProgressBar";


type BackpackSubjectProps = {
   subject: string;
   subjectLevel: string;
   isCustomSubject: boolean;
   subjectProgressRounded: string;
   subjectProgressRaw: number;
}

export default function BackpackSubject ({ subject, subjectLevel, isCustomSubject, subjectProgressRounded, subjectProgressRaw }: BackpackSubjectProps) {
   const router = useRouter();
   const subjectFolderName = fullSubjectBreakDown(subject).subject.toLowerCase().replaceAll(" ","-");
   const subjectLevelUrlParam = subjectLevel ? `${subjectLevel.replaceAll(" ","-").toLowerCase()}` : 'none';
   
   const backpackSubjectUrl = `/subject/${subjectLevelUrlParam}/${subjectFolderName}`;
   const subjectProgressBg = isCustomSubject ? customSubjectToPastelColor(subject) : subjectPastelBgColors[fullSubjectBreakDown(subject).subject];
   const subjectProgressBoldBg = isCustomSubject ? customSubjectToBoldColor(subject) : subjectColors[fullSubjectBreakDown(subject).subject];

   return (
      <div className="backpack-subject-item" onClick={() => router.push(backpackSubjectUrl)}>
         <div className="box fit h-full">
            <div className="backpack-subject-bar" style={{ backgroundColor: subjectProgressBoldBg }} />
         </div>
         <div className="backpack-subject-icon">
            <div style={{ ...SubjectIconBubble, background: subjectProgressBg }}>
               {isCustomSubject ? <GraduationCap size={20} /> : subjectIcon[fullSubjectBreakDown(subject).subject]}
            </div>
         </div>
         <div className="backpack-subject-info">
            <div className="text-xxs bold-600 full">{subject}</div>
            <div className="text-t full grey-5 pd-05">
               {subjectProgressRounded}% {isCustomSubject ? ' average score' : ' complete'}
            </div>
            <div className="box full pd-05 mw-300">
               <ProgressBar percentage={subjectProgressRaw} color={subjectProgressBoldBg} />
            </div>
         </div>
      </div>
   )
}
