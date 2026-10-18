'use client'
import '@/styles/quiz.css'
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { toast } from 'sonner';
import { ArrowRightFromLine, Bookmark, Home, RotateCcw } from 'lucide-react';
import { CustomIcon } from '@/components/Icons/Icon';
import { addQuizScore, userSavedQuiz } from '../actions/quiz';
import { titleCase } from '@/lib/str';
import ProgressRing from '@/components/ProgressRing/ProgressRing';
import Spacing from '@/components/Spacing/Spacing';
import RenderMarkdown from '@/components/RenderMarkdown/RenderMarkdown';
import AwaitButton from '@/components/AwaitButton/AwaitButton';

const decideColor = (score: number) => {
   if (score < 40) {
      return '#ef4444'; // red-500 (bad)
   } else if (score < 75) {
      return '#f97316'; // orange-500 (fair)
   } else {
      return '#22c55e'; // green-500 (great)
   }
}

const getProgressMessage = (score: number): { title: string; message: string } => {
   if (score < 50) {
      return {
         title: "Keep Going",
         message: "Every bit of effort counts. You're building momentum!",
      };
   } else if (score < 75) {
      return {
         title: "You're Getting There",
         message: "Nice progress — stay focused and keep pushing!",
      };
   } else if (score < 90) {
      return {
         title: "Great Work",
         message: "You're almost at the top. Finish strong!",
      };
   } else {
      return {
         title: "Excellent!",
         message: "You've crushed it — outstanding commitment!",
      };
   }
 }

const questionTypeFormatting = (type: string) => {
   if (type.includes('1')) {
      return <>This is an <b style={{color: "#ffabab"}}>A type question</b></>
   } else if (type.includes('2')) {
      return <>This is a <b style={{color: "#ffac69   "}}>B type question</b></>
   } else if (type.includes('3')) {
      return <>This is a <b style={{color: "#4ac76b"}}>C type question</b></>
   }
}

type QuizViewerProps = {
   quiz: Quiz;
   subjectLevel: string;
   subject: string;
   subjectTopic: string;
   makeNewQuiz: () => void;
}

