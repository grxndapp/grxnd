'use client'
import { pluralSuffixer, titleCase } from "@/lib/str"
import { customSubjectToBoldColor, customSubjectToPastelColor, fullSubjectBreakDown, isAmongstDefaultSubjects, subjectColors, subjectIcon, subjectPastelBgColors } from "@/utils/subjects"
import { Check, GraduationCap, Notebook, NotebookPen, Trash2 } from "lucide-react"
import { cloneElement, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { getSubjectPageUrl } from "./helper"
import { formatMilliseconds } from "@/utils/date"
import { useModal } from "@/components/Modal/ModalContext"
import { DeleteNotes } from "@/modal-forms/DeleteNote"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Spacing from "@/components/Spacing/Spacing"
import RenameNote from "@/modal-forms/RenameNote"

type SubjectStatPageProps = {
   quizzes: QuizT[];
   subject: string;
   subjectLevel: string;
   notes: Note[]; 
}

export default function SubjectStatPage ({ quizzes, subject, subjectLevel, notes }: SubjectStatPageProps) {
   const router = useRouter();
   const contentRef = useRef<HTMLDivElement | null>(null);

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

            <div className="box full dfb column gap-10">
               {quizzes.length > 0 ? (
                  <div className="box full">
                     <div className="text-xs full text-left">
                        <b style={{ color: subjectColor }}>{Math.round(averagePercentage)}%</b> Average Score
                     </div>
                     <div className="text-xxs fit text-left">
                        You have taken {newQuizArray.length} {subjectLevel.toLowerCase()} {subject.toLowerCase()} {pluralSuffixer('quiz',newQuizArray.length,'zes')}
                     </div>
                  </div>
               ) : (
                  <div className="box full">
                     <div className="text-xs full text-left">
                        You haven't done a quiz yet. Test yourself!
                     </div>
                  </div>
               )}
               <div className="box full pd-1 dfb wrap gap-10">
                  <button className="xxs pd-2 full mw-300" style={{ background: subjectColor }} onClick={() => router.push(`${subjectPageUrl}/start-quiz`)}>
                     <NotebookPen size={17} />Take A Quiz
                  </button>
                  <button className="xxs pd-2 full mw-300 outline-black tiny-shadow" onClick={() => router.push(`${subjectPageUrl}/make-note`)}>
                     <Notebook size={17} /> New Note
                  </button>
               </div>
               {quizzes.length > 0 && (
                  <div className="text-xxs fit visible-link accent-color" onClick={() => router.push(`${subjectPageUrl}/saved-quizzes`)}>
                     View your saved quizzes
                  </div>
               )}
            </div>
            <Spacing size={2} />

            <DisplaySubjectNotes
               notes={notes}
               subjectColor={subjectColor}
               subjectPageUrl={subjectPageUrl}
               subjectPastelColor={subjectPastelColor}
            />
            <Spacing size={5} />
         </div>
      </AppWrapper>
   )
}


type DisplaySubjectNotesProps = {
   notes: Note[];
   subjectColor: string;
   subjectPastelColor: string;
   subjectPageUrl: string;
}

