'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Card from "@/components/Card/Card";
import ProgressBar from "@/components/ProgressBar/ProgressBar";
import Spacing from "@/components/Spacing/Spacing";
import BackpackBreadcrumb from "@/components/BackpackBreadcrumb/BackpackBreadcrumb";
import { pluralSuffixer, titleCase } from "@/lib/str";
import { NotebookCardStyles, SubjectIconBubble } from "@/styles-extra/styles";
import { formatMilliseconds } from "@/utils/date";
import { anySubjectDefIcon, customSubjectToPastelColor, subjectIcon, subjectPastelBgColors } from "@/utils/subjects";
import { GraduationCap, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { subjectCombinator } from "../clientHelper";

type QuizzesPageProps = {
   savedQuizzes: SavedQuiz[];
   subject: string;
   subjectLevel: string;
}

export default function QuizzesPage ({ subject, subjectLevel, savedQuizzes }: QuizzesPageProps) {
   const [searchQuizzes, setSearchQuizzes] = useState('');
   const subjectInfo = subjectCombinator(subject, subjectLevel);

   function applyFilters () {
      return savedQuizzes.filter(savedQuiz => 
         savedQuiz.subject.toLowerCase().includes(searchQuizzes.toLowerCase()) ||
         savedQuiz.subjectLevel.toLowerCase().includes(searchQuizzes.toLowerCase()) ||
         savedQuiz.topic.toLowerCase().includes(searchQuizzes.toLowerCase())
      )
   }

   return (
      <AppWrapper>
         <div className="box full">
            <BackpackBreadcrumb
               startingBackpack
               links={[
                  {
                     label: <>{subjectInfo.isDefaultSubject ? subjectIcon[subjectInfo.subject] : anySubjectDefIcon} {titleCase(subjectLevel)} {titleCase(subject)}</>,
                     link: subjectInfo.subjectPageUrl
                  }
               ]}
            />
            <div className="text-xl bold-700 full mb-1 pd-05 no-trans" style={{ color: subjectInfo.subjectColor }}>{titleCase(subjectLevel)} {titleCase(subject)} Saved Quizzes</div>

            {(savedQuizzes.length < 1) ? (
               <div className="box full">
                  <div className="text-s full pd-1 text-left">Take a quiz, save it and it will appear here.</div>
               </div>
            ) : (<>
               <div className="box full dfb pd-1">
                  <input 
                     type="text"
                     className="xxs pd-14 pdx-2 full mw-500"
                     placeholder="Search Saved Quizzes..."
                     value={searchQuizzes}
                     onChange={(e) => setSearchQuizzes(e.target.value)}
                  />
               </div>
               <div className="text-xxs grey-5 pd-05 full text-left pdx-1">
                  {applyFilters().length} {" "}
                  {pluralSuffixer('quiz', applyFilters().length, 'zes')}
               </div>
               
               <Spacing />

               <div className="box full dfb wrap gap-10">
                  {applyFilters().map((savedQuiz, index) => (
                     <QuizCardItem 
                        key={index} savedQuiz={savedQuiz} subjectPageUrl={subjectInfo.subjectPageUrl}
                        quizSubjectColor={subjectLevel ? subjectPastelBgColors[titleCase(subject)] : customSubjectToPastelColor(titleCase(subject))}
                     />
                  ))}
               </div>
            </>)}

            <Spacing size={5} />
         </div>
      </AppWrapper>
   )
}

function QuizCardItem ({ savedQuiz, subjectPageUrl, quizSubjectColor }: { savedQuiz: SavedQuiz, subjectPageUrl: string, quizSubjectColor: string }) {
   const router = useRouter();

   return (<Card styles={NotebookCardStyles} onClick={() => router.push(`${subjectPageUrl}/saved-quiz/${savedQuiz.id}`)}>
      <div className="box full dfb column gap-5">
         <div style={{ ...SubjectIconBubble, background: quizSubjectColor }}>
            {savedQuiz.subjectLevel ? subjectIcon[titleCase(savedQuiz.subject)] : <GraduationCap size={20} />}
         </div>

         <div className="text-xs bold-700 full mt-1">
            {savedQuiz.subjectLevel} {savedQuiz.subject} {savedQuiz.topic}
         </div>

         <div className="box full dfb column gap-5 pd-1">
            <div className="text-xxs bold-500">
               You scored {Math.round((savedQuiz.score/JSON.parse(savedQuiz.quizJson).length)*100)}%
            </div>
            <ProgressBar 
               percentage={(savedQuiz.score/JSON.parse(savedQuiz.quizJson).length)*100}
               color={quizSubjectColor}
            />
         </div>
         
         <div className="text-xxxs pd-05 grey-5 full">
            Saved on {formatMilliseconds(new Date(savedQuiz.createdAt).getTime(), true)}
         </div>
      </div>
   </Card>)
}