export default function QuizViewer ({ quiz, subject, subjectLevel, subjectTopic, makeNewQuiz }: QuizViewerProps) {
   const router = useRouter();

   // quiz functionality
   const [quizFormDisplay, setQuizFormDisplay] = useState<'start' | 'quiz' | 'end'>('start');
   const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(quiz);
   const [questionIndex, setQuestionIndex] = useState(0);
   const [optionChosen, setOptionChosen] = useState<number | undefined>(undefined);
   const [questionAnswered, setQuestionAnswered] = useState(false);
   const [score, setScore] = useState(0)
   const [retake, setRetake] = useState(false);

   const answerQuestion = () => {
      if (!quizQuestions) return;
      if (optionChosen == undefined) {
         toast.error("Please choose an option !");
      } else {
         setQuestionAnswered(true);
         if (optionChosen == quizQuestions[questionIndex].answerIndex) setScore((prev)=>prev+1);
      }
   }

   const retakeQuiz = () => {
      setRetake(true)
      setScore(0)
      setOptionChosen(undefined)
      setQuestionIndex(0)
      setQuestionAnswered(false)
      setQuizFormDisplay('quiz')
   }

   async function handleSaveQuiz (callback: Function) {
      const saved = await userSavedQuiz(subjectLevel, subject, subjectTopic, score, JSON.stringify(quiz));
      if (saved) {
         toast.success("Saved Quiz");
      } else {
         toast.error("Failed to save quiz")
      }
      callback();
   }

   const nextQuestionBtn = async () => {
      if (!quizQuestions) return;
      if (questionIndex+1 >= quizQuestions.length) {
         setQuizFormDisplay('end');
         if (!retake) {
            await addQuizScore(subjectLevel, subject, subjectTopic, ((score/quizQuestions.length)*100), (score*5));
         }
      } else {
         setOptionChosen(undefined);
         setQuestionAnswered(false);
         setQuestionIndex((prev) => prev+1);
      }
   }

   return <div className='quiz-container'>
      <div className="qc-container">
         {(quizFormDisplay == "start") ? <>
            {/* The start of the quiz */}
            <div className="quiz-start-box">
               <CustomIcon 
                  url={`/subjects/${subject.toLowerCase().replaceAll(" ", "-")}.png`}
                  size={140}
               />
               <div className='text-l bold-700 text-center'>{subjectTopic}</div>
               <div className='text-s bold-500 text-center'>{subjectLevel} {subject}</div>
               <div className="text-xs grey pd-1 text-center">
                  Once you begin this quiz, you can't go back and you must complete it.
               </div>
               <div className="actions">
                  <button className='xxs full mw-400 pd-12 tiny-shadow' onClick={() => setQuizFormDisplay('quiz')}>Start Quiz</button>
                  <button className='xxs full mw-400 pd-12 outline-black tiny-shadow' onClick={() => router.push('/home')}>Back to Home</button>
               </div>
            </div>
         
         </> : (quizFormDisplay == "quiz") ? <>
            <div className="quiz-begin">
               <div className="text-ml bold-700 pd-1 mt-05 no-trans">{titleCase(subjectTopic)}</div>
               <div className="question text-xs pd-1 no-trans"><RenderMarkdown content={quizQuestions[questionIndex].question} /></div>
               <div className="text-xs no-trans">{questionTypeFormatting(quizQuestions[questionIndex].questionType)}</div>
               
               {(questionAnswered) ? <>
                  <div className={`explanation ${optionChosen == quizQuestions[questionIndex].answerIndex ? 'correct' : 'wrong'}`}>
                     <div className="text-sm bold-700">{optionChosen == quizQuestions[questionIndex].answerIndex ? 'Correct' : 'Wrong'}</div>
                     <div className="text-s" style={{ whiteSpace: "pre-line" }}>
                        <RenderMarkdown content={quizQuestions[questionIndex].answerExplanation} />
                     </div>
                  </div>
               </> : <br />}

               <div className="options">
                  {(questionAnswered && optionChosen !== undefined) ? <>
                     {/* when the user answers the questions show the option they chose and the right one */}
                     {quizQuestions[questionIndex]
                     .options
                     .filter((o_, index) => (index == optionChosen || index == quizQuestions[questionIndex].answerIndex))
                     .map((option, index) => {
                        return <div 
                           key={index} 
                           className={`option ${option == quizQuestions[questionIndex].options[quizQuestions[questionIndex].answerIndex] ? 'correct' : 'wrong'}`}
                           onClick={() => {}}
                        ><RenderMarkdown content={option} /></div>
                     })}

                  </> : <>
                     {/* list all options */}
                     {quizQuestions[questionIndex].options.map((option, index) => {
                        return <div 
                           key={index} 
                           className={`option ${index == optionChosen ? 'selected' : ''}`}
                           onClick={() => setOptionChosen(index)}
                        ><RenderMarkdown content={option} /></div>
                     })}
                  </>}

               </div><br />
               
               <div className="actions">
                  {(questionAnswered) 
                     ? <button className='xs full pd-12 tiny-shadow' onClick={nextQuestionBtn}>
                           <ArrowRightFromLine size={18} /> {(questionIndex+1 >= quizQuestions.length) ? 'End Quiz' : 'Next Question'}
                        </button> 
                     : <button className='xs full pd-12 tiny-shadow' onClick={answerQuestion}>Submit</button>
                  }
               </div>
               
               <Spacing size={3} />
            </div>

         </> : <>
            {/* once the quiz ends */}
            <div className="text-ml text-center bold-700 pd-1">{subjectTopic}</div>
            <br />
            <div className="box dfb full justify-center">
               <ProgressRing
                  color={decideColor((score/quizQuestions.length)*100)}
                  progress={(score/quizQuestions.length)*100}
               />
            </div>
            <br />

            <div className="text-sm bold-500 text-center">{getProgressMessage((score/quizQuestions.length)*100).title}</div>
            <div className="text-xs pd-1 grey text-center">{getProgressMessage((score/quizQuestions.length)*100).message}</div>
            <br />

            <div className="actions">
               <AwaitButton className='xs full mw-400 pd-12 tiny-shadow' onClick={handleSaveQuiz}>
                  <Bookmark size={17} /> Save Quiz
               </AwaitButton>
               <button className='xs full mw-400 pd-12 tiny-shadow' onClick={retakeQuiz}>
                  <RotateCcw size={17} /> Retake Quiz
               </button>
               <button className='xs full mw-400 pd-12 outline-black tiny-shadow' onClick={makeNewQuiz}>Take Another Quiz</button>
               <button className='xs full mw-400 pd-12 outline-black tiny-shadow' onClick={() => router.push("/home")}>
                  <Home size={17} /> Back to Home
               </button>
            </div>
         </>}

      </div>
   </div>
}