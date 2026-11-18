'use client'
import { generateUsingAi } from "@/app/actions/ai";
import { useSplashScreen } from "@/components/SplashScreen/SplashScreenContext";
import { titleCase } from "@/lib/str";
import { buildNoteQuizPrompt, quizMakerPrompt } from "@/prompts/quizMaker";
import { ResponseFormats } from "@/prompts/responseFormats";
import { subjectIcon } from "@/utils/subjects";
import { BookCheck, RotateCcw, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { QuizStyle } from "@/prompts/promptExtras";
import { quizStyleIntensityOptions } from "@/utils/intensityOptions";
import { subjectCombinator } from "../clientHelper";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Spacing from "@/components/Spacing/Spacing";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import QuizViewer from "@/app/quiz-maker/QuizViewer";
import BackpackBreadcrumb from "@/components/BackpackBreadcrumb/BackpackBreadcrumb";
import ModalSelect, { ModalCustomSelect } from "@/components/ModalSelect/ModalSelect";

export default function DefaultSubjectStartQuiz ({ noteSelected, subject, subjectLevel }: { subjectTopics: string[], noteSelected: Note, subject: string, subjectLevel: string }) {
   const [numQuestions, setNumQuestions] = useState<string>('5');
   const [topicSelected, setTopicSelected] = useState<string | null>(null);
   const [quizStyle, setQuizStyle] = useState<QuizStyle>("mixture");
   const [aiQuiz, setAiQuiz] = useState<Quiz | null>(null);

   const [showMoreSettings, setShowMoreSettings] = useState(false);

   const subjectInfo = subjectCombinator(subject, subjectLevel);
   const { openSplash, closeSplash } = useSplashScreen();

   function handleLoadingCreateQuiz () {
      openSplash({
         title: <>Creating Quiz</>,
         description: <>Creating your <b>{titleCase(subjectLevel)} {titleCase(subject)} {topicSelected!}</b> quiz...</>,
         style: subject.toLowerCase().trim(),
         actions: []
      })
   }

   const createQuizAI = async (callback: Function) => {
      if (noteSelected) {
         // USE ALREADY SELECTED NOTE
         if (!noteSelected) {
            toast.error("Please select a note");
            callback();
            return;
         }
         handleLoadingCreateQuiz();
         try {
            const data = await generateUsingAi({
               prompt: buildNoteQuizPrompt({
                  note: noteSelected.noteJson, numberOfQuestions: parseInt(numQuestions), style: quizStyle
               }),
               responseFormat: ResponseFormats.QuizMaker
            });
      
            if (data.success == false) {
               openSplash({
                  title: "Error",
                  description: data.error,
                  style: "error",
                  actions: [
                     {
                        appearance: "normal",
                        action: () => createQuizAI(()=>{}),
                        label: <><RotateCcw size={18} /> Try Again</>
                     }
                  ],
               })
               callback();
               return;
            }
            console.log(data.data.quiz);
            setAiQuiz(data.data.quiz || null);
            closeSplash();
         } catch (err) {
            openSplash({
               title: "Error",
               description: "Failed to create you a quiz",
               style: "error",
               actions: [
                  {
                     appearance: "normal",
                     action: () => createQuizAI(()=>{}),
                     label: <><RotateCcw size={18} /> Try Again</>
                  }
               ],
            })
         }
      } else {
         // USE TOPIC INSTEAD OF NOTE
         if (!topicSelected) {
            toast.error("Please select a topic");
            callback();
            return;
         }
         handleLoadingCreateQuiz();
         try {
            const data = await generateUsingAi({
               prompt: quizMakerPrompt({ 
                  subjectLevel, subject, subjectTopic: topicSelected,
                  numberOfQuestions: parseInt(numQuestions), style: quizStyle
               }),
               responseFormat: ResponseFormats.QuizMaker
            });
      
            if (data.success == false) {
               openSplash({
                  title: "Error",
                  description: data.error,
                  style: "error",
                  actions: [
                     {
                        appearance: "normal",
                        action: () => createQuizAI(()=>{}),
                        label: <><RotateCcw size={18} /> Try Again</>
                     }
                  ],
               })
               callback();
               return;
            }
            console.log(data.data.quiz);
            setAiQuiz(data.data.quiz || null);
            closeSplash();
         } catch (err) {
            openSplash({
               title: "Error",
               description: "Failed to create you a quiz",
               style: "error",
               actions: [
                  {
                     appearance: "normal",
                     action: () => createQuizAI(()=>{}),
                     label: <><RotateCcw size={18} /> Try Again</>
                  }
               ],
            })
         }
      }
   }
   
   return (
      <AppWrapper>
         <div className="box full">
            <BackpackBreadcrumb
               startingBackpack
               links={[
                  {
                     label: <>{subjectIcon[subjectInfo.subject]} {titleCase(subjectLevel)} {titleCase(subject)}</>,
                     link: subjectInfo.subjectPageUrl
                  }
               ]}
            />

            {(aiQuiz == null) && (<>
               <div className="box full h-full dfb column align-center">
                  <div className="box full">
                     <div className="text-xl full bold-700 accent-color-gradient-dark-text">Start Quiz</div>
                     <div className="text-sm full bold-500 pd-05" style={{ color: subjectInfo.subjectColor }}>
                        {subjectInfo.subjectLevel} {subjectInfo.subject} {noteSelected ? `- ${JSON.parse(noteSelected.noteJson).title}` : ''}
                     </div>
                  </div>
                  <div className="text-xxs full">For each correct answer, you get <b className="accent-color">5</b> points</div>
                  
                  {!noteSelected && (<>
                     <Spacing />
                     <div className="box full dfb column gap-10 pd-1">
                        <div className="text-sm full bold-700 accent-color-gradient-text">Choose Topic</div>
                        <ModalSelect
                           title="Choose Topic"
                           options={subjectInfo.subjectTopics}
                           onSelect={option => setTopicSelected(option)}
                        />
                     </div>
                  </>)}

                  {(showMoreSettings) ? (<>
                     <Spacing />
                     <div className="box full dfb column gap-10 pd-1">
                        <div className="text-sm full bold-700 accent-color-gradient-text">Number of Questions</div>
                        <div className="text-xxs full grey-5">Default number of questions is 5</div>
                        <ModalSelect
                           title="Choose Number of Questions"
                           options={["5","10"]}
                           onSelect={option => setNumQuestions(option)}
                           defaultOption={0}
                        />
                     </div>

                     <Spacing />
                     <div className="box full dfb column gap-10 pd-1">
                        <div className="text-sm full bold-700 accent-color-gradient-text">Choose Question Style</div>
                        <ModalCustomSelect
                           title="Choose Question Style"
                           options={quizStyleIntensityOptions.map(qs => ({ option: qs.nameLabel, optionName: qs.name }) )}
                           onSelect={option => setQuizStyle(option.optionName as any)}
                           defaultOption={0}
                        />
                     </div>
                     <div className="box full pd-15">
                        <div className="text-xs fit visible-link accent-color dfb align-center gap-5" onClick={() => setShowMoreSettings(false)}>
                           <Settings size={17} /> Hide Quiz Settings
                        </div>
                     </div>
                  </>) : (<>
                     <div className="box full pd-15">
                        <div className="text-xs fit visible-link accent-color dfb align-center gap-5" onClick={() => setShowMoreSettings(true)}>
                           <Settings size={17} /> Show Quiz Settings
                        </div>
                     </div>
                  </>)}

                  <Spacing />
                  <div className="box full dfb column">
                     <AwaitButton className="s pdx-3 full mw-500 pd-14 tiny-shadow radius-20 accent-hover" onClick={createQuizAI}>
                        <div className="box full dfb column align-center">
                           <span className="text-xs full bold-600 dfb justify-center align-center gap-5"><BookCheck size={17} /> Create Quiz</span>
                           <div className="text-t full bold-500" style={{ opacity: 0.8 }}>Time to challenge yourself</div>
                        </div>
                     </AwaitButton>
                  </div>
               </div>
            </>)}

            {(aiQuiz !== null && aiQuiz !== undefined) && (<>
               <QuizViewer 
                  subject={subject}
                  subjectLevel={subjectLevel}
                  subjectTopic={noteSelected ? JSON.parse(noteSelected.noteJson).title : topicSelected! ?? ''}
                  quiz={aiQuiz}
                  makeNewQuiz={() => {
                     setTopicSelected('');
                     setAiQuiz(null);
                  }}
               />
            </>)}
         </div>
      </AppWrapper>
   )
}

