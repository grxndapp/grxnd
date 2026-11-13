'use client'
import { useModal } from "@/components/Modal/ModalContext";
import { retrieveSubjectTopic, subjectLevels, subjects } from "@/utils/subjects";
import { ArrowLeft, ArrowRight, BookCheck, RotateCcw } from "lucide-react";
import { useState } from "react";
import { generateUsingAi } from "../actions/ai";
import { quizMakerPrompt } from "@/prompts/quizMaker";
import { ResponseFormats } from "@/prompts/responseFormats";
import { useSplashScreen } from "@/components/SplashScreen/SplashScreenContext";
import { QuizStyle } from "@/prompts/promptExtras";
import { quizStyleIntensityOptions } from "@/utils/intensityOptions";
import { ModalCustomSelect } from "@/components/ModalSelect/ModalSelect";
import { toast } from "sonner";
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import Spacing from "@/components/Spacing/Spacing"
import QuizViewer from "./QuizViewer";
import IntensityChooser from "@/components/IntensityChooser/IntensityChooser";
import BackpackBreadcrumb from "@/components/BackpackBreadcrumb/BackpackBreadcrumb";

type StepSection = "subject" | "topic";

export default function QuizMakerPage () {
   const [stepSections, setStepSections] = useState<StepSection>("subject");
   const [subjectLevel, setSubjectLevel] = useState<string>('');
   const [subject, setSubject] = useState<string>('');
   const [topic, setTopic] = useState<string>('');
   const [detailedTopic, setDetailedTopic] = useState('');
   const [numQuestions, setNumQuestions] = useState<string>('5');
   const [aiQuiz, setAiQuiz] = useState<Quiz | null>(null);
   const [quizStyle, setQuizStyle] = useState<QuizStyle>("mixture");

   const { showModal, close } = useModal();
   const { openSplash, closeSplash } = useSplashScreen();

   function handleLoadingCreateQuiz () {
      openSplash({
         title: <>Creating Quiz</>,
         description: `Please wait while I create your quiz for ${subjectLevel} ${subject}${topic?` ${topic}`:''}...`,
         style: "quiz",
         actions: []
      })
   }

   const createQuizAI = async (callback: Function) => {
		if (subjectLevel.trim() == "" || subject.trim() == "" || topic.trim() == "") {
			toast.error("Please fill in all the fields");
			callback();
			return;
		}
      
      handleLoadingCreateQuiz();
      const data = await generateUsingAi({
         prompt: quizMakerPrompt({ subjectLevel, subject, subjectTopic: topic, numberOfQuestions: parseInt(numQuestions), style: quizStyle }),
         responseFormat: ResponseFormats.QuizMaker
      })
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

   function handleChooseTopic () {
      if (subjectLevel.trim() == '' || subject.trim() == '' || numQuestions.trim() == '') {
         toast.error("Please fill in the fields");
      } else {
         setStepSections("topic")
      }
   }

   function handleChooseSubject () {
      setStepSections("subject")
   }

   return (
      <AppWrapper noNavbar={aiQuiz !== null && aiQuiz !== undefined}>
         {(aiQuiz == null) && (<>
            <div className="box full h-full dfb column">
               <BackpackBreadcrumb 
                  startingHome links={[]}
               />
               <div className="text-l full bold-700 accent-color-gradient-dark-text">START A QUIZ</div>
               <div className="text-xxs full">For each correct answer, you get <b className="accent-color">5</b> points</div>
               <Spacing />

               {(stepSections == "subject") && (<div className="box full dfb column gap-20">
                  <div className="box full dfb column pd-1 gap-5">
                     <div className="text-sm full bold-700">Number of Questions</div>
                     <div className="text-xxs full grey-5 mb-05">More questions takes a longer time to generate quiz</div>
                     <ModalCustomSelect
                        title="Choose Number of Questions"
                        options={["5","10","15"].map(n => ({ option: n, optionName: n }))}
                        onSelect={(option) => setNumQuestions(option.optionName)}
                        defaultOption={0}
                     />
                  </div>

                  <div className="box full dfb column pd-1">
                     <div className="text-sm full bold-700 mb-1">Choose Subject Level</div>
                     <ModalCustomSelect
                        title="Choose Subject Level"
                        options={subjectLevels.map(n => ({ option: n, optionName: n }))}
                        onSelect={(option) => setSubjectLevel(option.optionName)}
                        defaultOption={(subjectLevel !== '') ? subjectLevels.indexOf(subjectLevel) : undefined}
                     />
                  </div>

                  <div className="box full dfb column pd-1">
                     <div className="text-sm full bold-700 mb-1">Choose Subject</div>
                     <ModalCustomSelect
                        title="Choose Subject"
                        options={subjects.map(n => ({ option: n, optionName: n }))}
                        onSelect={(option) => setSubject(option.optionName)}
                        defaultOption={(subject !== '') ? subjects.indexOf(subject)  : undefined}
                     />
                  </div>

                  <div className="box full dfb column pd-1">
                     <button className="xxs pdx-2 pd-14 tiny-shadow radius-20 accent-hover" onClick={handleChooseTopic}>
                        Continue <ArrowRight size={17} />
                     </button>
                  </div>

               </div>)}
               
               {(stepSections == "topic") && (<>
                  <div className="box full dfb column pd-1">
                     <button className="xxs pdx-2 pd-13 tiny-shadow radius-20 outline-black tiny-shadow" onClick={handleChooseSubject}>
                        <ArrowLeft size={17} /> Back
                     </button>
                  </div>

                  <div className="box full dfb column pd-1">
                     <div className="text-sm full bold-700 mb-1">Choose Subject Topic</div>
                     <ModalCustomSelect
                        title="Choose Subject Topic"
                        options={retrieveSubjectTopic(subjectLevel, subject)!.map(n => ({ option: n, optionName: n }))}
                        onSelect={(option) => setTopic(option.optionName)}
                     />
                  </div>

                  <div className="box full pd-2">
                     <div className="box full pd-1">
                        <div className="text-sm bold-700 full">Detailed Topic (optional)</div>
                        <div className="text-xxs full grey-5 pd-1 mb-1">Enter the exact thing you want to learn from this quiz</div>
                        <textarea 
                           className="xxs pd-15 pdx-2 full h-20 radius-15"
                           value={detailedTopic} onChange={e => setDetailedTopic(e.target.value)}
                           placeholder="I want questions on..."
                        />
                     </div>
                     <Spacing />
                     
                     <div className="box full pd-1">
                        <div className="text-sm bold-700 full">Choose Question Style</div>
                        <IntensityChooser
                           title=""
                           options={quizStyleIntensityOptions}
                           onChange={name => setQuizStyle(name)}
                           defaultOption={0}
                        />
                     </div>
                     <Spacing size={2} />
                     <AwaitButton className="xxs pdx-3 radius-20 pd-14 tiny-shadow accent-hover" onClick={createQuizAI}>
                        <BookCheck size={17} /> Create Quiz
                     </AwaitButton>
                     <Spacing size={3} />
                  </div>
               </>)}
            </div>
         </>)}

         {(aiQuiz !== null && aiQuiz !== undefined) && (<>
            <div className="box full h-full">
               <QuizViewer 
                  subject={subject}
                  subjectLevel={subjectLevel}
                  subjectTopic={topic}
                  quiz={aiQuiz}
                  makeNewQuiz={() => {
                     setSubjectLevel("");
                     setSubject("");
                     setTopic("");
                     setAiQuiz(null);
                  }}
               />
               <Spacing size={6} />
            </div>
         </>)}
      </AppWrapper>
   )
}