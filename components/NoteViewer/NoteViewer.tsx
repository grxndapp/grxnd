'use client'
import { titleCase } from "@/lib/str";
import { CustomIcon } from "../Icons/Icon";
import { Bookmark, ChevronDown, ChevronRight, Eye, EyeOff, NotebookTabs, RotateCcw, SquareArrowUpRight, SquareMousePointer } from "lucide-react";
import { addNoteToBackpack, addNoteToFolder, addNoteToNewFolder } from "@/app/actions/note";
import { toast } from "sonner";
import { useModal } from "../Modal/ModalContext";
import { useEffect, useState } from "react";
import { getUserSubjectFolders } from "@/app/actions/folder";
import { ChooseFolderSaveBtnSelectedStyles, ChooseFolderSaveBtnStyles, NoteSectionCardStyles, SavedNoteCardStyles, YoutubeSearchCardStyles } from "@/styles-extra/styles";
import { BiLogoYoutube } from "react-icons/bi";
import { fullSubjectBreakDown } from "@/utils/subjects";
import { getSubjectPageUrl } from "@/app/subject/[level]/[subjectName]/helper";
import { useRouter } from "next/navigation";
import Spacing from "../Spacing/Spacing";
import RenderMarkdown from "../RenderMarkdown/RenderMarkdown";
import AwaitButton from "../AwaitButton/AwaitButton";
import Card from "../Card/Card";

type NoteViewerProps = {
   noteName?: string;
   note: NoteMaker;
   subject?: string;
   makeNewNote?: Function;
   noButtons?: boolean;
   noSubject?: boolean;
   customSubject?: boolean;
   saveToDefaultFolder?: boolean;
   saveToSubjectFolder?: { folderName: string; };
   saveToSubjectFolderNew?: { folderName: string; }
}

