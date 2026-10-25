'use client'
import { useModal } from "@/components/Modal/ModalContext";
import { retrieveSubjectTopic, subjectLevels, subjects } from "@/utils/subjects";
import { BookCheck, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { generateUsingAi } from "../actions/ai";
import { quizMakerPrompt } from "@/prompts/quizMaker";
import { CustomSpinner } from "@/components/Spinner/Spinner";
import { ResponseFormats } from "@/prompts/responseFormats";
import { useSplashScreen } from "@/components/SplashScreen/SplashScreenContext";
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import Spacing from "@/components/Spacing/Spacing"
import QuizViewer from "./QuizViewer";
import FullSelect from "@/components/FullSelect/FullSelect";


const quiz = [
    {
        "question": "Which of the following statements about eccentricity ($e$) and conic sections is correct?",
        "options": [
            "A hyperbola has $e > 1$.",
            "A circle has $e \\in (0,1)$.",
            "A parabola has $e \\in (1, \\infty)$.",
            "An ellipse has $e=1$.",
            "A circle has $e=1$."
        ],
        "answerIndex": 0,
        "answerExplanation": "According to the note, for a hyperbola, the eccentricity $e \\in (1, \\infty)$, which means $e > 1$. For a circle, $e=0$. For an ellipse, $e \\in [0,1)$. For a parabola, $e=1$.",
        "questionType": "3"
    },
    {
        "question": "Calculate the gradient of a straight line passing through the points $(-3, 5)$ and $(1, -7)$.",
        "options": [
            "3",
            "$\\frac{1}{3}$",
            "-3",
            "$-1$",
            "12"
        ],
        "answerIndex": 2,
        "answerExplanation": "To find the gradient $m$ of a straight line passing through two points $(x_1, y_1)$ and $(x_2, y_2)$, use the formula $m = \\\\frac{y_2 - y_1}{x_2 - x_1}$.\\n\\nLet $(x_1, y_1) = (-3, 5)$ and $(x_2, y_2) = (1, -7)$.\\n\\n$m = \\\\frac{-7 - 5}{1 - (-3)} = \\\\frac{-12}{1 + 3} = \\\\frac{-12}{4} = -3$.",
        "questionType": "2"
    },
    {
        "question": "Given set $P = \\\\{a, b\\\\}$ and set $Q = \\\\{1, 2, 3\\\\}$, which of the following represents the Cartesian product $P \\\\times Q$?",
        "options": [
            "$\\\\{ (1,a), (2,a), (3,a), (1,b), (2,b), (3,b) \\\\}$",
            "$\\\\{ (a,1), (a,2), (a,3), (b,1), (b,2), (b,3) \\\\}$",
            "$\\\\{ a, b, 1, 2, 3 \\\\}$",
            "$\\\\{ (a,a), (b,b), (1,1), (2,2), (3,3) \\\\}$",
            "$\\\\{ (a,b), (1,2), (2,3) \\\\}$"
        ],
        "answerIndex": 1,
        "answerExplanation": "The Cartesian product $P \\\\times Q$ is the set of all possible ordered pairs where the first element comes from set $P$ and the second from set $Q$. Pairing each element of $P=\\\\{a, b\\\\}$ with each element of $Q=\\\\{1, 2, 3\\\\}$ gives $\\\\{(a,1), (a,2), (a,3), (b,1), (b,2), (b,3)\\\\}$.",
        "questionType": "3"
    },
    {
        "question": "A circle has its centre at $(-2, 5)$ and a radius of $6$. What is its Cartesian equation?",
        "options": [
            "$(x+2)^2 + (y-5)^2 = 6$",
            "$(x-2)^2 + (y+5)^2 = 36$",
            "$(x-2)^2 + (y+5)^2 = 6$",
            "$(x+2)^2 + (y-5)^2 = 12$",
            "$(x+2)^2 + (y-5)^2 = 36$"
        ],
        "answerIndex": 4,
        "answerExplanation": "The standard Cartesian equation of a circle with centre $(a,b)$ and radius $r$ is $(x-a)^2 + (y-b)^2 = r^2$.\\n\\nGiven the centre is $(-2,5)$, we have $a=-2$ and $b=5$. The radius is $r=6$.\\n\\nSubstituting these values: $(x - (-2))^2 + (y - 5)^2 = 6^2$, which simplifies to $(x+2)^2 + (y-5)^2 = 36$.",
        "questionType": "2"
    },
    {
        "question": "Consider the equation $\\\\frac{(x+3)^2}{16} - \\\\frac{(y-2)^2}{25} = 1$. Which type of conic section does this equation represent?",
        "options": [
            "Circle",
            "Ellipse",
            "Parabola",
            "Hyperbola",
            "Straight Line"
        ],
        "answerIndex": 3,
        "answerExplanation": "The note states that the standard form equation for a hyperbola has a minus sign between the squared terms (e.g., $\\\\frac{(x-a)^2}{r^2} - \\\\frac{(y-b)^2}{s^2} = 1$). An ellipse, in contrast, has a plus sign between the squared terms. The given equation, with its minus sign, correctly identifies it as a hyperbola.",
        "questionType": "1"
    }
]

type StepSection = "number" | "subject-level" | "subject" | "topic" | "detailed-topic";

export default function QuizMakerPage () {
   const [stepSections, setStepSections] = useState<StepSection>("number");
   const [subjectLevel, setSubjectLevel] = useState<string>('National 5');
   const [subject, setSubject] = useState<string>('Math');
   const [topic, setTopic] = useState<string>('');
   const [numQuestions, setNumQuestions] = useState<string>('5');
   const [canGenerateQuiz, setCanGenerateQuiz] = useState<boolean>(false);
   const [aiQuiz, setAiQuiz] = useState<Quiz | null>(null);
   const [detailedTopic, setDetailedTopic] = useState('');

   const { showModal, close } = useModal();
   const { openSplash, closeSplash } = useSplashScreen();

   useEffect(() => {
      setCanGenerateQuiz((subject !== "" && subjectLevel !== ""));
   }, [subject, subjectLevel])

   useEffect(() => {
      setTopic('');
   }, [subject, subjectLevel])

   function handleLoadingCreateQuiz () {
      openSplash({
         title: <>Creating Quiz <CustomSpinner color="#000" size={20} /></>,
         description: `Please wait while I create your quiz for ${subjectLevel} ${subject}${topic?` ${topic}`:''}...`,
         style: "loading",
         actions: []
      })
   }

   const createQuizAI = async (callback: Function) => {
      handleLoadingCreateQuiz();
      const data = await generateUsingAi({
         prompt: quizMakerPrompt({ subjectLevel, subject, subjectTopic: topic, numberOfQuestions: parseInt(numQuestions) }),
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

   return (
      <AppWrapper noNavbar={aiQuiz !== null && aiQuiz !== undefined}>
         {(aiQuiz == null) && (<>
            <div className="box full h-full pd-15 dfb column align-center">
               <div className="text-l full bold-700 text-center accent-color-gradient-text">START A QUIZ</div>
               <div className="text-xxxs full text-center">For each correct answer, you get <b className="accent-color">5</b> points</div>
               
               {(stepSections == "number") && (
                  <FullSelect
                     title="Choose Number of Questions"
                     description="More questions takes a longer time to generate quiz"
                     options={["5","10","15","20"].map(n => ({ option: n, optionName: n }))}
                     onSelect={(option) => {
                        setNumQuestions(option.optionName)
                        setStepSections("subject-level")
                     }}
                     defaultOption={0}
                  />
               )}
               
               {(stepSections == "subject-level") && (
                  <FullSelect
                     title="Choose Subject Level"
                     options={subjectLevels.map(n => ({ option: n, optionName: n }))}
                     onSelect={(option) => {
                        setSubjectLevel(option.optionName)
                        setStepSections("subject")
                     }}
                     backButton={() => setStepSections("number")}
                  />
               )}
               
               {(stepSections == "subject") && (
                  <FullSelect
                     title="Choose Subject"
                     options={subjects.map(n => ({ option: n, optionName: n }))}
                     onSelect={(option) => {
                        setSubject(option.optionName)
                        setStepSections("topic")
                     }}
                     backButton={() => setStepSections("subject-level")}
                  />
               )}
               
               {(stepSections == "topic") && (
                  <FullSelect
                     title="Choose Subject Topic (optional)"
                     options={retrieveSubjectTopic(subjectLevel, subject)!.map(n => ({ option: n, optionName: n }))}
                     onSelect={(option) => {
                        setTopic(option.optionName)
                        setStepSections("detailed-topic")
                     }}
                     backButton={() => setStepSections("subject")}
                  />
               )}
               
               {(stepSections == "detailed-topic") && (
                  <div className="box full pd-2">
                     <div className="box full pd-1">
                        <div className="text-sm bold-600 full text-center">Detailed Topic (optional)</div>
                        <div className="text-xxs full grey-5 pd-1 text-center mb-1">
                           Enter the exact thing you want to learn from this quiz, "I want to learn..."
                        </div>
                        <textarea 
                           className="xxs pd-15 pdx-2 full h-20 radius-15"
                           value={detailedTopic} onChange={e => setDetailedTopic(e.target.value)}
                        />
                     </div>
                     <Spacing size={3} />
                     {(canGenerateQuiz) && <AwaitButton className="xxs full pd-14 tiny-shadow" onClick={createQuizAI}>
                        <BookCheck size={17} /> Create Quiz
                     </AwaitButton>}
                  </div>
               )}
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