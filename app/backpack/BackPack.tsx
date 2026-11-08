'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Spacing from "@/components/Spacing/Spacing";
import Card from "@/components/Card/Card";
import BackpackSubject from "@/components/BackpackSubject/BackpackSubject";
import { useUser } from "@/hooks/useUser";
import { titleCase } from "@/lib/str";
import { customSubjectToBoldColor, customSubjectToPastelColor, fullSubjectBreakDown, retrieveSubjectTopic, subjectColors, subjectPastelBgColors } from "@/utils/subjects";
import { NotebookPen } from "lucide-react";
import { NoteMakerBackpackCardStyles } from "@/styles-extra/styles";
import { useRouter } from "next/navigation";
import { useState } from "react";

type BackPackPageProps = {
   quizzes: QuizT[];
   notes: Note[];
}

export default function BackPackPage ({ quizzes, notes }: BackPackPageProps) {
   const { user } = useUser();
   const router = useRouter();
   const [searchQuery, setSearchQuery] = useState("");

   const subjectProgressQuizzes = quizzes.reduce((agg: any, quiz) => {
      if (quiz.topic == '') return agg;
      if (!quiz.subjectLevel) {
         const subjectKey = quiz.subject;
         if (!agg[subjectKey]) {
            agg[subjectKey] = [ { [quiz.topic]: quiz.score } ];
            return agg;
         }
         agg[subjectKey].push({ [quiz.topic]: quiz.score });
         return agg;
      }


      const subjectKey = `${quiz.subjectLevel} ${quiz.subject}`;
      if (!agg[subjectKey]) {
         agg[subjectKey] = [];

         const subjectTopics = retrieveSubjectTopic(quiz.subjectLevel, quiz.subject);
         agg[subjectKey] = subjectTopics?.map(subjectTopic => ({
            [subjectTopic]: (subjectTopic == quiz.topic && quiz.score >= 70) ? true : false
         }))

         return agg;
      }
      

      agg[subjectKey] = agg[subjectKey].map((i: any) => {
         if (Object.keys(i)[0] == quiz.topic && !i[quiz.topic] && quiz.score >= 70) {
            return {
               [quiz.topic]: ((quiz.score >= 70) ? true : false)
            }
         }
         return i;
      })

      return agg;
   }, {})

   notes.forEach(note => {
      const subjectInfo = fullSubjectBreakDown(note.folderCodeName);
      const subjectKeys = Object.keys(subjectProgressQuizzes);
      const subjectKey = titleCase(`${subjectInfo.subjectLevel} ${subjectInfo.subject}`.trim())

      if (!subjectKeys.includes(subjectKey)) {
         const subjectTopic = JSON.parse(note.noteJson).title;
         subjectProgressQuizzes[subjectKey] = [
            { [subjectTopic]: 0 }
         ];
      }
   })
   
   return (
      <AppWrapper>
         <div className="box full h-full pd-1">
            <div className="box full pd-05 dfb column">
               <div className="text-xl bold-700 full">Your Backpack</div>
               <div className="text-xxs grey-5 full">
                  {quizzes.length > 1
                     ? 'Your notes, quizzes, everything you need, right here...'
                     : `Hey ${user?.name}, you haven't learnt or tested yourself. Let's change that!`
                  }
               </div>
            </div>
            
            <div className="box full pd-1 dfb column">
               <input 
                  type="text" className="xxs pd-15 pdx-2 radius-20 full mw-600" placeholder="Search Subjects..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
               />
            </div>

            {(quizzes.length < 1) ? (
               <div className="box full dfb wrap gap-10 pd-2">
                  <Card styles={NoteMakerBackpackCardStyles} onClick={() => router.push("/note-maker")}>
                     <div className="box full mt-1 pd-05 accent-color">
                        <NotebookPen size={30} />
                     </div>
                     <div className="text-ml full bold-600 accent-color">Create a Note</div>
                     <div className="text-xxs full grey-5 mb-15">Use a pdf or any of our subject/topic database to learn something the easiest way</div>
                  </Card>
                  <Spacing size={1} />
               </div>
            ) : (<>
               <div className="box full dfb wrap justify-center pd-2" style={{ gap: "10px" }}>
                  {Object.keys(subjectProgressQuizzes)
                  .sort((a,b) => a.localeCompare(b))
                  .filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((subject, index) => {
                     const subjectFolderName = fullSubjectBreakDown(subject).subject.toLowerCase().replaceAll(" ","-");
                     const subjectLevel = fullSubjectBreakDown(subject).subjectLevel;
                     const isCustomSubject = (subjectLevel == '');
                     const subjectLevelUrlParam = subjectLevel ? `${subjectLevel.replaceAll(" ","-").toLowerCase()}` : 'none';
                     
                     const subjectLevelUrlParams = subjectLevel 
                        ? `${subjectLevel} ${subjectFolderName}`.replaceAll(" ","-").toLowerCase()
                        : subjectFolderName;
                     
                     // Progress
                     const subjectProgressBg = isCustomSubject ? customSubjectToPastelColor(subject) : subjectPastelBgColors[fullSubjectBreakDown(subject).subject];
                     const subjectProgressBoldBg = isCustomSubject ? customSubjectToBoldColor(subject) : subjectColors[fullSubjectBreakDown(subject).subject];
                     const totalTopics = isCustomSubject
                        ? subjectProgressQuizzes[subject].length
                        : retrieveSubjectTopic(fullSubjectBreakDown(subject).subjectLevel, fullSubjectBreakDown(subject).subject)?.length;
                     
                     const subjectProgressRaw = isCustomSubject
                        ? subjectProgressQuizzes[subject].map((s: any) => s[Object.keys(s)[0]]).reduce((agg: number, s: any) => agg + s, 0) / subjectProgressQuizzes[subject].length
                        : (subjectProgressQuizzes[subject].filter((i: any) => i[Object.keys(i)[0]] == true).length / totalTopics!) * 100

                     const subjectProgressRounded = subjectProgressRaw.toFixed(2);

                     return (
                        <BackpackSubject
                           key={index}
                           subject={subject}
                           subjectLevel={subjectLevel}
                           isCustomSubject={isCustomSubject}
                           subjectProgressRounded={subjectProgressRounded}
                           subjectProgressRaw={subjectProgressRaw}
                        />
                     )
                  })}
               </div>
            </>)}
            <Spacing size={4} />
         </div>
      </AppWrapper>
   )
}