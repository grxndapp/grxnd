'use client'
import './StudyMethodCard.css'
import { JSX } from "react";

type StudyMethodCardProps = {
   icon: JSX.Element;
   title: string;
   onClick?: () => void;
   description?: string;
}

export default function StudyMethodCard ({ icon, title, description, onClick }: StudyMethodCardProps) {
   function handleClick () {
      if (onClick) onClick();
   }

   return (
      <div className="study-method-card" onClick={handleClick}>
         <div className="study-method-icon">{icon}</div>
         <div className="study-method-name text-sm accent-color-gradient-dark-text">{title}</div>
         {description && <div className="study-method-description">{description}</div>}
      </div>
   )
}
