'use client'
import "./FullSelect.css"
import { ArrowLeft, CircleCheck } from "lucide-react";
import { toast } from "sonner";
import React, { useState } from "react";

type FullSelectOption = {
   optionName: string;
   option: string | React.ReactNode;
}

type FullSelectProps = {
   title: string;
   description?: string;
   options: FullSelectOption[];
   onSelect: (option: FullSelectOption) => void;
   defaultOption?: number;
   backButton?: () => void;
}

export default function FullSelect ({ title, description, options, onSelect, defaultOption, backButton }: FullSelectProps) {
   const [pendingOption, setPendingOption] = useState(defaultOption ?? -1);
   const [optionChosen, setOptionChosen] = useState(-1);

   function selectOption (index: number) {
      setPendingOption(index);
   }

   function chooseOption () {
      if (pendingOption < 0) {
         toast.error("Please choose an option")
      } else {
         setOptionChosen(pendingOption);
         onSelect(options[pendingOption]);
      }
   }

   return (
      <div className="full-select">
         <div className="box full pdx-2">
            <div className="text-sm bold-600 full text-center">{title}</div>
            <div className="text-xxxs pd-05 grey-5 full text-center">{description ?? ''}</div>
         </div>
         <div className="full-select-options">
            {options.map((option, index) => (
               <div 
                  key={index} 
                  className={`full-select-option ${pendingOption == index ? 'selected' : ''}`}
                  onClick={() => selectOption(index)}
               >
                  <div className="text-xs full">
                     {option.option}
                  </div>
               </div>
            ))}
         </div>
         <div className="full-select-choice-btn">
            <button className="xxs pd-13 full mw-500 radius-20" onClick={chooseOption}>
               <CircleCheck size={18} /> Choose
            </button>
            {(backButton) && <button className="xxs pd-13 full mw-500 radius-20 outline-black" onClick={backButton}>
               <ArrowLeft size={18} /> Back
            </button>}
         </div>
      </div>
   )
}
