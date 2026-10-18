'use client'
import "./QuizBarChart.css"

type QuizBarChartProps = {
   percentages: number[];
   height?: number;
   color?: string;
};

export default function QuizBarChart ({ percentages, height = 220, color = '#FF8B4A' }: QuizBarChartProps) {
   return (
      <div className="percentage-bar-chart" style={{ height: `${height}px` }}>
         {percentages.map((percentage, index) => {
            const value = Math.min(100, Math.max(0, percentage));
            return (
               <div className="percentage-bar-track" key={index}>
                  <div className="percentage-bar-fill" style={{ height: `${value}%`, backgroundColor: color }}>
                     <span className="percentage-bar-label">{value}%</span>
                  </div>
               </div>
            );
         })}
      </div>
   );
}
