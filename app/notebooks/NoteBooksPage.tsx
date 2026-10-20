'use client'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { formatMilliseconds } from "@/utils/date"
import { NotebookCardStyles, SubjectIconBubble } from "@/styles-extra/styles"
import { titleCase } from "@/lib/str"
import { customSubjectToPastelColor, subjectIcon, subjectPastelBgColors } from "@/utils/subjects"
import { ArrowLeft, ChevronDown, Folder, FolderPlus, GraduationCap, Trash2} from "lucide-react"
import { getUserSubjectFolders } from "../actions/folder"
import { useModal } from "@/components/Modal/ModalContext"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Card from "@/components/Card/Card"
import Spacing from "@/components/Spacing/Spacing"
import CreateFolder from "@/modal-forms/CreateFolder"
import MultiActionDropdown from "@/components/MultiActionDropdown/MultiActionDropdown"
import DeleteFolder from "@/modal-forms/DeleteFolder"

const presetSubjectFolders = ['math','english','biology','chemistry','physics','computer science','administration']

export default function NoteBooksPage ({ notes }: { notes: Note[] }) {
   const router = useRouter();
   const { showModal } = useModal()
   const { data: session } = useSession();
   const [searchNotes, setSearchNotes] = useState('');
   const [searchFolders, setSearchFolders] = useState('');
   const [actualFolders, setActualFolders] = useState<any[] | null>([]);
   const [filterSubjects, setFilterSubjects] = useState<string[]>([]);

   // view states
   const [openSubjectFolder, setOpenSubjectFolder] = useState<string | null>(null);
   const contentRef = useRef<HTMLDivElement>(null);

   async function getUserFolders () {
      const folders = await getUserSubjectFolders();
      if (folders) {
         // get only subjects that the user has made notes from
         const relevantSubjectFolders = notes.filter(n => presetSubjectFolders.includes(n.subject)).map(n => n.subject)

         setActualFolders(folders)
         setFilterSubjects([
            ...folders.map(f => f.name),
            ...[...new Set(relevantSubjectFolders)].map(f => titleCase(f))
         ])
      }
   }

   function handleOpenCreateFolder () {
      showModal({
         content: <CreateFolder onCreated={getUserFolders} />
      })
   }

   function handleDeleteFolder () {
      if (!actualFolders) return;
      if (!openSubjectFolder) return;
      showModal({
         content: <DeleteFolder 
            folderName={titleCase(openSubjectFolder)} 
            folderId={actualFolders.find(f => f.name.toLowerCase() == openSubjectFolder.toLowerCase())?.folderId}
            onDeleted={() => setOpenSubjectFolder(null)}
         />
      })
   }

   useEffect(() => {
      window.scrollTo({ top: 100 })
      getUserFolders()
   }, [])

   useEffect(() => {
      contentRef.current?.scrollTo({ top: 0, behavior: "instant" });
   }, [openSubjectFolder]);

   function applyFolderFilters () {
      return filterSubjects
         .filter(fs => fs.toLowerCase().includes(searchFolders.toLowerCase()))
         .sort((a,b) => a.localeCompare(b))
   }

   function applyNoteFilters () {
      return notes.filter(note => 
         (
            (JSON.parse(note.noteJson).title.toLowerCase().includes(searchNotes.toLowerCase()) ||
            note.subject.toLowerCase().includes(searchNotes.toLowerCase())
         ) && (
            note.folderCodeName == openSubjectFolder?.toLowerCase() || note.subject == openSubjectFolder?.toLowerCase()
         )
      ))
   }

   return (
      <AppWrapper contentRef={contentRef}>
         <div className="box full h-full pd-3">
            {openSubjectFolder !== null ? (<>
               <div className="text-xxl bold-700 full">{openSubjectFolder} Folder</div>
            </>) : (<>
               <div className="text-xxl bold-700 full">NoteBook Folders</div>
               <div className="box full pd-1">
                  <button className="xxs pd-13 pdx-2" onClick={handleOpenCreateFolder}><FolderPlus size={17} /> Create Subject Folder</button>
               </div>
            </>)}

            {(notes.length < 1) && (
               <div className="box full">
                  <Spacing size={1} />
                  <Card styles={{ width: "100%", padding: "25px" }}>
                     <div className="text-sm bold-600 full mb-05">{session?.user?.name!.split(" ")[0]}, you've not made any notes</div>
                     <div className="text-xxs full mb-15">Create your first notes, so you don't have to do it with a pen</div>
                     <button className="text-xxxs pd-1 full" onClick={() => router.push("/note-maker")}>Create a Note</button>
                  </Card>
               </div>
            )}
            
            {(notes.length > 0) && (<div className="box full" style={{ transition: "none" }}>
               {(openSubjectFolder !== null) ? (<>
                  <div className="box full pd-1 dfb align-center gap-10">
                     <button className="xxxs pd-13 pdx-15 outline-black no-shadow radius-40" onClick={() => setOpenSubjectFolder(null)}><ArrowLeft size={16} /></button>
                     <div className="box full dfb align-center justify-end">
                        <MultiActionDropdown
                           className="xxxs pd-11 pdx-2 outline-black no-shadow"
                           actions={[
                              {
                                 label: <><Trash2 size={17} /> Delete Folder</>,
                                 action: handleDeleteFolder,
                                 appearance: "delete"
                              }
                           ]}
                        >
                           More <ChevronDown size={16} />
                        </MultiActionDropdown>
                     </div>
                  </div>
                  <div className="box full pd-15">
                     <input 
                        type="text"
                        className="xxs pd-14 pdx-2 full mw-500"
                        placeholder="Search Notebooks..."
                        value={searchNotes}
                        onChange={(e) => setSearchNotes(e.target.value)}
                     />
                  </div>
                  <div className="box full dfb wrap gap-10">
                     {applyNoteFilters().length < 1 && (
                        <div className="text-s grey-5 full pd-05 pdx-1">No Notes in this folder</div>
                     )}
                     {applyNoteFilters().map((note, index) => (
                        <NoteBookItem key={index} note={note} />
                     ))}
                  </div>
               </>) : (<>
                  <div className="box full pd-15">
                     <input 
                        type="text"
                        className="xxs pd-14 pdx-2 full mw-500"
                        placeholder="Search Folders..."
                        value={searchFolders}
                        onChange={(e) => setSearchFolders(e.target.value)}
                     />
                  </div>
                  <div className="box full dfb wrap gap-10">
                     {applyFolderFilters().map((folderName, index) => (
                        <FolderItem 
                           key={index} 
                           folderName={folderName}
                           onOpenFolder={folderName => {
                              setSearchNotes("")
                              setOpenSubjectFolder(folderName)
                           }}
                        />
                     ))}
                  </div>
               </>)}
            </div>)}

            <Spacing size={5} />
         </div>
      </AppWrapper>
   )
}

