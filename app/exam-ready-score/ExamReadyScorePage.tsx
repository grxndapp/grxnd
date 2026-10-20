'use client'
import "@/styles/exam-ready-score.css"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import ExamAnalysisLoader from "@/components/ExamAnalysisLoader/ExamAnalysisLoader"
import ModalSelect from "@/components/ModalSelect/ModalSelect"
import Spacing from "@/components/Spacing/Spacing"
import ExamReadyRing from "@/components/ExamReadyRing/ExamReadyRing"
import { pluralSuffixer, titleCase } from "@/lib/str"
import { ExamDateCardStyles, SubjectIconBubble } from "@/styles-extra/styles"
import { formatMilliseconds } from "@/utils/date"
import { fullSubjectBreakDown, subjectIcon, subjectLevels, subjects } from "@/utils/subjects"
import { HTMLMotionProps, motion } from "framer-motion"
import { ArrowRight, BookOpen, BookText, Calendar, ChartNoAxesColumn, Sparkles, TriangleAlert, Trophy } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { RiTargetLine } from "react-icons/ri";
import { BiSolidZap } from "react-icons/bi";
import { createExamReadyScore, ExamReadyScore } from "./examReadyScoreCalculator"
type QuestionStages = "subject" | "target-grade" | "exam-date" | "loading" | "show-score"
type TargetGrades = "A" | "B"


