'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import NoteViewer from "@/components/NoteViewer/NoteViewer"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotebookPage ({ note }: { note: Note }) {
   const router = useRouter();

   return (
      <AppWrapper>
         <div className="box w-full h-full">
            <div className="box full dfb pd-1" style={{ color: "grey" }}>
               <div className="box fit dfb align-center gap-10 cursor-pointer" onClick={() => router.push("/notebooks")}>
                  <ChevronLeft size={17} />
                  <div className="text-xxs">All Notebooks</div>
               </div>
            </div>
            <NoteViewer note={JSON.parse(note.noteJson)} noButtons noSubject />
         </div>
      </AppWrapper>
   )
}
