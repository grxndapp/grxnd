'use client'
import Card from "@/components/Card/Card"
import ProgressRing from "@/components/ProgressRing/ProgressRing"
import Spacing from "@/components/Spacing/Spacing"
import { LabReportCriteriaCardStyles } from "@/styles-extra/styles"

export default function LabReport ({ labReportGrade }: { labReportGrade: LabGradeReport }) {
   const criteriaColours = {
      scientific_understanding: "#0e7b58",
      method: "#0e417b",
      results_and_analysis: "#b60e57", 
      conclusion: "#581e96",
      evaluation: "#a27713"
   }

   return (
      <div className="box full dfb column gap-30">
         <div className="box full dfb column gap-10">
            <div className="text-m bold-700 full accent-color-gradient-text">Overall Score</div>
            <ProgressRing
               progress={labReportGrade.overall_score*10}
               color={"#1121ff"}
            />
            <div className="text-xs full mt-2">{labReportGrade.grading_basis}</div>
            <div className="text-xs full">{labReportGrade.comments}</div>
         </div>

         <div className="box full dfb column gap-10">
            <div className="text-m bold-700 full accent-color-gradient-text">Criteria</div>
            <div className="box full dfb wrap gap-10">
               <Card styles={LabReportCriteriaCardStyles}>
                  <div className="text-l bold-800 full" style={{ color: criteriaColours['scientific_understanding'] }}>{labReportGrade.criteria.scientific_understanding.score*10}%</div>
                  <div className="text-s bold-700 full pd-05" style={{ color: criteriaColours['scientific_understanding'] }}>Scientific Understanding</div>
                  <div className="text-xxs full line-height-17">{labReportGrade.criteria.scientific_understanding.reason}</div>
               </Card>
               <Card styles={LabReportCriteriaCardStyles}>
                  <div className="text-l bold-800 full" style={{ color: criteriaColours['method'] }}>{labReportGrade.criteria.method.score*10}%</div>
                  <div className="text-s bold-700 full pd-05" style={{ color: criteriaColours['method'] }}>Method</div>
                  <div className="text-xxs full line-height-17">{labReportGrade.criteria.method.reason}</div>
               </Card>
               <Card styles={LabReportCriteriaCardStyles}>
                  <div className="text-l bold-800 full" style={{ color: criteriaColours['results_and_analysis'] }}>{labReportGrade.criteria.results_and_analysis.score*10}%</div>
                  <div className="text-s bold-700 full pd-05" style={{ color: criteriaColours['results_and_analysis'] }}>Results And Analysis</div>
                  <div className="text-xxs full line-height-17">{labReportGrade.criteria.results_and_analysis.reason}</div>
               </Card>
               <Card styles={LabReportCriteriaCardStyles}>
                  <div className="text-l bold-800 full" style={{ color: criteriaColours['conclusion'] }}>{labReportGrade.criteria.conclusion.score*10}%</div>
                  <div className="text-s bold-700 full pd-05" style={{ color: criteriaColours['conclusion'] }}>Conclusion</div>
                  <div className="text-xxs full line-height-17">{labReportGrade.criteria.conclusion.reason}</div>
               </Card>
               <Card styles={LabReportCriteriaCardStyles}>
                  <div className="text-l bold-800 full" style={{ color: criteriaColours['evaluation'] }}>{labReportGrade.criteria.evaluation.score*10}%</div>
                  <div className="text-s bold-700 full pd-05" style={{ color: criteriaColours['evaluation'] }}>Evaluation</div>
                  <div className="text-xxs full line-height-17">{labReportGrade.criteria.evaluation.reason}</div>
               </Card>
            </div>
         </div>

         <div className="box full dfb column gap-10">
            <div className="text-m bold-700 full accent-color-gradient-text">Strengths</div>
            <div className="box full dfb column gap-10">
               {labReportGrade.strengths.map((strength, index) => (
                  <div key={index} className="text-xs full line-height-15">{strength}</div>
               ))}
            </div>
         </div>

         <div className="box full dfb column gap-10">
            <div className="text-m bold-700 full accent-color-gradient-text">Improvements</div>
            <div className="box full dfb column gap-10">
               {labReportGrade.improvements.map((improvement, index) => (
                  <div key={index} className="box full">
                     <div className="text-xs bold-600 full">{improvement.title}</div>
                     <div className="text-xxs full line-height-15">{improvement.improvement}</div>
                  </div>
               ))}
            </div>
         </div>

         <Spacing size={4} />
      </div>
   )
}
