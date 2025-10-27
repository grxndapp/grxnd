'use client'
import { NotebookPen } from "lucide-react";
import { retrieveSubjectTopic, subjectLevels, subjects } from "@/utils/subjects";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { callChatGPT } from "../actions/ai";
import { useModal } from "@/contexts/useModal";
import ModalSelect from "@/components/ModalSelect/ModalSelect";
import Spacing from "@/components/Spacing/Spacing"
import subjectNoteMakerPrompt from "@/prompts/subjectNoteMaker";
import NoteViewer from "@/components/NoteViewer/NoteViewer";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import LoadingDots from "@/components/LoadingDots/LoadingDots";

export default function SubjectNoteMaker() {
   const [subjectLevel, setSubjectLevel] = useState<string>('');
   const [subject, setSubject] = useState<string>('');
   const [topic, setTopic] = useState<string>('');
   const [canGenerateNote, setCanGenerateNote] = useState<boolean>(false);
   const [noteFromAI, setNoteFromAI] = useState<NoteMaker | null>(null);

   const { showModal, close } = useModal();

   useEffect(() => {
      setCanGenerateNote((subject !== "" && subjectLevel !== "" && topic !== ""));
   }, [subject, subjectLevel, topic])

   useEffect(() => {
      setTopic('');
   }, [subject, subjectLevel])

   const createNoteAI = async () => {
      showModal({
         children: <>
            <div className="text-xl bold-700 full mb-1 text-center">Note Maker</div>
            <div className="text-xxs full text-center">
               AI is currently creating a note for you about {subjectLevel} {subject} {topic}...
            </div>
            <div className="box pd-2 full dfb justify-center">
               <LoadingDots />
            </div>
         </>
      });
      const data: any = await callChatGPT(subjectNoteMakerPrompt(subjectLevel, subject, topic));
      close();
      if (data == false) {
         toast.error("Failed to chat with AI. Please try again later.");
         return;
      }
      setNoteFromAI(data.note);
   }

   return (<>
      <Spacing size={2} />

      {(noteFromAI !== null) && (<>
         <NoteViewer subject={subject} note={noteFromAI} makeNewNote={() => {
            setTopic('');
            setSubject('');
            setSubjectLevel('');
            setNoteFromAI(null);
         }} />
      </>)}

      {(noteFromAI == null) && (<>
         <div className="text-sm bold-600 full pd-1">Subject Level</div>
         <ModalSelect
            options={subjectLevels}
            onSelect={(option) => setSubjectLevel(option)}
            title="Choose Subject Level"
         />
         <Spacing size={1} />

         <div className="text-sm bold-600 full pd-1">Subject</div>
         <ModalSelect
            options={subjects}
            onSelect={(option) => setSubject(option)}
            title="Choose Subject"
         />
         <Spacing size={1} />

         {(subject !== "" && subjectLevel !== "") && (<>
            <div className="text-sm bold-600 full pd-1">Subject Topic</div>
            <ModalSelect
               options={retrieveSubjectTopic(subjectLevel, subject)!}
               onSelect={(option) => setTopic(option)}
               title={`Choose ${subjectLevel} ${subject} Topic`}
            />
            <Spacing size={2} />
         </>)}

         {(canGenerateNote) && <AwaitButton className="xxs full pd-12 tiny-shadow" onClick={createNoteAI}>
            <NotebookPen size={17} /> Generate Note
         </AwaitButton>}
      </>)}
   </>)
}
