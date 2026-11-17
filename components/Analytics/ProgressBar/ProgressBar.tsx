"use client"
import "./ProgressBar.css"
import { ReactNode } from "react";

type ProgressBarProps = {
   percentage: number;
   children?: ReactNode;
   label?: ReactNode | string;
}

export default function ProgressBar({ percentage, label, children }: ProgressBarProps) {
   return (
      <div className="progress-bar">
         <div className="label">
            {(children ?? label) || 'Unlabelled'} <b>({percentage.toFixed(1)}%)</b>
         </div>
         { percentage > 0 ? <div className="progress" style={{ width: `${percentage}%` }}></div> : <></> }
      </div>
   )
}
