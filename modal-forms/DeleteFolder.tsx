'use client'
import { deleteSubjectFolder } from "@/app/actions/folder";
import { useModal } from "@/components/Modal/ModalContext";
import { CircleX, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AwaitButton from "@/components/AwaitButton/AwaitButton";

export default function DeleteSubjectFolder ({ folderName, folderId, onDeleted }: { folderName: string, folderId: string, onDeleted?: () => void; }) {
   const { close } = useModal();

   async function handleDeleteFolder (callback: Function) {
      if (folderName.trim() == "") {
         toast.error("Please enter a folder name");
         callback();
         return;
      }
      const deleted = await deleteSubjectFolder(folderId);
      if (deleted) {
         toast.success("Deleted Folder");
         if (onDeleted) onDeleted();
         close();
      } else {
         toast.error("Failed to delete folder")
      }
      callback();
   }

   return (
      <div className="box full pd-2 pdx-2">
         <div className="text-xl bold-600 full accent-color">Delete Folder</div>
         <div className="text-xs pd-1 full">Are you sure you want to delete <b>{folderName}</b>?</div>
         <div className="box full dfb wrap gap-10 pd-1">
            <AwaitButton className="xxs pd-12 pdx-2 delete" onClick={handleDeleteFolder}>
               <Trash2 size={17} /> Delete
            </AwaitButton>
            <button className="xxs pd-12 pdx-2 outline-black" onClick={close}>
               <CircleX size={17} /> Cancel
            </button>
         </div>
      </div>
   )
}
