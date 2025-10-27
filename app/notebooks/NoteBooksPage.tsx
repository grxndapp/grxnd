'use client'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { CustomIcon } from "@/components/Icons/Icon"
import { useState } from "react"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Card from "@/components/Card/Card"
import Spacing from "@/components/Spacing/Spacing"
import NoteBookIcon from "@/public/notebook.png"

export default function NoteBooksPage ({ notes }: { notes: Note[] }) {
   const { data: session } = useSession();
   const router = useRouter();
   const [searchNotes, setSearchNotes] = useState('');
   
   return (
      <AppWrapper>
         <div className="box full h-full">
            <div className="text-xxl bold-700 full dfb align-center justify-center gap-7">
               Your NoteBooks
            </div>

            {(notes.length < 1) ? (<div className="box full">
               <Spacing size={1} />
               <Card styles={{ width: "100%", padding: "25px" }}>
                  <div className="text-sm bold-600 full mb-05">{session?.user?.name!.split(" ")[0]}, you've not made any notes</div>
                  <div className="text-xxs full mb-15">Create your first notes, so you don't have to do it with a pen</div>
                  <button className="text-xxxs pd-1 full" onClick={() => router.push("/note-maker")}>Create a Note</button>
               </Card>
            </div>) : (<>
               <div className="box full pd-15 mb-1">
                  <input 
                     type="text"
                     className="xxs pd-12 pdx-15 full"
                     placeholder="Search Notebooks..."
                     value={searchNotes}
                     onChange={(e) => setSearchNotes(e.target.value)}
                  />
               </div>
               {notes
               .filter(note => (JSON.parse(note.noteJson).title.toLowerCase().includes(searchNotes.toLowerCase())))
               .map((note, index) => (
                  <div key={index} className="box full">
                     <NoteBookItem note={note} />
                     <Spacing size={1} />
                  </div>
               ))}
            </>)}
         </div>
      </AppWrapper>
   )
}

function NoteBookItem ({ note }: { note: Note }) {
   const router = useRouter();

   return (<Card
      styles={{
         backgroundColor: "white",
         border: "1px solid #e9e9e9",
         padding: "25px",
         cursor: "pointer"
      }}
      onClick={() => router.push(`/notebook/${note.noteid}`)}
   >
      <div className="box full dfb align-center gap-20">
         <div className="box full dfb column" style={{ width: "100%" }}>
            <div className="text-m bold-700 full">{JSON.parse(note.noteJson).title}</div>
            <div className="text-xxs pd-05 grey-5 full">Created on {new Date(note.createdAt).toUTCString()}</div>
         </div>
         <div className="box fit">
            <CustomIcon url={NoteBookIcon.src} size={60} />
         </div>
      </div>
   </Card>)
}