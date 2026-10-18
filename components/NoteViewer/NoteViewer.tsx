'use client'
import { titleCase } from "@/lib/str";
import { CustomIcon } from "../Icons/Icon";
import { NotebookTabs, RotateCcw } from "lucide-react";
import { addNoteToBackpack } from "@/app/actions/note";
import { toast } from "sonner";
import Spacing from "../Spacing/Spacing";
import RenderMarkdown from "../RenderMarkdown/RenderMarkdown";
import AwaitButton from "../AwaitButton/AwaitButton";

type NoteViewerProps = {
   note: NoteMaker;
   subject?: string;
   makeNewNote?: Function;
   noButtons?: boolean;
   noSubject?: boolean;
}

export default function NoteViewer ({ subject, note, makeNewNote, noButtons, noSubject }: NoteViewerProps) {
   const saveNoteBtn = async (callback: Function) => {
      const save = await addNoteToBackpack(note, subject!.toLowerCase());
      if (save == false) {
         toast.error("Failed to save to notebook");
         return;
      }
      toast.success("Saved to Notebook");
      callback();
   }

   const lineStyles: React.CSSProperties = { whiteSpace: "pre-line" }

   return (
      <div className="note note-viewer-container">
         {(!noButtons) && (<div className="box full dfb align-center gap-10">
            <AwaitButton className="xxs pd-15 full" onClick={saveNoteBtn}>
               <NotebookTabs size={17} /> Save to Notebook
            </AwaitButton>
            {(makeNewNote) && (
               <button className="xxs outline-black tiny-shadow pd-15 full" onClick={() => makeNewNote()}>
                  <RotateCcw size={17} /> Make Another Note
               </button>
            )}
         </div>)}
         <Spacing size={2} />

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
         <div className="text-xxs pd-05 line-height-17" style={lineStyles}>{note.overview}</div>
         <Spacing size={1} />

         <div className="text-sm bold-700 mt-1">Key Concepts</div>
         {note.key_concepts.map((keyConcept, index) => (
            <div className="text-xxs pd-05" style={lineStyles} key={index}>
               <RenderMarkdown content={keyConcept} />
            </div>
         ))}
         <Spacing size={1} />
         
         <div className="text-sm bold-700 mt-1">Rules</div>
         {note.rules.map((rule, index) => (
            <div className="text-xxs pd-05" style={lineStyles} key={index}>
               <RenderMarkdown content={rule} />
            </div>
         ))}
         <Spacing size={1} />
         
         <div className="text-sm bold-700 mt-1">Examples</div>
         {note.examples.map((example, index) => (
            <div className="text-xxs pd-05" style={lineStyles} key={index}>
               <RenderMarkdown content={`${example}`} />
               <Spacing size={2} />
            </div>
         ))}
         <Spacing size={1} />
         
         <div className="text-sm bold-700 mt-1">Common Mistakes</div>
         {note.common_mistakes.map((mistake, index) => (
            <div className="text-xxs pd-05" style={lineStyles} key={index}>
               <RenderMarkdown content={`${mistake}`} />
            </div>
         ))}
         <Spacing size={1} />
         
         <div className="text-sm bold-700 mt-1">Practice Questions</div>
         {note.questions.map((question, index) => (
            <div className="text-xxs pd-05" style={lineStyles} key={index}>
               <RenderMarkdown content={`${question}`} />
            </div>
         ))}
         <Spacing size={1} />
         
         <div className="text-sm bold-700 mt-1">Summary</div>
         <div className="text-xxs pd-05" style={lineStyles}>
            <RenderMarkdown content={note.summary.join("\n")} />
         </div>
         
         <Spacing size={1} />
         <Spacing size={4} />

      </div>
   )
}
