'use client'
import { llmForMarkdownAndJson } from "@/app/actions/ai"
import { createTempQuiz } from "@/app/actions/quiz"
import { useModal } from "@/components/Modal/ModalContext"
import { titleCase } from "@/lib/str"
import { buildNoteQuizPrompt } from "@/prompts/quizMaker"
import { ArrowLeft, BookCheck, ChevronDown, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { getSubjectPageUrl } from "../../helper"
import AwaitButton from "@/components/AwaitButton/AwaitButton"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import NoteViewer from "@/components/NoteViewer/NoteViewer"
import Select from "@/components/Select/Select"
import Spacing from "@/components/Spacing/Spacing"
import MultiActionDropdown from "@/components/MultiActionDropdown/MultiActionDropdown"
import DeleteNote from "@/modal-forms/DeleteNote"
import { customSubjectToBoldColor, subjectColors } from "@/utils/subjects"

export default function SubjectNotePage ({ note, subject, subjectLevel }: { note: Note, subjectLevel: string, subject: string }) {
   const router = useRouter();
   const { showModal } = useModal();
   const subjectPageUrl = getSubjectPageUrl(subject, subjectLevel);
   const subjectColor = subjectLevel ? subjectColors[titleCase(subject)] : customSubjectToBoldColor(titleCase(subject));

   function handleCreateQuiz () {
      router.push(`${subjectPageUrl}/start-quiz?noteId=${encodeURIComponent(note.noteid)}`)
   }
   
   function handleDeleteNote () {
      showModal({
         content: <DeleteNote
            note={note}
            onDeleted={() => router.push("/notebooks")}
         />
      })
   }

   return (
      <AppWrapper>
         <div className="box w-full h-full pd-1">
            <div className="box full pd-1 dfb align-center gap-10">
               <button 
                  className="xxxs pd-13 pdx-15 outline-black no-shadow radius-40" 
                  onClick={() => router.push(`${subjectPageUrl}/notes`)}
               >
                  <ArrowLeft size={16} />
               </button>
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

            <NoteViewer note={JSON.parse(note.noteJson)} noButtons noSubject />
            <Spacing size={4} />
         </div>
      </AppWrapper>
   )
}

function CreateQuizModal ({ note }: { note: Note }) {
   const router = useRouter();
   const { close } = useModal();
   const [numQuestions, setNumQuestions] = useState<string>('5');

   async function createQuizAI (callback: Function) {
      const data = await llmForMarkdownAndJson(buildNoteQuizPrompt({
         note: JSON.stringify(note), numberOfQuestions: parseInt(numQuestions)
      }));
      close();
      if (data == false) {
         toast.error("Failed to create quiz. Please try again later.");
         callback();
         return;
      }
      console.log(data.quiz);
      const createdTempQuizId = await createTempQuiz(JSON.parse(note.noteJson).title, note.folderCodeName, JSON.stringify(data.quiz));
      if (createdTempQuizId) {
         router.push(`/temp-quiz/${createdTempQuizId}`);
         close();
      } else {
         toast.error("Failed to create quiz. Please try again later.");
         callback();
         return;
      }
   }

   return (
      <div className="box full pd-2 pdx-2" style={{ minHeight: "70vh" }}>
         <div className="text-ml bold-600 full accent-color">Create Quiz from Note</div>
         <div className="box full pd-15 dfb column gap-5">
            <div className="text-s bold-500 full">{JSON.parse(note.noteJson).title}</div>
            <div className="text-xs full">{titleCase(note.folderCodeName)}</div>
         </div>
         <div className="box full pd-2 dfb column gap-5">
            <div className="text-s full bold-500">Number of Questions</div>
            <Select
               options={['5','10','15','20']}
               onSelect={option => setNumQuestions(option)}
               style={{ width: "100%", padding: "5px 10px" }}
            />
         </div>
         <div className="box full pd-2 dfb column gap-5">
            <AwaitButton onClick={createQuizAI} className="xxs pd-13 pdx-2">
               Create Quiz
            </AwaitButton>
         </div>
      </div>
   )
}