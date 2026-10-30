'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Card from "@/components/Card/Card";
import Spacing from "@/components/Spacing/Spacing";
import { titleCase } from "@/lib/str";
import { NotebookCardStyles, SubjectIconBubble } from "@/styles-extra/styles";
import { formatMilliseconds } from "@/utils/date";
import { customSubjectToBoldColor, customSubjectToPastelColor, fullSubjectBreakDown, isAmongstDefaultSubjects, subjectColors, subjectIcon, subjectPastelBgColors } from "@/utils/subjects";
import { ArrowLeft, GraduationCap, NotebookText } from "lucide-react"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSubjectPageUrl } from "../helper";

export default function SubjectNotesPage ({ notes, subject, subjectLevel }: { notes: Note[], subject: string, subjectLevel: string }) {
   const router = useRouter();
   const [searchNotes, setSearchNotes] = useState('');
   const subjectColor = subjectLevel ? subjectColors[titleCase(subject)] : customSubjectToBoldColor(titleCase(subject));
   const subjectPageUrl = getSubjectPageUrl(subject, subjectLevel);

   function applyFilters () {
      return notes.filter(note =>
         (note.folderCodeName.toLowerCase().includes(searchNotes.toLowerCase())) ||
         (JSON.parse(note.noteJson).title.toLowerCase().includes(searchNotes.toLowerCase()))
      )
   }
   
   return (
      <AppWrapper>
         <div className="box full">
            <div className="box full pd-1 dfb align-center gap-10">
               <button 
                  className="xxxs pd-13 pdx-15 outline-black no-shadow radius-40"
                  onClick={() => router.push(subjectPageUrl)}
               >
                  <ArrowLeft size={16} />
               </button>
            </div>

            <div className="box full">
               <div className="text-xl bold-700 full text-center pd-1 no-trans" style={{ color: subjectColor }}>
                  {titleCase(subjectLevel)} {titleCase(subject)} Notes
               </div>
            </div>

            <div className="box full dfb column align-center gap-10 pd-15">
               <input 
                  type="text"
                  className="xxs pd-14 pdx-2 full mw-500"
                  placeholder="Search Notebooks..."
                  value={searchNotes}
                  onChange={(e) => setSearchNotes(e.target.value)}
               />
               <div className="box full pd-05 dfb justify-center">
                  <button className="xs pd-14 full mw-500 radius-25" onClick={() => router.push(`${subjectPageUrl}/make-note`)}>
                     <NotebookText size={18} /> New Note
                  </button>
               </div>
            </div>
            <div className="box full dfb wrap gap-10">
               {applyFilters().length < 1 && (
                  <div className="text-s grey-5 full pd-05 pdx- text-center">No Notes in this folder</div>
               )}
               {applyFilters().map((note, index) => (
                  <NoteBookItem key={index} note={note} subjectPageUrl={subjectPageUrl} />
               ))}
            </div>
            <Spacing size={5} />
         </div>
      </AppWrapper>
   )
}


function NoteBookItem ({ note, subjectPageUrl }: { note: Note, subjectPageUrl: string }) {
   const router = useRouter();

   const fullSubjectInfo = fullSubjectBreakDown(note.folderCodeName);
   const isDefaultSubject = isAmongstDefaultSubjects(note.folderCodeName);
   const subjectColor = isDefaultSubject ? subjectPastelBgColors[titleCase(fullSubjectInfo.subject)] : customSubjectToPastelColor(titleCase(note.folderCodeName));

   return (<Card styles={{...NotebookCardStyles,maxWidth:"550px"}} onClick={() => router.push(`${subjectPageUrl}/note/${note.noteid}`)}>
      <div className="box full dfb column gap-5">
         <div style={{ ...SubjectIconBubble, background: subjectColor }}>
            {isDefaultSubject ? subjectIcon[titleCase(fullSubjectInfo.subject)] : <GraduationCap size={20} />}
         </div>
         <div className="text-xs bold-700 full mt-1">{JSON.parse(note.noteJson).title}</div>
         <div className="text-xxs grey-5 mt-05">
            {titleCase(note.folderCodeName)}
         </div>
         <div className="text-xxxs pd-05 grey-5 full">
            {formatMilliseconds(new Date(note.createdAt).getTime(), true)}
         </div>
      </div>
   </Card>)
}