'use client'
import { titleCase } from "@/lib/str"
import { customSubjectToBoldColor, customSubjectToPastelColor, fullSubjectBreakDown, isAmongstDefaultSubjects, subjectColors, subjectIcon, subjectPastelBgColors } from "@/utils/subjects"
import { GraduationCap, NotebookPen } from "lucide-react"
import { cloneElement, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { getSubjectPageUrl } from "./helper"
import { formatMilliseconds } from "@/utils/date"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Spacing from "@/components/Spacing/Spacing"

type SubjectStatPageProps = {
   quizzes: QuizT[];
   subject: string;
   subjectLevel: string;
   notes: Note[]; 
}

export default function SubjectStatPage ({ quizzes, subject, subjectLevel, notes }: SubjectStatPageProps) {
   const router = useRouter();
   const contentRef = useRef<HTMLDivElement | null>(null);
   const [searchNotesQuery, setSearchNotesQuery] = useState("");

   const newQuizArray = quizzes.reduce((agg: any, quiz) => {
      if (quiz.subject.toLowerCase() === subject) {
         agg.push({
            subjectLevel: quiz.subjectLevel,
            topic: quiz.topic,
            score: quiz.score,
            createdAt: new Date(quiz.createdAt).toUTCString(),
            name: `Quiz ${agg.length+1}`
         });
         return agg;
      }
      return agg;
   }, []);

   const averagePercentage = quizzes.reduce((agg: number, quiz) => {
      if (quiz.subject.toLowerCase() === subject) {
         agg += quiz.score;
         return agg;
      }
      return agg;
   }, 0) / (quizzes.filter(quiz => quiz.subject.toLowerCase() === subject).length);

   const subjectColor = subjectLevel ? subjectColors[titleCase(subject)] : customSubjectToBoldColor(titleCase(subject));
   const subjectPastelColor = subjectLevel ? subjectPastelBgColors[titleCase(subject)] : customSubjectToPastelColor(titleCase(subject));
   const subjectPageUrl = getSubjectPageUrl(subject, subjectLevel);

   return (
      <AppWrapper contentRef={contentRef}>
         <div className="box w-full h-full pd-2 no-trans">
            <div className="text-xxs fit visible-link accent-color" onClick={() => router.push('/backpack')}>Backpack</div>
            <div className="text-xl bold-700 full mb-1 pd-05 no-trans" style={{ color: subjectColor }}>{titleCase(subjectLevel)} {titleCase(subject)}</div>

            {quizzes.length > 0 && (
               <div className="box full dfb column gap-10">
                  <div className="box full">
                     <div className="text-xs full">
                        <b style={{ color: subjectColor }}>{Math.round(averagePercentage)}%</b> Average Score
                     </div>
                     <div className="text-xxs fit text-center">You have taken {newQuizArray.length} {subjectLevel.toLowerCase()} {subject.toLowerCase()} quizzes</div>
                  </div>
                  <div className="box full pd-1">
                     <button className="xxs pd-2 full mw-300" style={{ background: subjectColor }} onClick={() => router.push(`${subjectPageUrl}/start-quiz`)}>
                        <NotebookPen size={17} />Take A Quiz
                     </button>
                  </div>
                  <div className="text-xxs fit visible-link accent-color" onClick={() => router.push(`${subjectPageUrl}/saved-quizzes`)}>
                     View your saved quizzes
                  </div>
               </div>
            )}
            <Spacing size={2} />

            <div className="box full">
               <div className="text-l bold-700 full pd-05 no-trans" style={{ color: subjectColor }}>Notes</div>
               <div className="box full dfb column mb-1">
                  <input 
                     type="text" className="xxs pd-13 pdx-2 radius-20 full mw-600" placeholder="Search Notes..."
                     value={searchNotesQuery} onChange={e => setSearchNotesQuery(e.target.value)}
                  />
               </div>
               <div className="box full pd-1 dfb column gap-10">
                  {notes
                  .filter(n => JSON.parse(n.noteJson).title.toLowerCase().includes(searchNotesQuery.toLowerCase()) )
                  .map(note => {
                     const fullSubjectInfo = fullSubjectBreakDown(note.folderCodeName);
                     const isDefaultSubject = isAmongstDefaultSubjects(note.folderCodeName);
                     const SubjectIcon = subjectIcon[titleCase(fullSubjectInfo.subject)] ?? <></>;
                     
                     return (
                        <div 
                           key={note.noteid} 
                           className="backpack-subject-note-item"
                           style={{ "--notebook-item-hover-color": subjectPastelColor } as React.CSSProperties}
                           onClick={() => router.push(`${subjectPageUrl}/note/${note.noteid}`)}
                        >
                           <div className="backpack-subject-note-item-icon" style={{ color: subjectColor }}>
                              {isDefaultSubject ? cloneElement(SubjectIcon, { size: 25 }) : <GraduationCap size={25} />}
                           </div>
                           <div className="backpack-subject-note-item-info">
                              <div className="text-xs bold-600 full">{JSON.parse(note.noteJson).title}</div>
                              <div className="text-xxxs grey-5 full">
                                 {formatMilliseconds(new Date(note.createdAt).getTime(), true)}
                              </div>
                           </div>
                        </div>
                     )
                  })}
               </div>
            </div>
            
            <Spacing size={5} />
         </div>
      </AppWrapper>
   )
}
