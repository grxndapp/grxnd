'use client'
import { File, LibraryBig } from "lucide-react"
import { useState } from "react"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import SwitchSlide from "@/components/SwitchSlide/SwitchSlide"
import DocumentNoteMaker from "./DocumentNoteMaker"
import SubjectNoteMaker from "./SubjectNoteMaker"
import ToolHeading from "@/components/ToolHeading/ToolHeading"


export default function NoteMakerPage () {
   const [formType, setFormType] = useState<'document' | 'subject'>('document')

   return (
      <AppWrapper>
         <div className="box full h-full">
            <ToolHeading title="AI Note Maker" description="" idClassName="note-maker" />

            <SwitchSlide 
               items={[
                  { label: <><File size={17} /> Upload</>, key: "document" },
                  { label: <><LibraryBig size={17} /> Choose Subject</>, key: "subject" },
               ]}
               onItemSelected={(key: any) => setFormType(key)}
            />

            {(formType == "document") && (<DocumentNoteMaker />)}
            {(formType == "subject") && (<SubjectNoteMaker />)}
         </div>
      </AppWrapper>
   )
}