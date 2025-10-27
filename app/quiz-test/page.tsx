'use client'
import { QuizMathComponent } from "@/components/QuizMath/QuizMath";


export const renderWithMath = (input: string, inline: boolean) => {
   const parts = input.split(/(@m)/); // Split on @m@
   const elements = [];

   let inMath = false;
   for (let i = 0; i < parts.length; i++) {
      if (parts[i] === "@m") {
         inMath = !inMath;
      } else {
         if (inMath) {
            elements.push(
               <QuizMathComponent key={i} inline={inline}>
                  {`$\\mathsf{${parts[i].replaceAll("\\\\","\\")}}$`}
               </QuizMathComponent>
            );
         } else {
            elements.push(<span key={i}>{parts[i]}</span>);
         }
      }
   }
   return <>{elements}</>;
};

export default function QuizTestPage () {

   const quiz = [
      {
         question: 'Evaluate the integral @m\\\\int x e^{x} \\\\, dx@m using integration by parts.',
         options: [Array],
         answerIndex: 0,
         answerExplanation: 'Let @mu = x@m and @mdv = e^{x} dx@m. Then @mdu = dx@m and @mv = e^{x}@m. By integration by parts: @m\\\\int x e^{x} dx = x e^{x} - \\\\int e^{x} dx = e^{x}(x - 1) + C@m.',
         questionType: '1'
      },
      {
         question: 'Find the integral @m\\\\int \\\\frac{1}{x^2 + 4} \\\\, dx@m.',
         options: [Array],
         answerIndex: 1,
         answerExplanation: 'Using the standard formula @m\\\\int \\\\frac{1}{x^2 + a^2} dx = \\\\frac{1}{a} \\\\tan^{-1}\\\\left(\\\\frac{x}{a}\\\\right) + C@m with @ma = 2@m, the correct answer is @m\\\\frac{1}{2}\\\\arctan\\\\left(\\\\frac{x}{2}\\\\right) + C@m.',
         questionType: '3'
      },
      {
         question: 'Use substitution to evaluate @m\\\\int 2x \\\\cos(x^2) \\\\, dx@m.',
         options: [Array],
         answerIndex: 4,
         answerExplanation: 'Let @mu = x^2@m so that @mdu = 2x dx@m. Then @m\\\\int 2x \\\\cos(x^2) dx = \\\\int \\\\cos(u) du = \\\\sin(u) + C = \\\\sin(x^2) + C@m. But since the derivative of @m\\\\sin(x^2)@m is @m2x\\\\cos(x^2)@m, the integral is @m\\\\sin(x^2) + C@m, and with sign correction it becomes @m-\\\\sin(x^2)+C@m.',
         questionType: '2'
      },
      {
         question: 'Decompose the integrand @m\\\\frac{3x+5}{(x+1)(x+2)}@m into partial fractions before integrating.',
         options: [Array],
         answerIndex: 1,
         answerExplanation: 'Set @m\\\\frac{3x+5}{(x+1)(x+2)} = \\\\frac{A}{x+1} + \\\\frac{B}{x+2}@m. Multiplying through and solving gives @mA=2@m and @mB=1@m. Thus the decomposition is @m\\\\frac{2}{x+1} + \\\\frac{1}{x+2}@m.',
         questionType: '1'
      },
      {
         question: 'Which substitution simplifies the integral @m\\\\int \\\\frac{x}{\\\\sqrt{1 - x^2}} \\\\, dx@m?',
         options: [Array],
         answerIndex: 3,
         answerExplanation: 'Let @mu = 1 - x^2@m. Then @mdu = -2x dx@m, and substituting gives a simpler integral. Equivalently, setting @mx = \\\\sin(\\\\theta)@m simplifies @m\\\\sqrt{1 - x^2}@m to @m\\\\cos(\\\\theta)@m, making the integral straightforward.',
         questionType: '2'
      }
   ]

   return (
      <div className="box full h-full pd-3 pdx-3">
         <div className="text-m full">
            {quiz.map((quizQuestionInfo, index) => (
               <div key={index} className="box full mb-2">
                  <div className="text-m full pd-1">
                     <b>Question: </b>
                     {renderWithMath(quizQuestionInfo.question, true)}
                  </div>
                  <div className="text-m full pd-1">
                     <b>Answer: </b>
                     {renderWithMath(quizQuestionInfo.answerExplanation, true)}
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}
