'use client'
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

const aq = [
    {
        "question": "What does a horizontal asymptote describe about a function's graph?",
        "options": [
            "The point where the graph crosses the $y$-axis.",
            "The behaviour of the graph as $x$ approaches a specific finite value.",
            "The behaviour of the graph as $x$ tends towards positive or negative infinity.",
            "The vertical lines that the function's graph approaches.",
            "The maximum or minimum turning points of the function."
        ],
        "answerIndex": 2,
        "answerExplanation": "A horizontal asymptote is a horizontal line $y=L$ that the graph of a function $f(x)$ approaches as $x$ tends towards positive infinity ($x \\to \\infty$) or negative infinity ($x \\to -\\infty$). It describes the function's 'end behaviour'.",
        "questionType": "3"
    },
    {
        "question": "For the rational function $f(x) = \\frac{2x + 5}{x^2 - 3x + 1}$, what is its horizontal asymptote?",
        "options": [
            "$y = 0$",
            "$y = 2$",
            "$y = 5$",
            "There is no horizontal asymptote.",
            "$y = 1$"
        ],
        "answerIndex": 0,
        "answerExplanation": "To find the horizontal asymptote of a rational function, compare the degrees of the numerator and the denominator.\n\n1. The degree of the numerator ($2x+5$) is $1$.\n2. The degree of the denominator ($x^2-3x+1$) is $2$.\n\nSince the degree of the numerator (1) is less than the degree of the denominator (2), the horizontal asymptote is $y=0$.",
        "questionType": "2"
    },
    {
        "question": "Determine the horizontal asymptote of the function $g(x) = \\frac{6x^2 - 4x + 2}{3x^2 + 7}$.",
        "options": [
            "$y = 0$",
            "$y = 6$",
            "$y = \\frac{1}{2}$",
            "There is no horizontal asymptote.",
            "$y = 2$"
        ],
        "answerIndex": 4,
        "answerExplanation": "To find the horizontal asymptote of a rational function, compare the degrees of the numerator and the denominator.\n\n1. The degree of the numerator ($6x^2-4x+2$) is $2$.\n2. The degree of the denominator ($3x^2+7$) is $2$.\n\nSince the degrees are equal, the horizontal asymptote is the ratio of the leading coefficients.\n\nLeading coefficient of numerator is $6$.\nLeading coefficient of denominator is $3$.\n\nTherefore, the horizontal asymptote is $y = \\frac{6}{3} = 2$.",
        "questionType": "2"
    },
    {
        "question": "Which of the following rational functions has no horizontal asymptote?",
        "options": [
            "$f(x) = \\frac{x^2 - 1}{x^3 + 2}$",
            "$g(x) = \\frac{x^3 + 2x - 1}{x^2 + 5}$",
            "$h(x) = \\frac{4x^2 + 3}{2x^2 - 1}$",
            "$k(x) = \\frac{5x}{x^2 + 1}$",
            "$m(x) = \\frac{7x^4 - 2x}{x^4 + 3x^2}$"
        ],
        "answerIndex": 1,
        "answerExplanation": "A rational function has no horizontal asymptote if the degree of the numerator is greater than the degree of the denominator.\n\n- For $f(x)$, degree of numerator (2) < degree of denominator (3), so $y=0$.\n- For $g(x)$, degree of numerator (3) > degree of denominator (2), so there is no horizontal asymptote.\n- For $h(x)$, degree of numerator (2) = degree of denominator (2), so $y = \\frac{4}{2} = 2$.\n- For $k(x)$, degree of numerator (1) < degree of denominator (2), so $y=0$.\n- For $m(x)$, degree of numerator (4) = degree of denominator (4), so $y = \\frac{7}{1} = 7$.",
        "questionType": "1"
    },
    {
        "question": "Consider the function $f(x) = 3 + e^{x}$. Which of the following statements about its horizontal asymptotes is correct?",
        "options": [
            "It has a horizontal asymptote at $y=3$ as $x \\to \\infty$.",
            "It has no horizontal asymptotes.",
            "It has two horizontal asymptotes: $y=3$ as $x \\to -\\infty$ and $y=\\infty$ as $x \\to \\infty$.",
            "It has a horizontal asymptote at $y=3$ as $x \\to -\\infty$.",
            "It has a horizontal asymptote at $y=0$ as $x \\to -\\infty$."
        ],
        "answerIndex": 3,
        "answerExplanation": "To find horizontal asymptotes, we evaluate the limits as $x \\to \\infty$ and $x \\to -\\infty$.\n\n1. As $x \\to \\infty$:\n$$\\lim_{x \\to \\infty} (3 + e^x) = 3 + \\lim_{x \\to \\infty} e^x$$\n\nSince $\\lim_{x \\to \\infty} e^x = \\infty$, the limit is $3 + \\infty = \\infty$. Therefore, there is no horizontal asymptote as $x \\to \\infty$.\n\n2. As $x \\to -\\infty$:\n$$\\lim_{x \\to -\\infty} (3 + e^x) = 3 + \\lim_{x \\to -\\infty} e^x$$\n\nSince $\\lim_{x \\to -\\infty} e^x = 0$, the limit is $3 + 0 = 3$. Therefore, there is a horizontal asymptote at $y=3$ as $x \\to -\\infty$.",
        "questionType": "1"
    }
]

export default function QuizMakerPage () {
   const [stepSections, setStepSections] = useState<StepSection>("subject");
   const [subjectLevel, setSubjectLevel] = useState<string>('');
   const [subject, setSubject] = useState<string>('');
   const [topic, setTopic] = useState<string>('');
   const [detailedTopic, setDetailedTopic] = useState('');
   const [numQuestions, setNumQuestions] = useState<string>('5');
   const [aiQuiz, setAiQuiz] = useState<Quiz | null>(null);
   const [quizStyle, setQuizStyle] = useState<QuizStyle>("mixture");

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