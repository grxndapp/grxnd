'use client'
import { useModal } from "@/components/Modal/ModalContext";
import { CircleX, Edit } from "lucide-react";
import { toast } from "sonner";
import { renameUserNote } from "@/app/actions/note";
import { useState } from "react";
import AwaitButton from "@/components/AwaitButton/AwaitButton";

export default function RenameNote ({ note, onRenamed }: { note: Note, onRenamed?: (newName: string) => void; }) {
   const { close } = useModal();
   const [noteName, setNoteName] = useState("");

   async function handleRenameNote (callback: Function) {
      if (note.noteid.trim() == "") {
         toast.error("Invalid Note");
         callback();
         return;
      }
      if (noteName.trim() == "") {
         toast.error("Please enter a name for the note");
         callback();
         return;
      }
      const deleted = await renameUserNote(note.noteid, noteName);
      if (deleted) {
         toast.success(`Renamed ${note.noteName ?? JSON.parse(note.noteJson).title} to ${noteName}`);
         if (onRenamed) onRenamed(noteName);
         close();
      } else {
         toast.error("Failed to rename note")
      }
      callback();
   }

   return (
      <div className="box full pd-2 pdx-2">
         <div className="text-xl bold-600 full accent-color">Rename Note</div>
         <div className="text-xs pd-1 full">What name do you want to give your note <b>{JSON.parse(note.noteJson).title}</b>?</div>
         {(note.noteName) && (
            <div className="text-xs pd-1 full"><b>Current Name:</b> {note.noteName}</div>
         )}
         <div className="box full pd-15">
            <input 
               type="text" className="xxs pd-15 pdx-2 full mw-300"
               value={noteName} onChange={e => setNoteName(e.target.value)}
               placeholder="Note Name..."
            />
         </div>
         <div className="box full dfb wrap gap-10 pd-1">
            <AwaitButton className="xxs pd-12 pdx-2" onClick={handleRenameNote}>
               <Edit size={17} /> Rename
            </AwaitButton>
            <button className="xxs pd-12 pdx-2 outline-black" onClick={close}>
               <CircleX size={17} /> Cancel
            </button>
         </div>
      </div>
   )
}
