'use client'
import "./QuizBarChart.css"
import { CSSProperties } from "react";
import Card from "../Card/Card";

type QuizBarChartProps = {
   color: string;
   data: any[];
   subject: string;
   barDataKey: string;
   labelDataKey?: string;
}

export default function QuizBarChart ({ color, data, subject, barDataKey, labelDataKey }: QuizBarChartProps) {
   const chartCardStyles: CSSProperties = {
      padding: "20px", width: "100%",
      borderColor: color
   }

   return (
      <Card styles={chartCardStyles}>
         <div className="text-m full bold-700 mb-1">{subject} Quiz Scores</div>
         <div className="quiz-bar-chart">
            {data.map((dataItem, index) => (
               <div className="bar-wrapper" key={index}>
                  <div className="bar" style={{
                     height:`${dataItem[barDataKey]}%`,
                     background: color,
                     color: `${parseInt(`${dataItem[barDataKey]}`) > 15 ? 'white' : 'black'}`
                  }}>
                     <span className="score">
                        {(labelDataKey) ? <>
                           {dataItem[labelDataKey]}
                        </> : <>{dataItem[barDataKey]}%</>}
                     </span>
                  </div>
               </div>
            ))}
         </div>
      </Card>
   )
}
