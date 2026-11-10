'use client'
import { useModal } from "@/components/Modal/ModalContext";
import { CircleX, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteSubjectNote, deleteSubjectNotes } from "@/app/actions/note";
import AwaitButton from "@/components/AwaitButton/AwaitButton";

export default function DeleteNote ({ note, onDeleted }: { note: Note, onDeleted?: () => void; }) {
   const { close } = useModal();

   async function handleDeleteNote (callback: Function) {
      if (note.noteid.trim() == "") {
         toast.error("Invalid Note");
         callback();
         return;
      }
      const deleted = await deleteSubjectNote(note.noteid);
      if (deleted) {
         toast.success("Deleted Notebook");
         if (onDeleted) onDeleted();
         close();
      } else {
         toast.error("Failed to delete notebook")
      }
      callback();
   }

   return (
      <div className="box full pd-2 pdx-2">
         <div className="text-xl bold-600 full accent-color">Delete Note</div>
         <div className="text-xs pd-1 full">Are you sure you want to delete <b>{JSON.parse(note.noteJson).title}</b>?</div>
         <div className="box full dfb wrap gap-10 pd-1">
            <AwaitButton className="xxs pd-12 pdx-2 delete" onClick={handleDeleteNote}>
               <Trash2 size={17} /> Delete
            </AwaitButton>
            <button className="xxs pd-12 pdx-2 outline-black" onClick={close}>
               <CircleX size={17} /> Cancel
            </button>
         </div>
      </div>
   )
}


export function DeleteNotes ({ notes, onDeleted }: { notes: Note[], onDeleted?: () => void; }) {
   const { close } = useModal();

   async function handleDeleteNotes (callback: Function) {
      if (notes.length == 0) {
         toast.error("Invalid Notes");
         callback();
         return;
      }
      if (notes.filter(n => n.noteid.trim() == "").length > 0) {
         toast.error("Invalid Notes");
         callback();
         return;
      }
      const deleted = await deleteSubjectNotes(notes.map(n => n.noteid));
      if (deleted) {
         toast.success(`Deleted ${notes.length} Notebooks`);
         if (onDeleted) onDeleted();
         close();
      } else {
         toast.error("Failed to delete notebooks")
      }
      callback();
   }

   return (
      <div className="box full pd-2 pdx-2">
         <div className="text-xl bold-600 full accent-color">Delete Note</div>
         <div className="text-xs pd-1 full">Are you sure you want to delete all these notes ?</div>
         <div className="box full pd-1">
            {notes.map(note => (
               <div key={note.id} className="text-s bold-600 full">{note.noteName ?? JSON.parse(note.noteJson).title}</div>
            ))}
         </div>
         <div className="box full dfb wrap gap-10 pd-1">
            <AwaitButton className="xxs pd-12 pdx-2 delete" onClick={handleDeleteNotes}>
               <Trash2 size={17} /> Delete All
            </AwaitButton>
            <button className="xxs pd-12 pdx-2 outline-black" onClick={close}>
               <CircleX size={17} /> Cancel
            </button>
         </div>
      </div>
   )
}
