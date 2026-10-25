'use client'
import { titleCase } from "@/lib/str";
import { CustomIcon } from "../Icons/Icon";
import { Bookmark, NotebookTabs, RotateCcw } from "lucide-react";
import { addNoteToFolder, addNoteToNewFolder } from "@/app/actions/note";
import { toast } from "sonner";
import { useModal } from "../Modal/ModalContext";
import { useEffect, useState } from "react";
import { getUserSubjectFolders } from "@/app/actions/folder";
import { ChooseFolderSaveBtnSelectedStyles, ChooseFolderSaveBtnStyles, YoutubeSearchCardStyles } from "@/styles-extra/styles";
import { BiLogoYoutube } from "react-icons/bi";
import Spacing from "../Spacing/Spacing";
import RenderMarkdown from "../RenderMarkdown/RenderMarkdown";
import AwaitButton from "../AwaitButton/AwaitButton";
import Card from "../Card/Card";

type NoteViewerProps = {
   note: NoteMaker;
   subject?: string;
   makeNewNote?: Function;
   noButtons?: boolean;
   noSubject?: boolean;
   customSubject?: boolean;
   saveToSubjectFolder?: { folderName: string; };
   saveToSubjectFolderNew?: { folderName: string; }
}

function NoteSaver ({ note, subject }: { note: NoteMaker, subject?: string }) {
   const { close } = useModal();
   const [searchFolders, setSearchFolders] = useState("");
   const [allFolders, setAllFolders] = useState<string[]>([]);
   const [folderChosen, setFolderChosen] = useState<string | null>(subject ?? null);

   async function saveNoteBtn (callback: Function) {
      if (!folderChosen) {
         toast.error("Please choose a folder")
         callback();
         return;
      }
      const save = await addNoteToFolder(note, folderChosen.toLowerCase());
      if (save == false) {
         toast.error("Failed to save notebook");
         return;
      }
      toast.success(`Saved Notebook to ${titleCase(folderChosen)}`);
      close();
      callback();
   }
   
   async function getUserFolders () {
      const folders = await getUserSubjectFolders();
      if (folders) {
         setAllFolders([ ...folders.map(f => f.name.toLowerCase()) ]);
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
            <div className="box full pd-05">
               <input 
                  type="text" className="xxs pd-14 pdx-2 full"
                  value={searchFolders} onChange={e => setSearchFolders(e.target.value)}
                  placeholder="Search Folders"
               />
            </div>
            <div className="box full pd-1 dfb column gap-10" style={{ height: "35vh", overflowY: "scroll", overflowX: "hidden" }}>
               {
                  allFolders
                     .filter(f => f.toLowerCase().includes(searchFolders.toLowerCase()))   
                     .map(f => titleCase(f)).map((folder, index) => (
                        <div 
                           key={index} 
                           style={folder.toLowerCase() == folderChosen ? ChooseFolderSaveBtnSelectedStyles : ChooseFolderSaveBtnStyles}
                           onClick={() => setFolderChosen(folder.toLowerCase())}
                        >
                           {folder}
                        </div>
                     ))
               }
            </div>
         </div>
         <AwaitButton className="xxs pd-14 pdx-2" onClick={saveNoteBtn}>
            <Bookmark size={17} /> Save Note
         </AwaitButton>
      </div>
   )
}

export default function NoteViewer ({ subject, note, makeNewNote, noButtons, noSubject, customSubject, saveToSubjectFolder, saveToSubjectFolderNew }: NoteViewerProps) {
   const { showModal } = useModal();
   const lineStyles: React.CSSProperties = { whiteSpace: "pre-line" }

   function handleSaveNoteCustomSubject () {
      showModal({
         content: <NoteSaver note={note} subject={customSubject ? '' : subject!} />
      })
   }

   async function handleOverrideSaveNote (callback: Function) {
      if (!saveToSubjectFolder) return;
      const saved = await addNoteToFolder(note, saveToSubjectFolder.folderName.toLowerCase());
      if (saved == false) {
         toast.error("Failed to save notebook");
         callback();
         return;
      }
      toast.success("Saved Note");
      callback();
   }

   async function handleOverrideSaveNewFolderNote (callback: Function) {
      if (!saveToSubjectFolderNew) return;
      const saved = await addNoteToNewFolder(note, saveToSubjectFolderNew.folderName.toLowerCase());
      if (saved == false) {
         toast.error("Failed to save notebook");
         callback();
         return;
      }
      toast.success("Saved Note");
      callback();
   }

   return (
      <div className="note note-viewer-container">
         {(!noButtons) && (<>
            <div className="box full dfb wrap gap-10">
               {saveToSubjectFolder ? (
                  <AwaitButton className="xxs pd-13 full mw-300" onClick={handleOverrideSaveNote}>
                     <NotebookTabs size={17} /> Save to Notebook
                  </AwaitButton>
               ) : saveToSubjectFolderNew ? (
                  <AwaitButton className="xxs pd-13 full mw-300" onClick={handleOverrideSaveNewFolderNote}>
                     <NotebookTabs size={17} /> Save to Notebook
                  </AwaitButton>
               ) : (
                  <button className="xxs pd-13 full mw-300" onClick={handleSaveNoteCustomSubject}>
                     <NotebookTabs size={17} /> Save to Notebook
                  </button>
               )}
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
                     url={`/subjects/${subject.replaceAll(" ", "-").toLowerCase()}.png`}
                     size={40}
                  />
               </div>
            </div>)}
         </>)}

         <div className="text-xl bold-700 mb-05 full">{note.title}</div>
         <div className="text-xxs pd-05 line-height-17" style={lineStyles}>{note.overview}</div>
         <Spacing size={1} />

         <div className="text-m bold-700 mt-1">Key Concepts</div>
         {note.key_concepts.map((keyConcept, index) => (
            <div className="text-xxs pd-05" style={lineStyles} key={index}>
               <RenderMarkdown content={`${keyConcept}`} />
            </div>
         ))}
         <Spacing size={1} />
         
         <div className="text-m bold-700 mt-1">Rules</div>
         {note.rules.map((rule, index) => (
            (typeof rule == "string")
               ? (
                  <div className="text-xxs pd-05" style={lineStyles} key={index}>
                     <RenderMarkdown content={rule} />
                  </div>
               )
               : (
                  <div className="text-xxs pd-05 dfb column mb-15" style={lineStyles} key={index}>
                     <div className="text-xs bold-500 full"><u><RenderMarkdown content={rule.title} styles={{lineHeight:2}} /></u></div>
                     <div className="text-xxs full pdx-1"><RenderMarkdown content={rule.rule} /></div>
                     <div className="text-xxs full pdx-1">
                        <RenderMarkdown content={rule.use} />
                     </div>
                  </div>
               )
         ))}
         <Spacing size={1} />
         
         <div className="text-m bold-700 mt-1">Examples</div>
         {note.examples.map((example, index) => (
            (typeof example == "string")
               ? (
                  <div className="text-xxs pd-05" style={lineStyles} key={index}>
                     <RenderMarkdown content={`${example}`} />
                     <Spacing size={2} />
                  </div>
               )
               : (
                  <div className="text-xxs pd-05 dfb column mb-15 pdx-1" style={lineStyles} key={index}>
                     <div className="text-xs bold-500 full">
                        <div className="text-xs bold-600 full"><u>Example {index+1}</u></div>
                        <RenderMarkdown content={example.question} styles={{lineHeight:2}} />
                     </div>
                     {example.solution && (
                        (typeof example.solution == "string")
                        ? (
                           <div className="text-xxs full">
                              <div className="text-xs bold-600 full"><u>Solution {index+1}</u></div>
                              <div className="text-xxs full">
                                 <RenderMarkdown content={example.solution} />
                              </div>
                           </div>
                        )
                        : (
                           <div className="text-xxs full">
                              <div className="text-xs bold-600 full"><u>Solution {index+1}</u></div>
                              <div className="box full dfb column">
                                 {example.solution.map((solution, index) => (
                                    <div key={index} className="text-xxs full pd-05">
                                       <RenderMarkdown content={`${solution}`} />
                                    </div>
                                 ))}
                              </div>
                           </div>
                        )
                     )}
                  </div>
               )
         ))}
         <Spacing size={1} />
         
         <div className="text-m bold-700 mt-1">Common Mistakes</div>
         {note.common_mistakes.map((mistake, index) => (
            (typeof mistake == "string")
               ? (
               <div className="text-xxs pd-05" style={lineStyles} key={index}>
                  <RenderMarkdown content={`${mistake}`} />
               </div>
               )
               : (
                  <div className="text-xxs pd-05 dfb column gap-10 mb-15 pdx-1" style={lineStyles} key={index}>
                     <div className="text-xxs full">
                        <div className="text-xxs bold-600 full"><u>Mistake</u></div>
                        <RenderMarkdown content={mistake.mistake} styles={{lineHeight:1.5}} />
                     </div>
                     <div className="text-xxs full">
                        <div className="text-xxs bold-600 full"><u>How to Fix</u></div>
                        <RenderMarkdown content={mistake.fix} />
                     </div>
                  </div>
               )
         ))}
         <Spacing size={1} />
         
         <div className="text-m bold-700 mt-1">Practice Questions</div>
         {note.questions.map((question, index) => (
            (typeof question == "string")
               ? (
                  <div className="text-xxs pd-05" style={lineStyles} key={index}>
                     <RenderMarkdown content={`${question}`} styles={{lineHeight:1.8}} />
                  </div>
               )
               : (
                  <div className="text-xxs pd-05 dfb column mb-15 pdx-1" style={lineStyles} key={index}>
                     <div className="text-xs bold-500 full">
                        <div className="text-xs bold-600 full"><u>Question {index+1}</u></div>
                        <RenderMarkdown content={question.question} styles={{lineHeight:2}} />
                     </div>
                     {question.solution && (
                        (typeof question.solution == "string")
                        ? (
                           <div className="text-xxs full">
                              <div className="text-xs bold-600 full"><u>Solution {index+1}</u></div>
                              <RenderMarkdown content={question.solution} />
                           </div>
                        )
                        : (
                           <div className="text-xxs full">
                              <div className="text-xs bold-600 full"><u>Solution {index+1}</u></div>
                              {question.solution.map((solution, index) => (
                                 <RenderMarkdown key={index} content={solution} />
                              ))}
                           </div>
                        )
                     )}
                  </div>
               )
         ))}
         <Spacing size={1} />

         <div className="text-m bold-700 mt-1">Summary</div>
         <div className="text-xxs pd-05 dfb column gap-10" style={lineStyles}>
            {note.summary.map((summaryNote, index) => (
               <RenderMarkdown key={index} content={summaryNote} />
            ))}
         </div>
         <Spacing size={1} />

         <div className="text-m bold-700 mt-1">External Sources</div>
         <div className="text-xxs pd-1 dfb wrap gap-10" style={lineStyles}>
            {note.visuals.map((visual, index) => (
               (visual.includes("youtube.com/results"))
                  ? (
                     <Card key={index} styles={YoutubeSearchCardStyles} onClick={() => window.open(visual, "_blank")}>
                        <div className="box full dfb column gap-5">
                           <div className="box text-xs full dfb align-center gap-5 bold-600">
                              <BiLogoYoutube size={25} color="red" /> {titleCase(new URL(visual).searchParams.get("search_query")?.replaceAll("+"," ")!)}
                           </div>
                           <div className="text-xxxs grey-5 visible-link cursor-pointer">{visual}</div>
                        </div>
                     </Card>
                  )
                  : (
                     <div key={index} className="text-xs bold-500 visible-link cursor-pointer">{visual}</div>
                  )
            ))}
         </div>

         <Spacing size={2} />
      </div>
   )
}
