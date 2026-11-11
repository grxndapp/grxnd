'use client'
import { pluralSuffixer, titleCase } from "@/lib/str"
import { customSubjectToBoldColor, customSubjectToPastelColor, fullSubjectBreakDown, isAmongstDefaultSubjects, subjectColors, subjectIcon, subjectPastelBgColors } from "@/utils/subjects"
import { Check, GraduationCap, NotebookPen, Trash2 } from "lucide-react"
import { cloneElement, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { getSubjectPageUrl } from "./helper"
import { formatMilliseconds } from "@/utils/date"
import { useModal } from "@/components/Modal/ModalContext"
import { DeleteNotes } from "@/modal-forms/DeleteNote"
import { FillInTheBlankIllustration, FlashcardsIllustration, NotesIllustration, QuizIllustration, SixtySevenIllustration, StudyPlanIllustration } from "@/components/StudyMethodIcons/StudyMethodIcons"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Spacing from "@/components/Spacing/Spacing"
import RenameNote from "@/modal-forms/RenameNote"
import StudyMethodCard from "@/components/StudyMethodCard/StudyMethodCard"

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
   const studyMethodIconSize = 26;

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
                     <div className="text-xs fit text-left">
                        You have taken {newQuizArray.length} {subjectLevel.toLowerCase()} {subject.toLowerCase()} {pluralSuffixer('quiz',newQuizArray.length,'zes')}
                     </div>
                     <div className="text-xs fit visible-link accent-color mt-1" onClick={() => router.push(`${subjectPageUrl}/saved-quizzes`)}>
                        View your saved quizzes
                     </div>
                  </div>
               ) : (
                  <div className="box full">
                     <div className="text-xs full text-left">You haven't done a quiz yet. Test yourself!</div>
                  </div>
               )}

               <Spacing />
               <div className="box full dfb column gap-5">
                  <div className="text-l bold-700 full no-trans" style={{ color: subjectColor }}>Study Methods</div>
                  <div className="text-xs">Explore different ways you can study <b style={{ color: subjectColor }}>{titleCase(subjectLevel)} {titleCase(subject)}</b></div>
                  <div className="box full pd-15 dfb wrap gap-10">
                     <StudyMethodCard
                        icon={<QuizIllustration size={studyMethodIconSize} />}
                        onClick={() => router.push(`${subjectPageUrl}/start-quiz`)}
                        title="Take A Quiz"
                        description="Good for practising and gaining points"
                     />
                     <StudyMethodCard
                        icon={<NotesIllustration size={studyMethodIconSize} />}
                        onClick={() => router.push(`${subjectPageUrl}/make-note`)}
                        title="New Note"
                        description="Helps you make structured notes on big files and topics"
                     />
                     <StudyMethodCard
                        icon={<FillInTheBlankIllustration size={studyMethodIconSize} />}
                        onClick={() => router.push(`${subjectPageUrl}/fill-in-the-blank`)}
                        title="Fill in the Blank"
                        description="Perfect for theory and understanding"
                     />
                     <StudyMethodCard
                        icon={<StudyPlanIllustration size={studyMethodIconSize} />}
                        // onClick={() => router.push(`${subjectPageUrl}/make-note`)}
                        title="Make Study Plan"
                        description="Coming Soon. Helps you plan your time for studying toward a certain date"
                     />
                     <StudyMethodCard
                        icon={<FlashcardsIllustration size={studyMethodIconSize} />}
                        // onClick={() => router.push(`${subjectPageUrl}/make-note`)}
                        title="Quick Learn"
                        description="Coming Soon. Learn a topic very fast with fast (flash) cards"
                     />
                     <StudyMethodCard
                        icon={<SixtySevenIllustration width={studyMethodIconSize} height={studyMethodIconSize} size={studyMethodIconSize} />}
                        // onClick={() => router.push(`${subjectPageUrl}/make-note`)}
                        title="67 Way"
                        description="Coming Soon. Secret Sauce Geniuses use"
                     />
                  </div>
               </div>
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
      <div className="box full no-select">
         <div className="text-l bold-700 full pd-05 no-trans" style={{ color: subjectColor }}>Your Notes</div>
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