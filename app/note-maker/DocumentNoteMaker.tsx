'use client'
import "@/styles/note-maker.css"
import { useRef, useState } from "react"
import { toast } from "sonner";
import { extractPdfText } from "../actions/extras";
import { NotebookPen, Paperclip, X } from "lucide-react";
import { callChatGPT } from "../actions/ai";
import Spacing from "@/components/Spacing/Spacing";
import documentNoteMakerPrompt from "@/prompts/documentNoteMaker";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import NoteViewer from "@/components/NoteViewer/NoteViewer";

type FileInfo = {
   filename: string;
   fileExtension: string;
}

export default function DocumentNoteMaker () {
   const [documentContent, setDocumentContent] = useState('');
   const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
   const [noteFromAI, setNoteFromAI] = useState<NoteMaker | null>(null);
   const attachFileInputRef = useRef<HTMLInputElement | null>(null);
   const maxLength = 10000;
   
   const onFileUpload = async (e: any) => {
      const file = e.target.files[0];
      if (!file) {
         toast.error("No file found"); return;
      }

      const acceptableExtensions = ['pdf','txt'];
      const extension = file.name.split(".").pop().toLowerCase();
      if (!acceptableExtensions.includes(extension)) {
         toast.error("File must be a PDF or TXT file"); return;
      }

      if (extension === "pdf") {
         const pdf = await extractPdfText(file);
         if (pdf == false) {
            toast.error("File failed to upload");
            return;
         }
         if (pdf.length > maxLength) {
            toast.error("The file is too large");
         } else {
            setDocumentContent(pdf);
            setFileInfo({ filename: file.name.split(".")[0], fileExtension: extension.toUpperCase() });
         }
      } else {
         const fileReader = new FileReader();
         fileReader.onload = (ev) => {
            const text = ev.target?.result as string;
            if (text.length > maxLength) {
               toast.error("The file is too large");
            } else {
               setDocumentContent(text);
               setFileInfo({ filename: file.name.split(".")[0], fileExtension: extension.toUpperCase() });
            }
         }
         fileReader.readAsText(file);
      }

      if (attachFileInputRef.current) attachFileInputRef.current.value = "";
   }

   const attachNewDocument = () => {
      setDocumentContent("");
      setFileInfo(null);
   }

   const createNoteAI = async () => {
      const data: any = await callChatGPT(documentNoteMakerPrompt(documentContent));
      if (data == false) {
         toast.error("Failed to chat with AI. Please try again later.");
         return;
      }
      setNoteFromAI(data.note);
   }

   return (<>
      <Spacing size={1} />
      {(documentContent == "") ? (<>

         <div className="text-xs full text-center pd-15 mt-1 mb-1">
            Please upload a pdf or text file below.
         </div>
         <label htmlFor="attach-file" className="attach-doc">
            <input type="file" ref={attachFileInputRef} name="attach-file" id="attach-file" accept=".pdf,.txt" onChange={onFileUpload} />
            <div className="attach-btn-doc">
               <Paperclip size={18} /> Attach Document
            </div>
         </label>

      </>) : (<>

         {(noteFromAI == null) ? (<>         
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
            <AwaitButton className="xxs full pd-1 tiny-shadow" onClick={createNoteAI}>
               <NotebookPen size={17} /> Generate Note
            </AwaitButton>
         
         </>) : (<>
            <NoteViewer subject={fileInfo?.filename!} note={noteFromAI} makeNewNote={() => {
               setNoteFromAI(null);
               setDocumentContent("");
            }} />
         
         </>)}
         
      </>)}
   </>)
}
