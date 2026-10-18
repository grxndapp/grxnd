'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Card from "@/components/Card/Card";
import ProgressBar from "@/components/ProgressBar/ProgressBar";
import Spacing from "@/components/Spacing/Spacing";
import { pluralSuffixer, titleCase } from "@/lib/str";
import { FilterSubjectSelectedStyles, FilterSubjectStyles, NotebookCardStyles, SubjectIconBubble } from "@/styles-extra/styles";
import { formatMilliseconds } from "@/utils/date";
import { subjectIcon, subjectPastelBgColors } from "@/utils/subjects";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type QuizzesPageProps = {
   savedQuizzes: SavedQuiz[];
}

export default function QuizzesPage ({ savedQuizzes }: QuizzesPageProps) {
   const [searchQuizzes, setSearchQuizzes] = useState('');
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
      return savedQuizzes.filter(savedQuiz => 
         (
            savedQuiz.subject.toLowerCase().includes(searchQuizzes.toLowerCase()) ||
            savedQuiz.subjectLevel.toLowerCase().includes(searchQuizzes.toLowerCase()) ||
            savedQuiz.topic.toLowerCase().includes(searchQuizzes.toLowerCase())
         ) && (
            filterSubject.length < 1 ? true : filterSubject.includes(savedQuiz.subject.toLowerCase())
         )
      )
   }

   return (
      <AppWrapper>
         <div className="box full pd-3">
            <div className="text-xxl bold-700 full">Your Saved Quizzes</div>

            {(savedQuizzes.length < 1) ? (
               <div className="box full">
                  <div className="text-s full pd-1">Take a quiz, save it and it will appear here.</div>
               </div>
            ) : (<>
               <div className="box full pd-15">
                  <input 
                     type="text"
                     className="xxs pd-14 pdx-2 full mw-500"
                     placeholder="Search Saved Quizzes..."
                     value={searchQuizzes}
                     onChange={(e) => setSearchQuizzes(e.target.value)}
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
                  {applyFilters().map((savedQuiz, index) => (
                     <QuizCardItem key={index} savedQuiz={savedQuiz} />
                  ))}
               </div>
            </>)}

            <Spacing size={5} />
         </div>
      </AppWrapper>
   )
}

function QuizCardItem ({ savedQuiz }: { savedQuiz: SavedQuiz }) {
   const router = useRouter();

   return (<Card styles={NotebookCardStyles} onClick={() => router.push(`/quizzes/${savedQuiz.id}`)}>
      <div className="box full dfb column gap-5">
         <div style={{...SubjectIconBubble, background: subjectPastelBgColors[titleCase(savedQuiz.subject)]  }}>
            {subjectIcon[titleCase(savedQuiz.subject)]}
         </div>
         <div className="text-xs bold-700 full mt-1">
            {savedQuiz.subjectLevel} {savedQuiz.subject} {savedQuiz.topic}
         </div>
         <div className="box full dfb column gap-5">
            <div className="text-xxs bold-500">
               You scored {Math.round((savedQuiz.score/JSON.parse(savedQuiz.quizJson).length)*100)}%
            </div>
            <ProgressBar percentage={(savedQuiz.score/JSON.parse(savedQuiz.quizJson).length)*100} />
         </div>
         <div className="text-xxxs pd-05 grey-5 full">
            Saved on {formatMilliseconds(new Date(savedQuiz.createdAt).getTime(), true)}
         </div>
      </div>
   </Card>)
}