function DisplaySubjectNotes ({ notes: rawNotes, subjectColor, subjectPastelColor, subjectPageUrl }: DisplaySubjectNotesProps) {
   const router = useRouter();
   const { showModal } = useModal();
   const [searchNotesQuery, setSearchNotesQuery] = useState("");
   const [notes, setNotes] = useState<Note[]>([...rawNotes]);
   const [selectedNotes, setSelectedNotes] = useState<any[]>([]);

   function toggleAddOrRemoveFromSelected (noteId: string) {
      setSelectedNotes(prev => {
         if (prev.includes(noteId)) {
            return [ ...prev.filter(n => n !== noteId) ]
         } else {
            return [ ...prev, noteId ]
         }
      })
   }

   function applyNoteFilter() {
      return notes.filter(n => JSON.parse(n.noteJson).title.toLowerCase().includes(searchNotesQuery.toLowerCase()) )
   }
   
      
   function handleDeleteNotes () {
      showModal({
         content: <DeleteNotes
            notes={selectedNotes.map(n => notes.find(note => note.noteid == n)!)}
            onDeleted={() => {
               setNotes(prev => prev.filter(n => !selectedNotes.includes(n.noteid)));
               setSelectedNotes([]);
            }}
         />
      })
   }

   function updateNoteName (noteid: string, newName: string) {
      setNotes(prev =>
         prev.map(note => note.noteid === noteid ? { ...note, noteName: newName } : note)
      );
   }
   
   function handleRenameNote (note: Note) {
      showModal({
         content: <RenameNote
            note={note}
            onRenamed={newName => {
               setSelectedNotes([]);
               updateNoteName(note.noteid, newName)
            }}
         />
      })
   }

   return (
      <div className="box full">
         <div className="text-l bold-700 full pd-05 no-trans" style={{ color: subjectColor }}>Notes</div>
         <div className="box full dfb align-center gap-10 pd-1">
            <input 
               type="text" className="xxs pd-13 pdx-2 radius-20 full mw-600" placeholder="Search Notes..."
               value={searchNotesQuery} onChange={e => setSearchNotesQuery(e.target.value)}
            />
         </div>
         {selectedNotes.length > 0 && (
            <div className="box full pd-2">
               <div className="text-m full bold-600 pd-05">Actions</div>
               <div className="box full dfb align-center gap-10">
                  {selectedNotes.length == 1 && (
                     <button className="xxxs pd-12 pdx-2" onClick={() => handleRenameNote(notes.find(n => n.noteid == selectedNotes[0])!)}>
                        <NotebookPen size={18} /> Rename Note
                     </button>
                  )}
                  <button className="xxxs pd-12 pdx-2 delete" onClick={handleDeleteNotes}>
                     <Trash2 size={18} /> Delete {pluralSuffixer('Note', selectedNotes.length, 's')}
                  </button>
               </div>
            </div>
         )}
         <div className="box full pd-1 dfb column gap-10">
            {applyNoteFilter().length == 0 && (
               <div className="text-xxs full">No notes yet</div>
            )}
            {applyNoteFilter().map(note => {
               const fullSubjectInfo = fullSubjectBreakDown(note.folderCodeName);
               const isDefaultSubject = isAmongstDefaultSubjects(note.folderCodeName);
               const SubjectIcon = subjectIcon[titleCase(fullSubjectInfo.subject)] ?? <></>;
               return (
                  <div 
                     key={note.noteid} 
                     className="backpack-subject-note-item"
                     style={{ "--notebook-item-hover-color": subjectPastelColor } as React.CSSProperties}
                  >
                     <div 
                        className={`backpack-subject-note-item-select-box ${selectedNotes.includes(note.noteid) && 'selected'}`}
                        onClick={() => toggleAddOrRemoveFromSelected(note.noteid)}
                     >
                        {selectedNotes.includes(note.noteid) && <Check size={12} strokeWidth={4} />}
                     </div>
                     <div 
                        className="backpack-subject-note-item-icon" style={{ color: subjectColor }}
                        onClick={() => router.push(`${subjectPageUrl}/note/${note.noteid}`)}
                     >
                        {isDefaultSubject ? cloneElement(SubjectIcon, { size: 25 }) : <GraduationCap size={25} />}
                     </div>
                     <div 
                        className="backpack-subject-note-item-info-actions"
                     >
                        <div className="backpack-subject-note-item-info" onClick={() => router.push(`${subjectPageUrl}/note/${note.noteid}`)}>
                           <div className="text-xs bold-600 full">{note.noteName ?? JSON.parse(note.noteJson).title}</div>
                           <div className="text-xxxs grey-5 full">
                              {formatMilliseconds(new Date(note.createdAt).getTime(), true)}
                           </div>
                        </div>
                        <div className="backpack-subject-note-item-actions" onClick={() => router.push(`${subjectPageUrl}/start-quiz?noteid=${note.noteid}`)}>
                           <button className="xxxs pd-11 pdx-2 radius-20 accent-color-50 whitespace-nowrap">Practice Now!</button>
                        </div>
                     </div>
                  </div>
               )
            })}
         </div>
      </div>
   )
}