export default function ExamReadyScorePage ({ quizzes }: { quizzes: SavedQuiz[] }) {
   const date = new Date(Date.now());
   const dateInputRef = useRef<HTMLInputElement>(null)
   const [questionStage, setQuestionStage] = useState<QuestionStages>("subject");
   
   // states to calculate score
   const [subjectLevel, setSubjectLevel] = useState("");
   const [subject, setSubject] = useState("");
   const [targetGrade, setTargetGrade] = useState<Partial<TargetGrades>>();
   const [examDate, setExamDate] = useState(
      `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
   );

   // final
   const [examReadyScore, setExamReadyScore] = useState<ExamReadyScore | null>(null);
   

   function calculateExamReadyScore () {
      if (subjectLevel == "" || subject == "") {
         toast.error("Please choose a subject level and subject");
         return;
      }
      if (!targetGrade) {
         toast.error("Please choose your desired grade");
         return;
      }
      if (!examDate) {
         toast.error("Please choose your exam date");
         return;
      }
      if (new Date(examDate).getTime() < Date.now()) {
         toast.error("Please choose an exam date in the future");
         return;
      }
      const examReadyScore = createExamReadyScore(subjectLevel, subject, targetGrade, new Date(examDate), quizzes);
      console.log(examReadyScore);
      setExamReadyScore(examReadyScore);
   }

   function handleToTargetGrade () {
      if (subjectLevel == "" || subject == "") {
         toast.error("Please choose a subject level and subject");
         return;
      }
      setQuestionStage("target-grade");
   }

   function handleToExamDate () {
      if (!targetGrade) {
         toast.error("Please choose your desired grade");
         return;
      }
      setQuestionStage("exam-date");
   }

   function handleToLoading () {
      if (!examDate) {
         toast.error("Please choose your exam date");
         return;
      }
      if (new Date(examDate).getTime() < Date.now()) {
         toast.error("Please choose an exam date in the future");
         return;
      }
      setQuestionStage("loading");
      calculateExamReadyScore();
   }

   const questionStageProps: HTMLMotionProps<"div"> = {
      className: "box full mw-700",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
   }

   const SubjectIconBubbleAccent = {
      ...SubjectIconBubble, background: "var(--accent-color-10)", color: "var(--accent-color)"
   }

   const FocusIconBubble = {
      ...SubjectIconBubble, background: "#ffadad", color: "#b80606"
   }

   const StrengthIconBubble = {
      ...SubjectIconBubble, background: "#95f88c", color: "#046d04"
   }

   return (
      <AppWrapper>
         <div className="box full h-full pd-1">
            {(questionStage == "show-score" && examReadyScore) ? (<div className="box full dfb column gap-10">
               
               <div>
                  <div className="box full dfb align-center gap-10 pd-05">
                     <div className="box full dfb align-center gap-10">
                        <div style={SubjectIconBubble}>
                           {subjectIcon[fullSubjectBreakDown(subject).subject]}
                        </div>
                        <div className="box full dfb column">
                           <div className="text-xxs bold-600">{subjectLevel}</div>
                           <div className="text-xxs">{subject}</div>
                        </div>
                     </div>
                     <div className="target-grade-pill whitespace-nowrap">Target <b>{examReadyScore.targetGrade}</b></div>
                  </div>
                  <div className="box full pd-2 dfb align-center justify-center">
                     <ExamReadyRing 
                        score={examReadyScore.overall.score} size={190}
                        label={examReadyScore.overall.status}
                     />
                  </div>
                  <div className="box full pd-1">
                     <div className="text-xxs full text-center">{examReadyScore.overall.headline}</div>
                  </div>
               </div>
               
               <div className="exam-score-card orange">
                  <div className="box full dfb align-center gap-15">
                     <div style={SubjectIconBubbleAccent}>
                        <Calendar size={20} />
                     </div>
                     <div className="box full dfb column pd-1">
                        <div className="text-m bold-600 full line-height-12">{examReadyScore.daysUntilExam} days</div>
                        <div className="text-xxs grey-5 full line-height-12">until your exam</div>
                     </div>
                  </div>
               </div>

               <div className="box full pd-2 pdx-05 mt-15">
                  <div className="text-l bold-700 full line-height-11">Your Progress</div>
                  <div className="exam-card-wrapper">

                     <div className="exam-score-card">
                        <div className="box full dfb align-center gap-15">
                           <div style={SubjectIconBubbleAccent}>
                              <ChartNoAxesColumn size={20} />
                           </div>
                           <div className="box full dfb column pd-1">
                              <div className="text-xxs full bold-500 line-height-11">Current Average</div>
                              <div className="text-m bold-700 full line-height-13">{examReadyScore.quizTarget.currentAverage}%</div>
                              <div className="text-xxxs grey-5 full line-height-11">Your current quiz average</div>
                           </div>
                        </div>
                     </div>
                     <div className="exam-score-card green">
                        <div className="box full dfb align-center gap-15">
                           <div style={{ ...SubjectIconBubble, background: "#b3ffaa", color: "#216d18" }}>
                              <RiTargetLine size={20} />
                           </div>
                           <div className="box full dfb column pd-1">
                              <div className="text-xxs full bold-500 line-height-11">Needed Average</div>
                              <div className="text-m bold-700 full line-height-13">{examReadyScore.quizTarget.averageNeeded}%</div>
                              <div className="text-xxxs grey-5 full line-height-11">Average needed for {examReadyScore.targetGrade == 'A' ? 'an' : 'a'} {examReadyScore.targetGrade}</div>
                           </div>
                        </div>
                     </div>
                     <div className="exam-score-card">
                        <div className="box full dfb align-center gap-15">
                           <div style={SubjectIconBubbleAccent}>
                              <BookOpen size={20} />
                           </div>
                           <div className="box full dfb column pd-1">
                              <div className="text-m bold-700 full line-height-13">{examReadyScore.stats.topicsCovered}/{examReadyScore.stats.totalTopics}</div>
                              <div className="text-xxxs grey-5 full line-height-11">Topics Covered</div>
                           </div>
                        </div>
                     </div>

                  </div>
               </div>

               <div className="plan-card">
                  <div className="text-xxs grey-5 full line-height-12">Your Plan</div>
                  <div className="text-l bold-700 full line-height-11">{examReadyScore.plan.title}</div>
                  <div className="text-xxs full line-height-13 pd-05">{examReadyScore.plan.description}</div>

                  <div className="box full pd-2 dfb wrap gap-10">

                     <div className="simple-exam-score-card">
                        <div className="box full dfb align-center gap-15">
                           <div style={SubjectIconBubbleAccent}>
                              <BiSolidZap size={20} />
                           </div>
                           <div className="box full dfb column pd-1">
                              <div className="text-s bold-700 full line-height-13">
                                 {examReadyScore.plan.quizzesPerWeek} {pluralSuffixer('quiz', examReadyScore.plan.quizzesPerWeek, 'zes')}
                              </div>
                              <div className="text-xxxs grey-5 full line-height-11">every week, recommended pace</div>
                           </div>
                        </div>
                     </div>
                     <div className="simple-exam-score-card green">
                        <div className="box full dfb align-center gap-15">
                           <div style={SubjectIconBubbleAccent}>
                              <BookText size={20} />
                           </div>
                           <div className="box full dfb column pd-1">
                              <div className="text-s bold-700 full line-height-13">
                                 {examReadyScore.plan.totalQuizzesNeeded} {pluralSuffixer('quiz', examReadyScore.plan.totalQuizzesNeeded, 'zes')} left
                              </div>
                              <div className="text-xxxs grey-5 full line-height-11">to reach your target</div>
                           </div>
                        </div>
                     </div>

                  </div>
                  
                  <div className="box full dfb column gap-10">
                     {(examReadyScore.stats.weakestTopics.length > 0) && (
                        <div className="strength-topics-card">
                           <div className="box full dfb align-center gap-10">
                              <div style={StrengthIconBubble}><Trophy size={22} /></div>
                              <div className="text-m bold-600 full line-height-12 dfb align-center gap-10">Strongest Topics</div>
                           </div>
                           <div className="box full pd-2 dfb wrap gap-10">
                              {examReadyScore.stats.weakestTopics.map(topic => (
                                 <div key={topic.topic} className="strength-topic-pill">{titleCase(topic.topic)}</div>
                              ))}
                           </div>
                        </div>
                     )}

                     {(examReadyScore.plan.focusTopics.length > 0) && (
                        <div className="focus-topics-card">
                           <div className="box full dfb align-center gap-10">
                              <div style={FocusIconBubble}><TriangleAlert size={22} /></div>
                              <div className="text-m bold-600 full line-height-12 dfb align-center gap-10">Focus Topics</div>
                           </div>
                           <div className="box full pd-2 dfb wrap gap-10">
                              {examReadyScore.plan.focusTopics.map(topic => (
                                 <div key={topic} className="focus-topic-pill">{titleCase(topic)}</div>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
               </div>
               

               <div className="box full pd-2 pdx-05 mt-15">
                  <div className="text-l bold-700 full line-height-11">Strategy for {examReadyScore.plan.title}</div>
                  <div className="box full pd-2 dfb wrap gap-10">
                     {examReadyScore.plan.strategy.map(strategy => (
                        <div key={strategy.action} className="exam-score-card">
                           <div className="box full dfb column pd-15 pdx-1 gap-5">
                              <div className="text-sm bold-700 full line-height-13 accent-color">{strategy.action}</div>
                              <div className="text-xxs grey-5 full line-height-15">{strategy.detail}</div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <Spacing size={4} />
               
            </div>) : (<>
               <div className="box full pd-1 dfb column gap-10">
                  <div className="text-xxxl bold-700 full accent-color line-height-11">Exam Ready Score</div>
               </div>
               <div className="text-s full">See if you are ready for your exams</div>
               <Spacing size={1} />
               <div className="box full pd-1">
                  {(questionStage == "subject") && (
                     <motion.div {...questionStageProps}>
                        <div className="text-l full xl bold-700 pd-1">What Subject are you ready for?</div>
                        <div className="text-sm bold-600 full pd-1">Subject Level</div>
                        <ModalSelect
                           options={subjectLevels}
                           onSelect={(option) => setSubjectLevel(option)}
                           title="Choose Subject Level"
                        />
                        <Spacing />

                        <div className="text-sm bold-600 full pd-1">Subject</div>
                        <ModalSelect
                           options={subjects}
                           onSelect={(option) => setSubject(option)}
                           title="Choose Subject"
                        />
                        <Spacing />

                        <div className="box full">
                           <button className="xxs pd-13 pdx-3 radius-20" onClick={handleToTargetGrade}>
                              Next <ArrowRight size={17} />
                           </button>
                        </div>
                     </motion.div>
                  )}
                  
                  {(questionStage == "target-grade") && (
                     <motion.div {...questionStageProps}>
                        <div className="text-l full xl bold-700 pd-1">What Grade do you want?</div>
                        <ModalSelect
                           options={["A","B"] as TargetGrades[]}
                           onSelect={(option: TargetGrades) => setTargetGrade(option)}
                           title="What Grade do you want?"
                        />
                        <Spacing />

                        <div className="box full">
                           <button className="xxs pd-13 pdx-3 radius-20" onClick={handleToExamDate}>
                              Next <ArrowRight size={17} />
                           </button>
                        </div>
                     </motion.div>
                  )}
                  
                  {(questionStage == "exam-date") && (
                     <motion.div {...questionStageProps}>
                        <div className="text-l full xl bold-700 pd-1">When is your {titleCase(subjectLevel)} {titleCase(subject)} Exam?</div>
                        <div className="box full mb-3">
                           <input 
                              ref={dateInputRef}
                              type="date" name="grxnd-student-exam-date" id="grxnd-student-exam-date"
                              value={examDate} onChange={e => setExamDate(e.target.value)}
                              style={{ opacity: 0, accentColor: "var(--accent-color)", padding: "0" }} 
                           />
                           <div style={ExamDateCardStyles} onClick={() => dateInputRef.current?.showPicker()}>
                              <div className="text-xs bold-500 dfb align-center justify-center gap-10">
                                 <Calendar size={18} />
                                 {formatMilliseconds(new Date(examDate).getTime(), true)}
                              </div>
                           </div>
                        </div>

                        <div className="box full">
                           <button className="xxs pd-13 pdx-3 radius-20" onClick={handleToLoading}>
                              Check Exam Ready Score <Sparkles size={17} />
                           </button>
                        </div>
                     </motion.div>
                  )}
                  
                  {(questionStage == "loading") && (
                     <motion.div {...questionStageProps}>
                        <ExamAnalysisLoader
                           onComplete={() => setQuestionStage("show-score")}
                        />
                     </motion.div>
                  )}
               </div>
            </>)}

         </div>
      </AppWrapper>
   )
}