function NoteSaver ({ note, subject, onSaved }: { note: NoteMaker, subject?: string, onSaved: (noteid: string) => void; }) {
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
      onSaved(save);
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

export default function NoteViewer ({ 
   subject, note, noteName, makeNewNote, noButtons, noSubject, customSubject, saveToDefaultFolder, saveToSubjectFolder, saveToSubjectFolderNew
}: NoteViewerProps) {
   const { showModal } = useModal();
   const router = useRouter();
   const lineStyles: React.CSSProperties = { whiteSpace: "pre-line" };

   const [savedNote, setSavedNote] = useState<string | undefined>(undefined);

   const [noteOpenSections, setNoteOpenSections] = useState<string[]>(['key_concepts']);
   const [showPracticeSolutions, setShowPracticeSolutions] = useState(false);

   function handleToggleNoteSection (sectionName: string) {
      setNoteOpenSections(prev => (
         prev.includes(sectionName)
            ? [ ...prev.filter(section => section !== sectionName) ]
            : [ ...prev, sectionName ]
      ))
   }

   function isSectionOpen (sectionName: string) {
      const iconProps = { color: "#000", size: 20, strokeWidth: 3 }
      return (noteOpenSections.includes(sectionName)) ? <ChevronDown {...iconProps} /> : <ChevronRight {...iconProps} />;
   }

   function getNoteUrl (subjectInfo: string) {
      if (!savedNote) return '/backpack';
      const fullBreakdown = fullSubjectBreakDown(subjectInfo);
      const subjectPageUrl = getSubjectPageUrl(fullBreakdown.subject, fullBreakdown.subjectLevel);
      return `${subjectPageUrl}/note/${savedNote}`;
   }

   function handleSaveNoteCustomSubject () {
      const fullBreakdown = fullSubjectBreakDown(subject!);
      const subjectPageUrl = getSubjectPageUrl(fullBreakdown.subject, fullBreakdown.subjectLevel);
      showModal({
         content: <NoteSaver 
            note={note} 
            subject={''}
            onSaved={(noteid) => router.push(`${subjectPageUrl}/note/${noteid}`)}
         />
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
      setSavedNote(saved);
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
      setSavedNote(saved);
      callback();
   }

   async function handleSaveDefaultSubjectNote (callback: Function) {
      if (!saveToDefaultFolder) return;
      if (!subject) return;
      const saved = await addNoteToBackpack(note, subject);
      if (saved == false) {
         toast.error("Failed to save notebook");
         callback();
         return;
      }
      toast.success("Saved Note");
      setSavedNote(saved);
      callback();
   }

   const noteSectionClassname = "text-m fit bold-700 mt-1 accent-color-gradient-dark-text cursor-pointer dfb align-center gap-5"

   return (
      <div className="note note-viewer-container">
         {(!noButtons) && (<>
            <div className="box full dfb wrap gap-10">
               {savedNote ? (<Card styles={SavedNoteCardStyles}>
                  <div className="box full dfb column gap-10">
                     <div className="text-l bold-600 full">Note Saved</div>
                     <button 
                        className="xxs pd-13 full mw-300" 
                        onClick={() => router.push(
                           getNoteUrl(saveToSubjectFolder?.folderName! || saveToSubjectFolderNew?.folderName! || subject!)!
                        )}
                     >
                        <SquareMousePointer size={17} /> Open Note
                     </button>
                  </div>
               </Card>) : (<>               
                  {saveToSubjectFolder ? (
                     <AwaitButton className="xxs pd-13 full mw-300 whitespace-nowrap" onClick={handleOverrideSaveNote}>
                        <NotebookTabs size={17} /> Save to {titleCase(saveToSubjectFolder.folderName)}
                     </AwaitButton>
                  ) : saveToSubjectFolderNew ? (
                     <AwaitButton className="xxs pd-13 full mw-300 whitespace-nowrap" onClick={handleOverrideSaveNewFolderNote}>
                        <NotebookTabs size={17} /> Save to {titleCase(saveToSubjectFolderNew.folderName)}
                     </AwaitButton>
                  ) : saveToDefaultFolder ? (
                     <AwaitButton className="xxs pd-13 full mw-300 whitespace-nowrap" onClick={handleSaveDefaultSubjectNote}>
                        <NotebookTabs size={17} /> Save to {titleCase(subject!)}
                     </AwaitButton>
                  ) : (
                     <button className="xxs pd-13 full mw-300 whitespace-nowrap" onClick={handleSaveNoteCustomSubject}>
                        <NotebookTabs size={17} /> Save to {subject}
                     </button>
                  )}
                  {(makeNewNote) && (
                     <button className="xxs outline-black tiny-shadow pd-13 full mw-300 whitespace-nowrap" onClick={() => makeNewNote()}>
                        <RotateCcw size={17} /> Make Another Note
                     </button>
                  )}
               </>)}
            </div>
            <Spacing size={2} />
         </>)}

         {(!noSubject && !customSubject) && (<>
            {(subject) && (<div className="box full dfb align-center">
               <div className="box full dfb column">
                  <div className="text-s bold-600 full">{titleCase(subject)}</div>
               </div>
               <div className="box fit h-full">
                  <CustomIcon 
                     url={`/subjects/${fullSubjectBreakDown(subject!).subject.replaceAll(" ", "-").toLowerCase()}.png`}
                     size={40}
                  />
               </div>
            </div>)}
         </>)}

         {noteName && <div className="text-m full">{noteName}</div>}
         <div className="text-xl bold-700 mb-05 full accent-color-gradient-dark-text">{note.title}</div>
         <div className="text-xxs pd-05 line-height-17" style={lineStyles}>{note.overview}</div>
         <Spacing size={1} />

         <Card styles={NoteSectionCardStyles}>
            <div className={noteSectionClassname} onClick={() => handleToggleNoteSection("key_concepts")}>
               Key Concepts {isSectionOpen("key_concepts")}
            </div>
            {noteOpenSections.includes("key_concepts") ? <>
               {note.key_concepts.map((keyConcept, index) => (
                  <div className="text-xxs pd-05" style={lineStyles} key={index}>
                     <RenderMarkdown content={`${keyConcept}`} />
                  </div>
               ))}
            </> : <br />}
         </Card>
         <Spacing size={1} />
         
         <Card styles={NoteSectionCardStyles}>
            <div className={noteSectionClassname} onClick={() => handleToggleNoteSection("rules")}>
               Rules {isSectionOpen("rules")}
            </div>
            {noteOpenSections.includes("rules") ? <>
               {note.rules.map((rule, index) => (
                  (typeof rule == "string")
                     ? (
                        <div className="text-xxs pd-05" style={lineStyles} key={index}>
                           <RenderMarkdown content={rule} />
                        </div>
                     )
                     : (
                        <div className="text-xxs pd-05 dfb column mb-15" style={lineStyles} key={index}>
                           <div className="text-xs bold-600 full"><u><RenderMarkdown content={rule.title} styles={{lineHeight:2}} /></u></div>
                           <div className="text-xxs full pdx-1"><RenderMarkdown content={rule.rule} /></div>
                           <div className="text-xxs full pdx-1">
                              <RenderMarkdown content={rule.use} />
                           </div>
                        </div>
                     )
               ))}
            </> : <br />}
         </Card>
         <Spacing size={1} />
         
         <Card styles={NoteSectionCardStyles}>
            <div className={noteSectionClassname} onClick={() => handleToggleNoteSection("examples")}>
               Examples {isSectionOpen("examples")}
            </div>
            {noteOpenSections.includes("examples") ? <>
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
                           <div className="text-xs full">
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
            </> : <br />}
         </Card>
         <Spacing size={1} />
         
         <Card styles={NoteSectionCardStyles}>
            <div className={noteSectionClassname} onClick={() => handleToggleNoteSection("common_mistakes")}>
               Common Mistakes {isSectionOpen("common_mistakes")}
            </div>
            {noteOpenSections.includes("common_mistakes") ? <>
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
            </> : <br />}
         </Card>
         <Spacing size={1} />
         
         <Card styles={NoteSectionCardStyles}>
            <div className={noteSectionClassname} onClick={() => handleToggleNoteSection("questions")}>
               Practice Questions {isSectionOpen("questions")}
            </div>
            {noteOpenSections.includes("questions") ? <>
               {note.questions.map((question, index) => (
                  (typeof question == "string")
                     ? (
                        <div className="text-xxs pd-05" style={lineStyles} key={index}>
                           <RenderMarkdown content={`${question}`} styles={{lineHeight:1.8}} />
                        </div>
                     )
                     : (
                        <div className="text-xxs pd-05 dfb column pdx-1" style={lineStyles} key={index}>
                           <div className="text-xs full">
                              {/* <div className="text-xs bold-600 full"><u>Question {index+1}</u></div> */}
                              <RenderMarkdown content={`**${index+1}** - ${question.question}`} styles={{lineHeight:2}} />
                           </div>
                        </div>
                     )
               ))}
               {(showPracticeSolutions) ? (<>
                  <br />
                  <div className="text-m fit bold-700 accent-color-gradient-dark-text">Solutions</div>
                  <div className="box full pd-1">
                     <button className="xxs pd-12 pdx-2 accent-color-50" onClick={() => setShowPracticeSolutions(false)}>
                        <EyeOff size={17} /> Hide Solutions
                     </button>
                  </div>
                  {note.questions.map((question, index) => (
                     (typeof question == "string")
                        ? (
                           <div className="text-xxs pd-05" style={lineStyles} key={index}>
                              <RenderMarkdown content={`${question}`} styles={{lineHeight:1.8}} />
                           </div>
                        )
                        : (
                           <div className="text-xxs pd-05 dfb column pdx-1" style={lineStyles} key={index}>
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
               </>) : (<>
                  <div className="box full pd-1">
                     <button className="xxs pd-12 pdx-2 accent-color-50" onClick={() => setShowPracticeSolutions(true)}>
                        <Eye size={17} /> Show Solutions
                     </button>
                  </div>
               </>)}
            </> : <br />}
         </Card>
         <Spacing size={1} />

         <Card styles={NoteSectionCardStyles}>
            <div className={noteSectionClassname} onClick={() => handleToggleNoteSection("summary")}>
               Summary {isSectionOpen("summary")}
            </div>
            {noteOpenSections.includes("summary") ? <>
               <div className="text-xxs pd-05 dfb column gap-10" style={lineStyles}>
                  {note.summary.map((summaryNote, index) => (
                     <RenderMarkdown key={index} content={summaryNote} />
                  ))}
               </div>
            </> : <br />}
         </Card>
         <Spacing size={1} />

         <Card styles={NoteSectionCardStyles}>
            <div className={noteSectionClassname} onClick={() => handleToggleNoteSection("visuals")}>
               External Sources {isSectionOpen("visuals")}
            </div>
            {noteOpenSections.includes("visuals") ? <>
               <div className="text-xxs pd-1 dfb wrap gap-10" style={lineStyles}>
                  {note.visuals.map((visual, index) => (
                     (visual.includes("youtube.com/results"))
                        ? (
                           <Card key={index} styles={YoutubeSearchCardStyles} onClick={() => window.open(visual, "_blank")}>
                              <div className="box full dfb column gap-5">
                                 <BiLogoYoutube size={25} color="red" /> 
                                 <div className="text-xs full dfb align-center gap-5 bold-600">
                                    {titleCase(new URL(visual).searchParams.get("search_query")?.replaceAll("+"," ")!)}
                                 </div>
                                 <div className="text-xxs dfb align-center gap-5 grey-5 full visible-link cursor-pointer">
                                    Click to view <SquareArrowUpRight size={17} />
                                 </div>
                              </div>
                           </Card>
                        )
                        : (
                           <div key={index} className="text-xs bold-500 visible-link cursor-pointer">{visual}</div>
                        )
                  ))}
               </div>
            </> : <br />}
         </Card>

         <Spacing size={2} />
      </div>
   )
}
