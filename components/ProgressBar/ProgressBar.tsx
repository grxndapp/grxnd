'use client'
import "./ProgressBar.css"

export default function ProgressBar ({ percentage }: { percentage: number }) {
   return (
      <div className="progress-bar">
         <div className="progress" style={{ width: `${percentage}%` }} />
      </div>
   )
}
