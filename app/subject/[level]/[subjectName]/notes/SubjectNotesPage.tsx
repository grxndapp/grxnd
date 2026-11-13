'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Spacing from "@/components/Spacing/Spacing";
import BackpackBreadcrumb from "@/components/BackpackBreadcrumb/BackpackBreadcrumb";
import RenameNote from "@/modal-forms/RenameNote";
import { subjectCombinator } from "../clientHelper";
import { pluralSuffixer, titleCase } from "@/lib/str";
import { formatMilliseconds } from "@/utils/date";
import { anySubjectDefIcon, fullSubjectBreakDown, isAmongstDefaultSubjects, subjectIcon } from "@/utils/subjects";
import { Check, GraduationCap, NotebookPen, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation";
import { cloneElement, useState } from "react";
import { useModal } from "@/components/Modal/ModalContext";
import { DeleteNotes } from "@/modal-forms/DeleteNote";

export default function SubjectNotesPage ({ notes, subject, subjectLevel }: { notes: Note[], subject: string, subjectLevel: string }) {
   const subjectInfo = subjectCombinator(subject, subjectLevel);

   return (
      <AppWrapper>
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
            <div className="box full mb-1">
               <div className="text-xl full bold-700 accent-color-gradient-dark-text">{subjectInfo.subjectLevel} {subjectInfo.subject} Notes</div>
            </div>

            <DisplaySubjectNotes
               notes={notes}
               subjectColor={subjectInfo.subjectColor}
               subjectPageUrl={subjectInfo.subjectPageUrl}
               subjectPastelColor={subjectInfo.subjectPastelColor}
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
      <div className="box full no-select">
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
         {applyNoteFilter().length > 0 && (
            <div className="box full pd-1">
               <div className="text-xs fit visible-link accent-color mt-1" onClick={() => router.push(`${subjectPageUrl}/notes`)}>
                  View all notes
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
                           <div className="text-xs bold-600 full">{note.noteName || JSON.parse(note.noteJson).title}</div>
                           <div className="text-xxxs grey-5 full">
                              {formatMilliseconds(new Date(note.createdAt).getTime(), true)}
                           </div>
                        </div>
                        <div className="backpack-subject-note-item-actions" onClick={() => router.push(`${subjectPageUrl}/start-quiz?noteId=${note.noteid}`)}>
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