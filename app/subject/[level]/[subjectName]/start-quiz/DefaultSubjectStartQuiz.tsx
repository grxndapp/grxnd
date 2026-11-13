'use client'
import { generateUsingAi } from "@/app/actions/ai";
import { useSplashScreen } from "@/components/SplashScreen/SplashScreenContext";
import { titleCase } from "@/lib/str";
import { quizMakerPrompt } from "@/prompts/quizMaker";
import { ResponseFormats } from "@/prompts/responseFormats";
import { subjectIcon } from "@/utils/subjects";
import { BookCheck, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { QuizStyle } from "@/prompts/promptExtras";
import { quizStyleIntensityOptions } from "@/utils/intensityOptions";
import { subjectCombinator } from "../clientHelper";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Spacing from "@/components/Spacing/Spacing";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import QuizViewer from "@/app/quiz-maker/QuizViewer";
import IntensityChooser from "@/components/IntensityChooser/IntensityChooser";
import BackpackBreadcrumb from "@/components/BackpackBreadcrumb/BackpackBreadcrumb";
import ModalSelect from "@/components/ModalSelect/ModalSelect";

export default function DefaultSubjectStartQuiz ({ noteSelected, subject, subjectLevel }: { subjectTopics: string[], noteSelected: Note, subject: string, subjectLevel: string }) {
   const [numQuestions, setNumQuestions] = useState<string>('5');
   const [topicSelected, setTopicSelected] = useState<string | null>(null);
   const [quizStyle, setQuizStyle] = useState<QuizStyle>("mixture");
   const [aiQuiz, setAiQuiz] = useState<Quiz | null>(null);

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
      if (!topicSelected) {
         toast.error("Please select a note");
         callback();
         return;
      }
      handleLoadingCreateQuiz();
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
                     <div className="text-xs full bold-500" style={{ color: subjectInfo.subjectColor }}>
                        {subjectInfo.subjectLevel} {subjectInfo.subject} {noteSelected ? `- ${JSON.parse(noteSelected.noteJson).title}` : ''}
                     </div>
                  </div>
                  <div className="text-xxs full">For each correct answer, you get <b className="accent-color">5</b> points</div>
                  
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

                  <Spacing />
                  <IntensityChooser
                     title="Question Style"
                     options={quizStyleIntensityOptions}
                     onChange={name => setQuizStyle(name)}
                     defaultOption={0}
                  />

                  <Spacing size={2} />
                  <div className="box full dfb column">
                     <AwaitButton className="xxs pdx-3 mw-500 pd-14 tiny-shadow radius-20 accent-hover" onClick={createQuizAI}>
                        <BookCheck size={17} /> Create Quiz
                     </AwaitButton>
                  </div>
               </div>
            </>)}

            {(aiQuiz !== null && aiQuiz !== undefined) && (<>
               <QuizViewer 
                  subject={subject}
                  subjectLevel={subjectLevel}
                  subjectTopic={topicSelected!}
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

