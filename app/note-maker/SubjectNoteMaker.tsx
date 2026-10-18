'use client'
import { NotebookPen } from "lucide-react";
import { retrieveSubjectTopic, subjectLevels, subjects } from "@/utils/subjects";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { callChatGPT } from "../actions/ai";
import { useModal } from "@/components/Modal/ModalContext";
import { subjectNoteMakerPrompt } from "@/prompts/subjectNoteMaker";
import { CustomSpinner } from "@/components/Spinner/Spinner";
import ModalSelect from "@/components/ModalSelect/ModalSelect";
import Spacing from "@/components/Spacing/Spacing"
import NoteViewer from "@/components/NoteViewer/NoteViewer";
import AwaitButton from "@/components/AwaitButton/AwaitButton";

export default function SubjectNoteMaker() {
   const [subjectLevel, setSubjectLevel] = useState<string>('');
   const [subject, setSubject] = useState<string>('');
   const [topic, setTopic] = useState<string>('');
   const [canGenerateNote, setCanGenerateNote] = useState<boolean>(false);
   const [noteFromAI, setNoteFromAI] = useState<any | null>(null);
   const [detailedTopic, setDetailedTopic] = useState('');

   const { showModal, close } = useModal();

   useEffect(() => {
      setCanGenerateNote((subject !== "" && subjectLevel !== "" && topic !== ""));
   }, [subject, subjectLevel, topic])

   useEffect(() => {
      setTopic('');
   }, [subject, subjectLevel])

   const createNoteAI = async () => {
      showModal({
         content: <div className="box full pd-3 pdx-3">
            <div className="text-xl bold-700 full mb-1 text-center">Note Maker</div>
            <div className="text-xxs full text-center">
               AI is currently creating a note for you about {subjectLevel} {subject} {topic}...
            </div>
            <div className="box pd-2 full dfb justify-start">
               <CustomSpinner color="#1121ff" size={40} />
            </div>
         </div>
      });
      const data: any = await callChatGPT(subjectNoteMakerPrompt({ subjectLevel, subject, subjectTopic: topic, detailedTopic  }));
      console.log(data)
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
         {/* <RenderMarkdown content={noteFromAI} /> */}
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
            <Spacing />
            <div className="text-sm bold-600 full pd-1">Detailed Topic (optional)</div>
            <div className="text-xs full grey-5 pd-05">Enter the exact thing you want to learn from this</div>
            <input 
               type="text" className="xxs pd-15 pdx-2 full"
               value={detailedTopic} onChange={e => setDetailedTopic(e.target.value)}
            />
            <Spacing size={2} />
         </>)}

         {(canGenerateNote) && <AwaitButton className="xxs full pd-15 tiny-shadow" onClick={createNoteAI}>
            <NotebookPen size={17} /> Generate Note
         </AwaitButton>}
      </>)}
   </>)
}