function NoteBookItem ({ note }: { note: Note }) {
   const router = useRouter();

   return (<Card styles={NotebookCardStyles} onClick={() => router.push(`/notebook/${note.noteid}`)}>
      <div className="box full dfb column gap-5">
         <div style={{
            ...SubjectIconBubble,
            background: note.folderCodeName ? customSubjectToPastelColor(titleCase(note.folderCodeName)) : subjectPastelBgColors[titleCase(note.subject)] 
         }}>
            {note.folderCodeName ? <GraduationCap size={20} /> : subjectIcon[titleCase(note.subject)]}
         </div>
         <div className="text-xs bold-700 full mt-1">{JSON.parse(note.noteJson).title}</div>
         <div className="text-xxs grey-5 mt-05">
            {note.folderCodeName
               ? titleCase(note.folderCodeName.toLowerCase())
               : titleCase(note.subject)
            }
         </div>
         <div className="text-xxxs pd-05 grey-5 full">
            {formatMilliseconds(new Date(note.createdAt).getTime(), true)}
         </div>
      </div>
   </Card>)
}

function FolderItem ({ folderName, onOpenFolder }: { folderName: string, onOpenFolder: (folderName: string) => void; }) {
   return (<Card styles={NotebookCardStyles} onClick={() => onOpenFolder(folderName)}>
      <div className="box full dfb align-center gap-5">
         <div className="box full dfb column">
            <div className="text-s bold-700 full">{folderName}</div>
            <div className="text-xxs grey-4 full">Folder</div>
         </div>
         <div style={{ ...SubjectIconBubble, background: '#a6c9ff' }}>
            <Folder size={16} />
         </div>
      </div>
   </Card>)
}