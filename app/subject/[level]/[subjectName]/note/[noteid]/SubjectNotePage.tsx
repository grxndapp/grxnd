'use client'
import { useModal } from "@/components/Modal/ModalContext"
import { titleCase } from "@/lib/str"
import { BookCheck, ChevronDown, NotebookPen, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { subjectCombinator } from "../../clientHelper"
import { anySubjectDefIcon, subjectIcon } from "@/utils/subjects"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import NoteViewer from "@/components/NoteViewer/NoteViewer"
import Spacing from "@/components/Spacing/Spacing"
import MultiActionDropdown from "@/components/MultiActionDropdown/MultiActionDropdown"
import DeleteNote from "@/modal-forms/DeleteNote"
import RenameNote from "@/modal-forms/RenameNote"
import BackpackBreadcrumb from "@/components/BackpackBreadcrumb/BackpackBreadcrumb"

export default function SubjectNotePage ({ note, subject, subjectLevel }: { note: Note, subjectLevel: string, subject: string }) {
   const router = useRouter();
   const { showModal } = useModal();
   const [noteName, setNoteName] = useState(note['noteName'] ?? '');
   
   const subjectInfo = subjectCombinator(subject, subjectLevel);

   function handleCreateQuiz () {
      router.push(`${subjectInfo.subjectPageUrl}/start-quiz?noteId=${encodeURIComponent(note.noteid)}`)
   }
   
   function handleDeleteNote () {
      showModal({
         content: <DeleteNote
            note={note}
            onDeleted={() => router.push("/notebooks")}
         />
      })
   }
   
   function handleRenameNote () {
      showModal({
         content: <RenameNote
            note={note}
            onRenamed={newName => setNoteName(newName)}
         />
      })
   }

   return (
      <AppWrapper>
         <div className="box full pd-1 dfb align-center gap-10">
            <BackpackBreadcrumb
               startingBackpack
               links={[
                  {
                     label: <>{subjectInfo.isDefaultSubject ? subjectIcon[subjectInfo.subject] : anySubjectDefIcon} {titleCase(subjectLevel)} {titleCase(subject)}</>,
                     link: subjectInfo.subjectPageUrl
                  }
               ]}
            />
            <div className="box full dfb align-center justify-end">
               <MultiActionDropdown
                  className="xxxs pd-11 pdx-2 outline-black no-shadow radius-20"
                  actions={[
                     {
                        label: <><BookCheck size={17} /> Create Quiz</>,
                        action: handleCreateQuiz,
                        appearance: "accent"
                     },
                     {
                        label: <><NotebookPen size={17} /> Rename Note</>,
                        action: handleRenameNote,
                        appearance: "accent"
                     },
                     {
                        label: <><Trash2 size={17} /> Delete Note</>,
                        action: handleDeleteNote,
                        appearance: "delete"
                     }
                  ]}
               >
                  More <ChevronDown size={16} />
               </MultiActionDropdown>
            </div>
         </div>

         <NoteViewer note={JSON.parse(note.noteJson)} noteName={noteName} noButtons noSubject />
         <Spacing size={4} />
      </AppWrapper>
   )
}