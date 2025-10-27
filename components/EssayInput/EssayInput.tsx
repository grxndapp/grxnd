'use client'
import "./EssayInput.css";
import { FilePen, Paperclip } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { extractPdfText } from "@/app/actions/extras";
import Spacing from "../Spacing/Spacing";

type EssayInputProps = {
   promptAI: (question: string, essay: string) => void;
}

export default function EssayInput ({ promptAI }: EssayInputProps) {
   const [question, setQuestion] = useState('');
   const [essay, setEssay] = useState('');
   const maxlength = 10000;

   const onUploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExtension: any = file.name.split('.')[1].toLowerCase();
      if (fileExtension !== "pdf" && fileExtension !== "txt") {
         toast.error("Only PDF or TXT files are allowed!");
         return;
      }

      if (fileExtension == "txt") {
         const fileReader = new FileReader();
         fileReader.onload = (ev) => setEssay(ev.target?.result as string);
         fileReader.readAsText(file);
      } else {
         const extractedText = await extractPdfText(file);
         if (extractedText == false) {
            toast.error("Failed to read PDF file");
            return;
         }
         setEssay(extractedText);
      }
   }

   const gradeEssayBtn = () => {
      if (essay == "" || essay.trim() == "") {
         toast.error("Please enter an essay");
         return;
      }
      if (essay.length > maxlength) {
         toast.error("Essay is longer than 10000 characters");
         return;
      }
      promptAI(question, essay);
   }

   return (
      <div className="essay-input-box">
         <div className="box full pd-1">
            <textarea 
               name="essay-question" 
               id="essay-question" 
               className="xs pd-15 pdx-15 full h-10"
               placeholder="Enter Essay Question (optional)"
               onChange={(e) => setQuestion(e.target.value)}
               value={question}
            />
         </div>

         <div className="box full pd-1">
            <div className="essay-input-attach">
               <label htmlFor="essay-attach">
                  <input type="file" name="essay-attach" id="essay-attach" accept=".txt,.pdf" style={{display:"none"}} onChange={onUploadFile} />
                  <div className="mimic-btn grey tiny-shadow">
                     <Paperclip size={17} /> Attach PDF or TXT
                  </div>
               </label>
               <textarea 
                  name="essay" 
                  id="essay" 
                  className="xs pd-2 full h-50"
                  placeholder="Enter Essay"
                  onChange={(e) => setEssay(e.target.value)}
                  value={essay}
               />
            </div>
            <div className={`text-xxs grey-4 pd-1 full dfb align-center justify-end ${essay.length>maxlength && 'error-text'}`}>
               {essay.length}/{maxlength} characters
            </div>
         </div>

         <button className="xxs pd-12 full" onClick={gradeEssayBtn}>
            <FilePen size={17} /> Grade Essay
         </button>
         <Spacing size={4} />
      </div>
   )
}
