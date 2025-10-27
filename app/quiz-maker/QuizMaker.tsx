'use client'
import { useModal } from "@/contexts/useModal";
import { retrieveSubjectTopic, subjectLevels, subjects } from "@/utils/subjects";
import { BookCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { callChatGPT } from "../actions/ai";
import { toast } from "sonner";
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import LoadingDots from "@/components/LoadingDots/LoadingDots";
import ModalSelect from "@/components/ModalSelect/ModalSelect";
import Spacing from "@/components/Spacing/Spacing"
import quizMakerPrompt, { quizMakerPromptNoTopic } from "@/prompts/quizMaker";
import QuizViewer from "./QuizViewer";
import ToolHeading from "@/components/ToolHeading/ToolHeading";

export default function QuizMakerPage () {
   const [subjectLevel, setSubjectLevel] = useState<string>('');
   const [subject, setSubject] = useState<string>('');
   const [topic, setTopic] = useState<string>('');
   const [numQuestions, setNumQuestions] = useState<string>('5');
   const [canGenerateQuiz, setCanGenerateQuiz] = useState<boolean>(false);
   const [aiQuiz, setAiQuiz] = useState<Quiz | null>(null)

   const { showModal, close } = useModal();

   useEffect(() => {
      setCanGenerateQuiz((subject !== "" && subjectLevel !== ""));
   }, [subject, subjectLevel])

   useEffect(() => {
      setTopic('');
   }, [subject, subjectLevel])

   const createQuizAI = async () => {
      showModal({
         children: <>
            <div className="text-xl bold-700 full mb-1 text-center">Quiz Maker</div>
            <div className="text-xxs full text-center">
               AI is currently creating a quiz for you about {subjectLevel} {subject}{(topic !== '' && topic) && ` ${topic}`}...
            </div>
            <div className="box pd-2 full dfb justify-center">
               <LoadingDots />
            </div>
         </>
      });
      let data;
      if (topic == '' || !topic) {
         data = await callChatGPT(quizMakerPromptNoTopic(subjectLevel, subject, numQuestions));
      } else {
         data = await callChatGPT(quizMakerPrompt(subjectLevel, subject, topic, numQuestions));
      }
      close();
      if (data == false) {
         toast.error("Failed to chat with AI. Please try again later.");
         return;
      }
      console.log(data.quiz);
      setAiQuiz(data.quiz || null);
   }

   return (
      <AppWrapper>
         {(aiQuiz == null) && (<>
            <div className="box full h-full">
               <ToolHeading title="Create a Quiz" description="Choose your subject level, subject and maybe a topic and press Create Quiz" idClassName="quiz-maker" />
               <div className="text-xxs full pd-1 text-center">For each question you get, you <b className="accent-color">5</b> points added to your total score.</div>
               <Spacing size={1} />

               <div className="text-sm bold-600 full mt-05">Number of Questions</div>
               <div className="text-xs full pd-1">More questions takes a longer time to generate quiz</div>
               <ModalSelect
                  options={["5","10","20","30","40","50"]}
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
               <Spacing size={1} />

               {(subject !== "" && subjectLevel !== "") && (<>
                  <div className="text-sm bold-600 full pd-1">Subject Topic (optional)</div>
                  <ModalSelect
                     options={retrieveSubjectTopic(subjectLevel, subject)!}
                     onSelect={(option) => setTopic(option)}
                     title={`Choose ${subjectLevel} ${subject} Topic`} showDeselect
                  />
                  <Spacing size={2} />
               </>)}

               {(canGenerateQuiz) && <AwaitButton className="xxs full pd-12 tiny-shadow" onClick={createQuizAI}>
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
