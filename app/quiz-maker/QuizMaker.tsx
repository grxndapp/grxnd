'use client'
import { useModal } from "@/components/Modal/ModalContext";
import { retrieveSubjectTopic, subjectLevels, subjects } from "@/utils/subjects";
import { BookCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { llmForMarkdownAndJson } from "../actions/ai";
import { toast } from "sonner";
import { quizMakerPrompt } from "@/prompts/quizMaker";
import { CustomSpinner } from "@/components/Spinner/Spinner";
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import ModalSelect from "@/components/ModalSelect/ModalSelect";
import Spacing from "@/components/Spacing/Spacing"
import QuizViewer from "./QuizViewer";
import ToolHeading from "@/components/ToolHeading/ToolHeading";


export default function QuizMakerPage () {
   const [subjectLevel, setSubjectLevel] = useState<string>('');
   const [subject, setSubject] = useState<string>('');
   const [topic, setTopic] = useState<string>('');
   const [numQuestions, setNumQuestions] = useState<string>('5');
   const [canGenerateQuiz, setCanGenerateQuiz] = useState<boolean>(false);
   const [aiQuiz, setAiQuiz] = useState<Quiz | null>(null);
   const [detailedTopic, setDetailedTopic] = useState('');

   const { showModal, close } = useModal();

   useEffect(() => {
      setCanGenerateQuiz((subject !== "" && subjectLevel !== ""));
   }, [subject, subjectLevel])

   useEffect(() => {
      setTopic('');
   }, [subject, subjectLevel])

   const createQuizAI = async (callback: Function) => {
      showModal({
         content: <div className="box full pd-3 pdx-3">
            <div className="text-xl bold-700 full mb-1 accent-color">Quiz Maker</div>
            <div className="text-xxs full">
               AI is currently creating a quiz for you about {subjectLevel} {subject}{(topic !== '' && topic) && ` ${topic}`}...
            </div>
            <div className="box pd-2 full dfb justify-start">
               <CustomSpinner color="#1121ff" size={40} />
            </div>
         </div>
      });
      const data = await llmForMarkdownAndJson(quizMakerPrompt({ subjectLevel, subject, subjectTopic: topic, numberOfQuestions: parseInt(numQuestions) }));
      close();
      if (data == false) {
         toast.error("Failed to create quiz. Please try again later.");
         callback();
         return;
      }
      console.log(data.quiz);
      setAiQuiz(data.quiz || null);
   }

   return (
      <AppWrapper noNavbar={aiQuiz !== null && aiQuiz !== undefined}>
         {(aiQuiz == null) && (<>
            <div className="box full h-full mw-700 pd-3">
               <ToolHeading title="Create a Quiz" description="Choose your subject level, subject and maybe a topic and press Create Quiz" idClassName="quiz-maker" />
               <div className="text-xxs full pd-1">For each question you get, you <b className="accent-color">5</b> points added to your total score.</div>
               <Spacing size={1} />

               <div className="text-sm bold-600 full mt-05">Number of Questions</div>
               <div className="text-xs full pd-1">More questions takes a longer time to generate quiz</div>
               <ModalSelect
                  options={["5","10","15","20"]}
                  onSelect={(option) => setNumQuestions(option)}
                  title="Choose Number of Questions"
                  defaultOption={0}
               />
               <Spacing size={1} />

               <div className="text-sm bold-600 full pd-1">Subject Level</div>
               <ModalSelect
                  options={subjectLevels}
                  onSelect={(option) => setSubjectLevel(option)}
                  title="Choose Subject Level"
               />
               <Spacing size={1} />

               <div className="text-sm bold-600 full pd-1">Subject</div>
               <ModalSelect
                  options={subjects}
                  onSelect={(option) => setSubject(option)}
                  title="Choose Subject"
               />
               <Spacing />

               {(subject !== "" && subjectLevel !== "") && (<>
                  <div className="text-sm bold-600 full pd-1">Subject Topic (optional)</div>
                  <ModalSelect
                     options={retrieveSubjectTopic(subjectLevel, subject)!}
                     onSelect={(option) => setTopic(option)}
                     title={`Choose ${subjectLevel} ${subject} Topic`} showDeselect
                  />
                  <Spacing />
                  <div className="text-sm bold-600 full">Detailed Topic (optional)</div>
                  <div className="text-xs full grey-5 pd-05">Enter the exact thing you want to learn from this</div>
                  <textarea 
                     className="xxs pd-15 pdx-2 full h-20 radius-15"
                     value={detailedTopic} onChange={e => setDetailedTopic(e.target.value)}
                  />
                  <Spacing size={2} />
               </>)}

               {(canGenerateQuiz) && <AwaitButton className="xxs full pd-14 tiny-shadow" onClick={createQuizAI}>
                  <BookCheck size={17} /> Create Quiz
               </AwaitButton>}

               <Spacing size={5} />
            </div>
         </>)}

         {(aiQuiz !== null && aiQuiz !== undefined) && (<>
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
         </>)}
      </AppWrapper>
   )
}