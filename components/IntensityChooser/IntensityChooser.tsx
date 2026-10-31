"use client";
import "./IntensityChooser.css";
import { useState } from "react";

type IntensityOption = {
   icon: React.ReactNode;
   description: string;
   name: any;
   nameLabel: string;
}

type IntensityChooserProps = {
   title: string;
   options: IntensityOption[];
   onChange: (value: any) => void;
   defaultOption?: number;
}

export default function IntensityChooser ({ title, options, onChange, defaultOption }: IntensityChooserProps) {
   const [selectedIndex, setSelectedIndex] = useState(defaultOption ?? 0);

   function handleChooseOption(index: number) {
      setSelectedIndex(index);
      onChange(options[index].name);
   }

   return (
      <div className="intensity-chooser">
         <div className="text-sm full bold-700 accent-color-gradient-text">{title}</div>
         <div className="text-xs full pd-05 mb-05">{options[selectedIndex].description}</div>
         <div className="intensity-chooser-items">
            {options.map((option, index) => (
               <div className={`intensity-option ${index==selectedIndex&&'selected'}`} key={index} onClick={() => handleChooseOption(index)}>
                  {option.icon}
                  <div className="text-xxxs full text-center bold-600">{option.nameLabel}</div>
               </div>
            ))}
         </div>
      </div>
   );
}
