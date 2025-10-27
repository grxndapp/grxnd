'use client'
import "./InfoSubjects.css"
import Spacing from "@/components/Spacing/Spacing"

export default function InfoSubjects() {
   return (
      <div className="info-subjects" style={{lineHeight:"1.8rem"}}>
         <Spacing size={4} />
         <div className="is-wrapper">
            <div className="text-xs pdx-15">
               GrxndAI is currently powerful at Mathematics, English, Physics, Biology, Chemistry, Computer Science and Administration at National 5, Higher and Advanced Higher Levels.
            </div>
         </div>
         <Spacing size={8} />
      </div>
   )
}
