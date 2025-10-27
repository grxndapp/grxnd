'use client'
import { titleCase } from "@/lib/str";
import { CustomIcon } from "../Icons/Icon";
import { NotebookTabs, RotateCcw } from "lucide-react";
import { addNoteToBackpack } from "@/app/actions/note";
import { toast } from "sonner";
import Spacing from "../Spacing/Spacing";

type NoteViewerProps = {
   note: NoteMaker;
   subject?: string;
   makeNewNote?: Function;
   noButtons?: boolean;
   noSubject?: boolean;
}

export default function NoteViewer ({ subject, note, makeNewNote, noButtons, noSubject }: NoteViewerProps) {
   const saveNoteBtn = async () => {
      const save = await addNoteToBackpack(note);
      if (save == false) {
         toast.error("Failed to save to notebook");
         return;
      }
      toast.success("Saved to Notebook");
   }

   return (
      <div className="note">
         {(!noSubject) && (<>
            {(subject) && (<div className="box full dfb align-center">
               <div className="box full dfb column">
                  <div className="text-s bold-600 full">{titleCase(subject)}</div>
               </div>
               <div className="box fit h-full">
                  <CustomIcon 
                     url={`/subjectS/${subject.replaceAll(" ", "-").toLowerCase()}.png`}
                     size={40}
                  />
               </div>
            </div>)}
         </>)}

         <div className="text-xl bold-700 mb-05 full">{note.title}</div>
         <div className="text-xxs pd-05" style={{lineHeight:"1.8rem"}}>{note.overview}</div>
         <Spacing size={1} />

         <div className="text-sm bold-700 mt-1">Key Concepts</div>
         {note.key_concepts.map((keyConcept, index) => (
            <div className="text-xxs pd-05" style={{lineHeight:"1.5rem"}} key={index}>{keyConcept}</div>
         ))}
         <Spacing size={1} />
         
         <div className="text-sm bold-700 mt-1">Rules</div>
         {note.rules.map((rule, index) => (
            <div className="text-xxs pd-05" style={{lineHeight:"1.5rem"}} key={index}>- {rule}</div>
         ))}
         <Spacing size={1} />
         
         <div className="text-sm bold-700 mt-1">Examples</div>
         {note.examples.map((example, index) => (
            <div className="text-xxs pd-05" style={{lineHeight:"1.5rem"}} key={index}>- {example}</div>
         ))}
         <Spacing size={1} />
         
         <div className="text-sm bold-700 mt-1">Common Mistakes</div>
         {note.common_mistakes.map((mistake, index) => (
            <div className="text-xxs pd-05" style={{lineHeight:"1.5rem"}} key={index}>- {mistake}</div>
         ))}
         <Spacing size={1} />
         
         <div className="text-sm bold-700 mt-1">Practice Questions</div>
         {note.questions.map((question, index) => (
            <div className="text-xxs pd-05" style={{lineHeight:"1.5rem"}} key={index}>{index+1}. {question}</div>
         ))}
         <Spacing size={1} />
         
         <div className="text-sm bold-700 mt-1">Summary</div>
         <div className="text-xxs pd-05" style={{lineHeight:"1.8rem"}}>{note.summary}</div>
         
         <Spacing size={1} />
         {(!noButtons) && (<div className="box full dfb column gap-10">
            <button className="xxs pd-1 full" onClick={saveNoteBtn}>
               <NotebookTabs size={17} /> Save to Notebook
            </button>
            {(makeNewNote) && (
               <button className="xxs outline-black tiny-shadow pd-1 full" onClick={() => makeNewNote()}>
                  <RotateCcw size={17} /> Make Another Note
               </button>
            )}
         </div>)}
         <Spacing size={4} />

      </div>
   )
}
