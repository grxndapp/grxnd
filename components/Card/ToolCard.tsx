'use client'
import './Card.css'
import { ReactNode } from 'react';

type ToolCardProps = {
   idClassName: string;
   children: ReactNode;
   onClick: () => void;
}

export default function ToolCard ({ idClassName, children, onClick }: ToolCardProps) {
   return (
      <div className={`tool-card ${idClassName}`} onClick={onClick}>
         {children}
      </div>
   )
}
