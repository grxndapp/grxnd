'use client'
import { ClipboardCheck, NotebookPen, Puzzle } from "lucide-react"
import { useRouter } from "next/navigation"
import { AiToolsCardStyles, ToolIconBubbleStyles } from "@/styles-extra/styles"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Spacing from "@/components/Spacing/Spacing"
import Card from "@/components/Card/Card"

export default function ToolsPage() {
   const router = useRouter();

   const tools = [
      // {
      //    title: 'Super Teacher',
      //    icon: NotebookPen,
      //    description: 'Learn anything from just a single sentence, file or image.',
      //    buttonLabel: <>Learn Anything <ArrowRight size={18} /></>,
      //    href: '/note-maker'
      // },
      {
         title: 'Make New Note',
         icon: NotebookPen,
         description: 'Turn topics into concise, easy-to-read notes for faster learning.',
         href: '/note-maker',
         color: '#ffd1b6'
      },
      {
         title: 'Start New Quiz',
         icon: Puzzle,
         description: 'Generate custom quizzes to test your knowledge and sharpen understanding.',
         href: '/quiz-maker',
         color: '#afe996'
      },
      {
         title: 'Grade an Essay',
         icon: ClipboardCheck,
         description: 'It grades and evaluate essays with AI, giving instant feedback and suggestions for improvement.',
         href: '/essay-grader',
         color: '#ffaaca'
      },
   ]

   return (
      <AppWrapper>
         <div className="box full pd-2">
            <div className="text-xxl full pd-15 bold-600">AI Assist</div>
            <div className="box full dfb wrap gap-10">
               {tools.map(tool => (
                  <Card key={tool.href} styles={AiToolsCardStyles} onClick={() => router.push(tool.href)}>
                     <div style={{ ...ToolIconBubbleStyles, background: tool.color }}>
                        <tool.icon size={20} />
                     </div>
                     <div className="text-s bold-500">{tool.title}</div>
                     <div className="text-xxs grey-5">{tool.description}</div>
                  </Card>
               ))}
            </div>
            <Spacing size={5} />
         </div>
      </AppWrapper>
   )
}