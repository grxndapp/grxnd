'use client'
import "./ProgressBar.css"

export default function ProgressBar ({ percentage, color }: { percentage: number, color?: string }) {
   return (
      <div className="progress-bar">
         <div className="progress" style={{ width: `${percentage}%`, backgroundColor: color ?? "var(--accent-color)" }} />
      </div>
   )
}
