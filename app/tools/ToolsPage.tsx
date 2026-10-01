'use client'
import { ArrowRight, ClipboardCheck, Feather, NotebookPen, Puzzle } from "lucide-react"
import { useRouter } from "next/navigation"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Spacing from "@/components/Spacing/Spacing"
import ToolCard from "@/components/Card/ToolCard"

export default function ToolsPage() {
   const router = useRouter();

   const tools = [
      {
         title: 'Note Maker',
         icon: NotebookPen,
         description: 'Turn topics into concise, easy-to-read notes for faster learning.',
         buttonLabel: <>Start Creating Notes <ArrowRight size={18} /></>,
         href: '/note-maker'
      },
      {
         title: 'Quiz Maker',
         icon: Puzzle,
         description: 'Generate custom quizzes to test your knowledge and sharpen understanding.',
         buttonLabel: <>Generate Quiz <ArrowRight size={18} /></>,
         href: '/quiz-maker'
      },
      {
         title: 'Essay Grader',
         icon: ClipboardCheck,
         description: 'It grades and evaluate essays with AI, giving instant feedback and suggestions for improvement.',
         buttonLabel: <>Grade Essay <ArrowRight size={18} /></>,
         href: '/essay-grader'
      },
      {
         title: 'Human Writer',
         icon: Feather,
         description: 'It writes your essay using AI and humanizes it for you',
         buttonLabel: <>Begin Writing <ArrowRight size={18} /></>,
         href: '/human-writer'
      },
   ]

   return (
      <AppWrapper>
         <div className="text-xxl bold-700 full dfb align-center justify-center gap-7 mb-2">
            AI Tools
         </div>
         <div className="box full h-fit pdx-15 dfb column gap-15">
            {tools.map((tool, index) => (
               <ToolCard key={index} idClassName={tool.title.toLowerCase().replaceAll(" ","-")} onClick={() => router.push(tool.href)}>
                  <div className="icon"><tool.icon size={17} /></div>
                  <div className="tool-content">
                     <div className="text-m bold-700 pd-1">{tool.title}</div>
                     <div className="text-xxs grey-5 mb-1">{tool.description}</div>
                  </div>
               </ToolCard>
            ))}
            <Spacing size={3} />
         </div>
      </AppWrapper>
   )
}