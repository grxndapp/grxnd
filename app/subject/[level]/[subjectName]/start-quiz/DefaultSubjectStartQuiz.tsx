'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import FullSelect from "@/components/FullSelect/FullSelect";
import Spacing from "@/components/Spacing/Spacing";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import QuizViewer from "@/app/quiz-maker/QuizViewer";
import { generateUsingAi } from "@/app/actions/ai";
import { CustomSpinner } from "@/components/Spinner/Spinner";
import { useSplashScreen } from "@/components/SplashScreen/SplashScreenContext";
import { titleCase } from "@/lib/str";
import { buildNoteQuizPrompt } from "@/prompts/quizMaker";
import { ResponseFormats } from "@/prompts/responseFormats";
import { customSubjectToBoldColor, subjectColors } from "@/utils/subjects";
import { ArrowLeft, BookCheck, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { getSubjectPageUrl } from "../helper";


type StepSection = "number" | "topic" | "review";

export default function DefaultSubjectStartQuiz ({ subjectTopics, noteSelected, subject, subjectLevel }: { subjectTopics: string[], noteSelected: Note, subject: string, subjectLevel: string }) {
   const router = useRouter();

   const [stepSections, setStepSections] = useState<StepSection>("number");
   const [numQuestions, setNumQuestions] = useState<string>('5');
   const [quizNoteSelected, setQuizNoteSelected] = useState<Note | undefined>(noteSelected);
   const [topicSelected, setTopicSelected] = useState<string | null>(null);

   const [aiQuiz, setAiQuiz] = useState<Quiz | null>(null);

   const subjectColor = subjectLevel ? subjectColors[titleCase(subject)] : customSubjectToBoldColor(titleCase(subject));
   const subjectPageUrl = getSubjectPageUrl(subject, subjectLevel);
   
   const { openSplash, closeSplash } = useSplashScreen();

   function handleLoadingCreateQuiz () {
      openSplash({
         title: <>Creating Quiz <CustomSpinner color="#000" size={20} /></>,
         description: <>Please wait while I create your quiz for {titleCase(subjectLevel)} {titleCase(subject)}...</>,
         style: "loading",
         actions: []
      })
   }

   const createQuizAI = async (callback: Function) => {
      if (!quizNoteSelected) {
         toast.error("Please select a note");
         callback();
         return;
      }
      handleLoadingCreateQuiz();
      const data = await generateUsingAi({
         prompt: buildNoteQuizPrompt({ note: quizNoteSelected.noteJson, numberOfQuestions: parseInt(numQuestions) }),
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
            <div className="box full pd-1 dfb align-center gap-10">
               <button 
                  className="xxxs pd-13 pdx-15 outline-black no-shadow radius-40"
                  onClick={() => router.push(subjectPageUrl)}
               >
                  <ArrowLeft size={16} />
               </button>
            </div>

            {(aiQuiz == null) && (<>
               <div className="box full h-full pd-15 dfb column align-center">
                  <div className="text-l full bold-700 text-center" style={{ color: subjectColor }}>START A QUIZ</div>
                  <div className="text-xxs full bold-500 text-center" style={{ color: subjectColor }}>
                     {titleCase(subjectLevel)} {titleCase(subject)} {noteSelected ? `- ${JSON.parse(noteSelected.noteJson).title}` : ''}
                  </div>
                  <div className="text-xxxs full text-center">For each correct answer, you get <b className="accent-color">5</b> points</div>
                  
                  {(stepSections == "number") && (<>
                     <FullSelect
                        title="Choose Number of Questions"
                        description="More questions takes a longer time to generate quiz"
                        options={["5","10","15","20"].map(n => ({ option: n, optionName: n }))}
                        onSelect={(option) => {
                           setNumQuestions(option.optionName)
                           setStepSections(noteSelected ? "review" : "topic")
                        }}
                        defaultOption={0}
                     />
                     <Spacing size={3} />
                  </>)}
                  
                  {(stepSections == "topic") && (<>
                     <FullSelect
                        title="Choose Subject Topic"
                        options={subjectTopics.map(topic => ({ option: topic, optionName: topic }))}
                        onSelect={(option) => {
                           setTopicSelected(option.optionName)
                           setStepSections("review")
                        }}
                        backButton={() => setStepSections("number")}
                     />
                     <Spacing size={3} />
                  </>)}
                  
                  {(stepSections == "review") && (
                     <div className="box full pd-2 dfb column align-center">
                        <div className="box full mw-600">
                           <Spacing />
                           <div className="box full dfb column">
                              <div className="text-xxs grey-5 full">Number of Questions</div>
                              <div className="text-s bold-600 full">{numQuestions} questions</div>
                           </div>
                           <Spacing />
                           {noteSelected ? (
                              <div className="box full dfb column">
                                 <div className="text-xxs grey-5 full">Note Chosen</div>
                                 <div className="text-s bold-600 full">{JSON.parse(quizNoteSelected?.noteJson!).title}</div>
                              </div>
                           ) : (
                              <div className="box full dfb column">
                                 <div className="text-xxs grey-5 full">Topic Chosen</div>
                                 <div className="text-s bold-600 full">{topicSelected}</div>
                              </div>
                           )}
                           <Spacing size={2} />
                           <div className="box full dfb column align-center gap-15">
                              <button 
                                 className="xxs pd-13 full mw-500 radius-20 outline-black"
                                 onClick={() => noteSelected ? setStepSections("number") : setStepSections("topic")}
                              >
                                 <ArrowLeft size={18} /> Back
                              </button>
                              <AwaitButton className="xxs full mw-500 pd-14 tiny-shadow radius-20" onClick={createQuizAI}>
                                 <BookCheck size={17} /> Create Quiz
                              </AwaitButton>
                           </div>
                        </div>
                     </div>
                  )}
                  
               </div>
            </>)}

            {(aiQuiz !== null && aiQuiz !== undefined) && (<>
               <QuizViewer 
                  subject={subject}
                  subjectLevel={subjectLevel}
                  subjectTopic={JSON.parse(quizNoteSelected?.noteJson!).title}
                  quiz={aiQuiz}
                  makeNewQuiz={() => {
                     setQuizNoteSelected(undefined);
                     setAiQuiz(null);
                  }}
               />
            </>)}
         </div>
      </AppWrapper>
   )
}

