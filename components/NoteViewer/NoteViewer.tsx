'use client'
import { titleCase } from "@/lib/str";
import { CustomIcon } from "../Icons/Icon";
import { Bookmark, NotebookTabs, RotateCcw } from "lucide-react";
import { addNoteToBackpack, addNoteToFolder } from "@/app/actions/note";
import { toast } from "sonner";
import Spacing from "../Spacing/Spacing";
import RenderMarkdown from "../RenderMarkdown/RenderMarkdown";
import AwaitButton from "../AwaitButton/AwaitButton";
import ModalSelect from "../ModalSelect/ModalSelect";
import { useModal } from "../Modal/ModalContext";
import { useEffect, useState } from "react";
import { getUserSubjectFolders } from "@/app/actions/folder";

type NoteViewerProps = {
   note: NoteMaker;
   subject?: string;
   makeNewNote?: Function;
   noButtons?: boolean;
   noSubject?: boolean;
   customSubject?: boolean;
}

function NoteSaver ({ note, subject }: { note: NoteMaker, subject?: string }) {
   const { close } = useModal();
   const presetSubjectFolders = ['math','english','biology','chemistry','physics','computer science','administration']
   const [allFolders, setAllFolders] = useState<string[]>([]);
   const [folderChosen, setFolderChosen] = useState<string | null>(subject ?? null);

   async function saveNoteBtn (callback: Function) {
      if (!folderChosen) {
         toast.error("Please choose a folder")
         callback();
         return;
      }
      if (presetSubjectFolders.includes(folderChosen)) {
         const save = await addNoteToBackpack(note, folderChosen.toLowerCase());
         if (save == false) {
            toast.error("Failed to save notebook");
            return;
         }
         toast.success(`Saved Notebook to ${titleCase(folderChosen)}`);
         close();
         callback();
      } else {
         const save = await addNoteToFolder(note, folderChosen.toLowerCase());
         if (save == false) {
            toast.error("Failed to save notebook");
            return;
         }
         toast.success(`Saved Notebook to ${titleCase(folderChosen)}`);
         close();
         callback();
      }
   }
   
   async function getUserFolders () {
      const folders = await getUserSubjectFolders();
      if (folders) {
         setAllFolders([ ...folders.map(f => f.name.toLowerCase()), ...presetSubjectFolders ]);
      }
   }
   
   useEffect(() => {
      window.scrollTo({ top: 100 })
      getUserFolders()
   }, [])

   return (
      <div className="box full pd-2 pdx-2">
         <div className="text-xl bold-600 full accent-color">Save This Note</div>
         <div className="box full pd-2 dfb column gap-5">
            <div className="text-s full bold-500">Subject Folder Name</div>
            <div className="text-xxs full grey-5">This is where the note will be saved</div>
            <ModalSelect
               title="Choose Folder"
               options={allFolders.map(f => titleCase(f))}
               onSelect={option => setFolderChosen(allFolders.find(f => (f == option.toLowerCase()))!.toLowerCase())}
               defaultOption={folderChosen ? allFolders.indexOf(folderChosen) : undefined}
            />
         </div>
         <AwaitButton className="xxs pd-14 pdx-2" onClick={saveNoteBtn}>
            <Bookmark size={17} /> Save Note
         </AwaitButton>
      </div>
   )
}

export default function NoteViewer ({ subject, note, makeNewNote, noButtons, noSubject, customSubject }: NoteViewerProps) {
   const { showModal } = useModal();
   const lineStyles: React.CSSProperties = { whiteSpace: "pre-line" }

   function handleSaveNoteCustomSubject () {
      showModal({
         content: <NoteSaver note={note} subject={customSubject ? '' : subject!} />
      })
   }

   return (
      <div className="note note-viewer-container">
         {(!noButtons) && (<>
            <div className="box full dfb wrap gap-10">
               <button className="xxs pd-13 full mw-300" onClick={handleSaveNoteCustomSubject}>
                  <NotebookTabs size={17} /> Save to Notebook
               </button>
               {(makeNewNote) && (
                  <button className="xxs outline-black tiny-shadow pd-13 full mw-300" onClick={() => makeNewNote()}>
                     <RotateCcw size={17} /> Make Another Note
                  </button>
               )}
            </div>
            <Spacing size={2} />
         </>)}

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
