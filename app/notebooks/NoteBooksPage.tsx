'use client'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { formatMilliseconds } from "@/utils/date"
import { FilterSubjectSelectedStyles, FilterSubjectStyles, NotebookCardStyles, SubjectIconBubble } from "@/styles-extra/styles"
import { pluralSuffixer, titleCase } from "@/lib/str"
import { subjectIcon, subjectPastelBgColors } from "@/utils/subjects"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Card from "@/components/Card/Card"
import Spacing from "@/components/Spacing/Spacing"
import { X } from "lucide-react"

export default function NoteBooksPage ({ notes }: { notes: Note[] }) {
   const router = useRouter();
   const { data: session } = useSession();
   const [searchNotes, setSearchNotes] = useState('');
   const [filterSubject, setFilterSubject] = useState<string[]>([]);
   const filterSubjects = ['math','english','biology','chemistry','physics','computer science','administration']
   
   function toggleSubjectFilter (subject: string) {
      if (filterSubject.includes(subject)) {
         setFilterSubject(p => ([ ...p.filter(s => s !== subject) ]))
      } else {
         setFilterSubject(p => ([ ...p, subject ]))
      }
   }

   function applyFilters () {
      return notes.filter(note => 
         (
            (JSON.parse(note.noteJson).title.toLowerCase().includes(searchNotes.toLowerCase()) ||
            note.subject.toLowerCase().includes(searchNotes.toLowerCase())
         ) && (
            filterSubject.length < 1 ? true : filterSubject.includes(note.subject.toLowerCase())
         )
      ))
   }

   return (
      <AppWrapper>
         <div className="box full h-full pd-3">
            <div className="text-xxl bold-700 full">Your NoteBooks</div>

            {(notes.length < 1) ? (
               <div className="box full">
                  <Spacing size={1} />
                  <Card styles={{ width: "100%", padding: "25px" }}>
                     <div className="text-sm bold-600 full mb-05">{session?.user?.name!.split(" ")[0]}, you've not made any notes</div>
                     <div className="text-xxs full mb-15">Create your first notes, so you don't have to do it with a pen</div>
                     <button className="text-xxxs pd-1 full" onClick={() => router.push("/note-maker")}>Create a Note</button>
                  </Card>
               </div>
            ) : (<>
               <div className="box full pd-15">
                  <input 
                     type="text"
                     className="xxs pd-14 pdx-2 full mw-500"
                     placeholder="Search Notebooks..."
                     value={searchNotes}
                     onChange={(e) => setSearchNotes(e.target.value)}
                  />
               </div>
               <div className="box full dfb wrap gap-10 mb-1">
                  {filterSubjects.map(subject => (
                     <div 
                        key={subject} 
                        style={filterSubject.includes(subject) ? FilterSubjectSelectedStyles : FilterSubjectStyles}
                        onClick={() => toggleSubjectFilter(subject)}
                     >
                        {titleCase(subject)} {(filterSubject.includes(subject)) && <X size={16} />}
                     </div>
                  ))}
               </div>
               <div className="text-s grey-5 pd-1 full pdx-1">
                  {applyFilters().length} {" "}
                  {pluralSuffixer('notebook', applyFilters().length, 's')}
               </div>
               
               <Spacing />

               <div className="box full dfb wrap gap-10">
                  {applyFilters().map((note, index) => (
                     <NoteBookItem key={index} note={note} />
                  ))}
               </div>
            </>)}

            <Spacing size={5} />
         </div>
      </AppWrapper>
   )
}

function NoteBookItem ({ note }: { note: Note }) {
   const router = useRouter();

   return (<Card styles={NotebookCardStyles} onClick={() => router.push(`/notebook/${note.noteid}`)}>
      <div className="box full dfb column gap-5">
         <div style={{...SubjectIconBubble, background: subjectPastelBgColors[titleCase(note.subject)]  }}>
            {subjectIcon[titleCase(note.subject)]}
         </div>
         <div className="text-xs bold-700 full mt-1">{JSON.parse(note.noteJson).title}</div>
         <div className="text-xxs grey-5 mt-05">{titleCase(note.subject)}</div>
         <div className="text-xxxs pd-05 grey-5 full">
            {formatMilliseconds(new Date(note.createdAt).getTime(), true)}
         </div>
      </div>
   </Card>)
}