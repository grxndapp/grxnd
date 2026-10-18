'use client'
import "@/styles/note-maker.css"
import { useState } from "react"
import { toast } from "sonner";
import { NotebookPen, X } from "lucide-react";
import { aiFileUpload } from "../actions/ai";
import { buildFileNotePrompt } from "@/prompts/subjectNoteMaker";
import Spacing from "@/components/Spacing/Spacing";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import NoteViewer from "@/components/NoteViewer/NoteViewer";

type FileInfo = {
   filename: string;
   fileExtension: string;
}

export default function DocumentNoteMaker () {
   const [inputFileValue, setInputFileValue] = useState<any | null>('');
   const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
   const [documentFile, setDocumentFile] = useState<File | null>(null);
   const [noteFromAI, setNoteFromAI] = useState<NoteMaker | null>(null);

   const onFileUpload = async (e: any) => {
      const file = e.target.files[0];
      if (!file) {
         toast.error("No file found"); return;
      }

      // const acceptableExtensions = ['pdf','txt', 'docx', 'pptx'];
      const acceptableExtensions = ['pdf'];
      const extension = file.name.split(".").pop().toLowerCase();
      if (!acceptableExtensions.includes(extension)) {
         // toast.error("File must be a PDF, TXT, DOCX or PPTX file"); return;
         toast.error("File must be a PDF file"); return;
      }

      setInputFileValue(e.target.value);
      setDocumentFile(file);
      setFileInfo({ filename: file.name.split(".")[0], fileExtension: extension.toUpperCase() });
   }

   const attachNewDocument = () => {
      setInputFileValue(null);
      setFileInfo(null);
   }

   const createNoteAI = async (callback: Function) => {
      if (!documentFile) {
         toast.error("Please choose a file")
         callback()
         return;
      }
      const data: any = await aiFileUpload(buildFileNotePrompt({ fileName: fileInfo?.filename }), documentFile);
      if (data == false) {
         toast.error("Failed to chat with AI. Please try again later.");
         return;
      }
      if (Object.keys(data).includes("error")) {
         toast.error(data.error);
         return;
      }
      console.log(data)
      setNoteFromAI(data.note);
      callback()
   }

   return (<>
      <Spacing size={1} />
      {noteFromAI !== null ? (<>
         <NoteViewer 
            subject={noteFromAI.subject} 
            note={noteFromAI} 
            makeNewNote={() => setNoteFromAI(null)}
         />
      </>) : (fileInfo == null) ? (<>
         <div className="box full pd-2">
            <div className="text-m bold-600 full">Upload Document</div>
            <div className="text-xxs full grey-5">Upload the document you want to learn more about</div>
            <div className="box full pd-2 dfb column gap-10">
               <label htmlFor="drag-and-drop-file-input">
                  <div className="drag-and-drop-media-upload-area">
                     <div className="text-xs fit">Drag and Drop or Click to upload media asset</div>
                  </div>
                  <input 
                     type="file" name="file" id="drag-and-drop-file-input" value={inputFileValue}
                     onChange={onFileUpload}
                     // accept=".pdf,.txt,.docx,.pptx"
                     accept=".pdf"
                  />
               </label>
            </div>
         </div>
      </>) : (<>
         <div className="text-xs full text-center pd-15 mt-1 mb-1">
            Your document has been uploaded.
         </div>
         <div className="document-upload-status">
            <div className="file-info">
               <div className="file-name">{fileInfo?.filename}</div>
               <div className="file-extension">{fileInfo?.fileExtension}</div>
            </div>
            <div className="close-btn">
               <button onClick={attachNewDocument}><X size={17} /></button>
            </div>
         </div>
         <AwaitButton className="xxs full pd-14 tiny-shadow" onClick={createNoteAI}>
            <NotebookPen size={17} /> Generate Note
         </AwaitButton>
      </>)}
   </>)
}
