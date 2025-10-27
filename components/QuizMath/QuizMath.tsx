import { MathJax, MathJaxContext } from 'better-react-mathjax'
import { ReactNode } from 'react'

const mathJaxConfig = {
   loader: { load: ["input/tex", "output/chtml"] },
   chtml: {
      matchFontHeight: true,
      scale: 0.9
   },
   tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: []
   },
   options: {
      displayAlign: 'left'
   }
}

const mathJaxConfigQuiz = {
   loader: { load: ["input/tex", "output/chtml"] },
   chtml: {
      matchFontHeight: true,
      scale: 0.8
   },
   tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: []
   },
   options: {
      displayAlign: 'left'
   }
}

export default function MathComponent({children}:{children:ReactNode}) {
   return <MathJaxContext config={mathJaxConfig}>
      <MathJax>{children}</MathJax>
   </MathJaxContext>
}

export function QuizMathComponent({children,inline}:{children:ReactNode,inline:boolean}) {
   return <MathJaxContext config={mathJaxConfigQuiz}>
      <MathJax inline={inline}>{children}</MathJax>
   </MathJaxContext>
}
