'use client'
import './ProgressRing.css'

export default function ProgressRing({ progress, color }: { progress: number, color: string }) {
   return (
      <div className="progress-ring">
         <svg className="progress-ring__svg" width="120" height="120">
            <circle className="progress-ring__bg" cx="60" cy="60" r="54" />
            <circle style={{
               stroke: color,
               strokeDashoffset: `calc(339.292 - (339.292 * ${progress} / 100))`
            }} className="progress-ring__progress" cx="60" cy="60" r="54" />
         </svg>
         <div className="progress-ring__text">{Math.round(progress)}%</div>
      </div>
   )
}
