'use client'
import "./InfoSubjects.css"
import { subjectIcon, subjects } from "@/utils/subjects"
import { Ellipsis } from "lucide-react"
import Spacing from "@/components/Spacing/Spacing"

export default function InfoSubjects () {
   return (
      <div className="info-subjects" style={{lineHeight:"1.8rem"}}>
         <Spacing size={4} />
         <div className="box full dfb align-center justify-center">
            <div className="box full mw-1000 dfb column gap-10">
               <div className="text-xxl full bold-700 text-center accent-color line-height-12">
                  Grxnd has helped 50+ Students
               </div>
               <div className="text-sm full text-center pd-1">We have a wide variety of subjects and you can even add the ones you want to study yourself</div>
               <div className="box pd-2 full dfb wrap justify-center gap-10">
                  {subjects.map(subject => (
                     <div key={subject} className="subject-pill">
                        {subjectIcon[subject]} {subject}
                     </div>
                  ))}
                  <div className="subject-pill">
                     <Ellipsis /> And More
                  </div>
               </div>
            </div>
         </div>
         <Spacing size={8} />
      </div>
   )
}
