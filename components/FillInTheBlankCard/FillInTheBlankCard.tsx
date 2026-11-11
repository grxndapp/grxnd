"use client";
import { useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Play, RotateCw } from "lucide-react";
import { titleCase } from "@/lib/str";
import Spacing from "../Spacing/Spacing";
import styles from "./FillInTheBlankCard.module.css";
import ProgressRing from "../ProgressRing/ProgressRing";

type Question = {
   sentences: string[];
   missingWords: string[];
   hint: string;
};

type Props = {
   title: string;
   questions: Question[];
   subjectInfo: any;
   topic: string;
   onComplete?: () => void;
   onMakeNew?: () => void;
};

const normalize = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();

export default function FillInTheBlankCard({ title, questions, topic, onComplete, subjectInfo, onMakeNew }: Props) {
   const controls = useAnimationControls();

   const [index, setIndex] = useState(0);
   const [answers, setAnswers] = useState<string[]>([]);
   const [showFeedback, setShowFeedback] = useState(false);
   const [animating, setAnimating] = useState(false);
   const [completed, setCompleted] = useState(false);
   const [correctAnswers, setCorrectAnswers] = useState(0);

   function restartFitb () {
      setIndex(0);
      setAnswers([])
      setAnimating(false);
      setCorrectAnswers(0);
      setShowFeedback(false);
      setCompleted(false);
   }

   const question = questions[index];
   if (!question) return <p>No questions available.</p>;
   if (completed) return (<>
      <div className="text-sm full bold-600 accent-color-gradient-dark-text">Fill In The Blanks</div>
      <div className="text-l full bold-700" style={{ color: subjectInfo.subjectColor }}>{title}</div>
      <div className="text-s mb-1 bold-500 full" style={{ color: subjectInfo.subjectColor }}>{topic}</div>
      <Spacing />
      <div className="text-l bold-600 full">You got {correctAnswers} right!</div>
      <div className="box full pd-15">
         <ProgressRing
            progress={((correctAnswers/questions.length)*100)}
            color={subjectInfo.subjectColor}
         />
      </div>
      <div className="text-xxs pd-1 full">You can try again or make a new one</div>
      <div className="box full pd-1 dfb wrap gap-10">
         <button className="xxs pd-13 pdx-3 radius-20 accent-hover" onClick={restartFitb}><RotateCw size={17} /> Restart</button>
         <button className="xxs pd-13 pdx-3 radius-20 outline-black tiny-shadow" onClick={() => { if (onMakeNew) onMakeNew(); }}>
            <Play size={17} /> New Questions
         </button>
      </div>
   </>);

   const results = question.missingWords.map((word, i) => normalize(answers[i] ?? "") === normalize(word));

   const allCorrect = results.every(Boolean);
   const allAnswered = question.missingWords.every((_, i) => (answers[i] ?? "").trim().length > 0);

   async function checkAnswer() {
      if (animating || showFeedback || !allAnswered) return;
      setAnimating(true);
      setShowFeedback(true);
      await controls.start({
         rotateY: 180,
         transition: { duration: 0.5, ease: "easeInOut" }
      });
      if (allCorrect) setCorrectAnswers(p => p+1);
      setAnimating(false);
   }

   async function nextQuestion() {
      if (animating || !showFeedback) return;
      if (index === questions.length - 1) {
         setCompleted(true);
         onComplete?.();
         return;
      }
      setAnimating(true);
      await controls.start({
         rotateY: 315,
         transition: { duration: 0.30, ease: "easeIn" }
      });

      await controls.start({
         rotateY: 360,
         transition: { duration: 0.25, ease: "easeOut" }
      });
      
      setIndex((current) => current + 1);
      setAnswers([]);
      setShowFeedback(false);
      setAnimating(false);
   }

   return (
      <div className={styles.container}>
         <p className={styles.progress}>Question {index + 1} of {questions.length}</p>
         <div className={styles.perspective}>
            <motion.div
               initial={{ rotateY: 0 }}
               animate={controls}
               className={styles.card}
            >
               {/* FRONT */}
               <section
                  aria-hidden={showFeedback}
                  inert={showFeedback || animating}
                  className={`${styles.face} ${styles.front}`}
               >
                  <form
                     className={styles.form}
                     onSubmit={(event) => {
                        event.preventDefault();
                        void checkAnswer();
                     }}
                  >
                     <div className="text-l full bold-700 mb-1" style={{ color: subjectInfo.subjectColor }}>
                        {title ?? 'Fill in the blanks'}
                     </div>
                     <div className={styles.sentence}>
                        {question.sentences.map((segment, i) => (
                           <span key={`${index}-${i}`}>
                              {segment}
                              {i < question.missingWords.length && (
                                 <>
                                    {" "}
                                    <input
                                       className={styles.input} aria-label={`Blank ${i + 1}`} autoComplete="off"
                                       value={answers[i] ?? ""}
                                       onChange={(event) => {
                                          const value = event.target.value;
                                          setAnswers((previous) => {
                                             const next = [...previous];
                                             next[i] = value;
                                             return next;
                                          });
                                       }}
                                    />
                                    {" "}
                                 </>
                              )}
                           </span>
                        ))}
                     </div>

                     <div className="text-xs full mt-3 pd-05 bold-500" style={{ color: subjectInfo.subjectColor }}>Hint: {titleCase(question.hint)}</div>

                     <button 
                        type="submit" disabled={!allAnswered || animating} 
                        className={`${styles.button} ${styles.checkButton}`}
                        style={{ background: subjectInfo.subjectColor }}
                     >
                        Check answer
                     </button>
                  </form>
               </section>

               {/* BACK */}
               <section
                  aria-hidden={!showFeedback}
                  inert={!showFeedback || animating}
                  className={[
                     styles.face,
                     styles.back,
                     allCorrect ? styles.correct : styles.incorrect
                  ].join(" ")}
               >
                  <h2 className={styles.feedbackTitle}>{allCorrect ? "You got it!" : "Here's what to remember"}</h2>
                  <p className={styles.completedSentence}>
                     {question.sentences.map((segment, i) => (
                        <span key={i}>
                           {segment}
                           {i < question.missingWords.length && (
                              <strong className={styles.answer}>{question.missingWords[i]}</strong>
                           )}
                        </span>
                     ))}
                  </p>

                  <button onClick={() => void nextQuestion()} className={`${styles.button} ${styles.nextButton}`} disabled={animating}>
                     {index === questions.length - 1 ? "Finish session" : "Next question"}
                  </button>
               </section>
            </motion.div>
         </div>
      </div>
   );
}