'use client'
import { createSubjectFolder, getUserSubjectFolders } from "@/app/actions/folder";
import { useModal } from "@/components/Modal/ModalContext";
import { FolderPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AwaitButton from "@/components/AwaitButton/AwaitButton";

export default function CreateSubjectFolder ({ onCreated }: { onCreated?: () => void; }) {
   const { close } = useModal();
   const [folderName, setFolderName] = useState("");

   async function handleCreateFolder (callback: Function) {
      if (folderName.trim() == "") {
         toast.error("Please enter a folder name");
         callback();
         return;
      }
      const folders = await getUserSubjectFolders();
      if (folders) {
         if (folders.find(f => f.name == folderName)) {
            toast.error(`You already have a folder named ${folderName}`)
         }
      }
      const created = await createSubjectFolder(folderName);
      if (created) {
         toast.success("Created Folder");
         if (onCreated) onCreated();
         close();
      } else {
         toast.error("Failed to create folder")
      }
      callback();
   }

   return (
      <div className="box full pd-2 pdx-2">
         <div className="text-xl bold-600 full accent-color">Create Subject Folder</div>
         <div className="box full pd-2 dfb column gap-5">
            <div className="text-s full bold-500">Subject Folder Name</div>
            <input 
               type="text" className="xxs full pd-13 pdx-2 mw-400"
               value={folderName} onChange={e => setFolderName(e.target.value)}
            />
         </div>
         <AwaitButton className="xxs pd-14 pdx-2" onClick={handleCreateFolder}>
            <FolderPlus size={17} /> Create
         </AwaitButton>
      </div>
   )
}
