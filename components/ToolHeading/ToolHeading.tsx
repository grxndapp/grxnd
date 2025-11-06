'use client'
import './ToolHeading.css'
import { ReactNode } from 'react';
import { BookCheck, ClipboardCheck, Drama, NotebookPen, UserRoundPen } from 'lucide-react';

type ToolHeadingProps = {
   title: string;
   description: string;
   idClassName: string;
}

export default function ToolHeading ({ title, description, idClassName }: ToolHeadingProps) {
   const headingIconsSize = 16;
   const headingIcons: Record<string, ReactNode> = {
      "essay-grader": <ClipboardCheck size={headingIconsSize} />,
      "human-writer": <UserRoundPen size={headingIconsSize} />,
      "note-maker": <NotebookPen size={headingIconsSize} />,
      "quiz-maker": <BookCheck size={headingIconsSize} />,
      "imposter": <Drama size={headingIconsSize} />,
   }

   return (
      <div className='box full dfb column'>
         <div className={`tool-headline ${idClassName}`}>
            <div className="icon">
               {headingIcons[idClassName]}
            </div>
            <div className="title">{title}</div>
         </div>
         <div className="text-xxs pd-1 grey-4 text-center full">{description}</div>
      </div>
   )
}
