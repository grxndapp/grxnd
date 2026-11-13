'use client'
import { useState } from "react";
import { generateUsingAi } from "../actions/ai";
import { toast } from "sonner";
import { FilePen, RotateCcw } from "lucide-react";
import { formatNumber } from "@/utils/num";
import { useSplashScreen } from "@/components/SplashScreen/SplashScreenContext";
import { useUser } from "@/hooks/useUser";
import { ResponseFormats } from "@/prompts/responseFormats";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Spacing from "@/components/Spacing/Spacing";
import essayGraderPrompt from "@/prompts/essayGrader";
import EssayGradingFeedback from "@/components/EssayGradingFeedback/EssayGradingFeedback";
import AwaitButton from "@/components/AwaitButton/AwaitButton";


export default function EssayGraderPage () {
   const { user } = useUser();
   const { openSplash, closeSplash } = useSplashScreen();

   const [question, setQuestion] = useState('');
   const [actualUserEssay, setActualUserEssay] = useState('');
   const [essayGradeReport, setEssayGradeReport] = useState<EssayGradeReport | null>(null);
   const maxlength = 20000;

   function handleLoadingCreateEssay () {
		openSplash({
			title: <>Grading Essay</>,
			description: <>{user?.name}, your essay is being graded...</>,
			style: "english",
			actions: []
		})
   }

   const handleCreateEssayGradingReport = async (callback: Function) => {
      if (actualUserEssay.trim() == "") {
         toast.error("Please enter an essay")
         callback();
         return;
      }
      if (actualUserEssay.length > maxlength) {
         toast.error("Essay is too long")
         callback();
         return;
      }
		handleLoadingCreateEssay();
      try {
         const data = await generateUsingAi({
            prompt: essayGraderPrompt(question, actualUserEssay),
            responseFormat: ResponseFormats.EssayGrader,
         })
         if (data.success == false) {
            openSplash({
               title: "Error",
               description: data.error,
               style: "error",
               actions: [
                  {
                     appearance: "normal",
                     action: () => closeSplash(),
                     label: <><RotateCcw size={18} /> Try Again</>
                  }
               ],
            })
            callback()
            return;
         }
         console.log(data.data)
         setEssayGradeReport(data.data);
      } catch (err) {
			openSplash({
				title: "Error",
				description: "Something happened, an error occurred!",
				style: "error",
				actions: [
					{
						appearance: "normal",
						action: () => closeSplash(),
						label: <><RotateCcw size={18} /> Try Again</>
					}
				],
			})
			callback()
			return;
      }
   }

   return (
      <AppWrapper>
         <div className="box full h-full">
            {essayGradeReport && (<>
               <div className="text-xxl bold-800 full accent-color-gradient-dark-text mb-1">Essay Grader</div>
               <EssayGradingFeedback essayText={actualUserEssay} essayFeedback={essayGradeReport} />
            </>)}
         
            {(essayGradeReport == null) && (<>
               <div className="text-xxl bold-800 full accent-color-gradient-dark-text">Essay Grader</div>
               <div className="text-xs mb-1">Enter your essay below, you can add the essay question but its optional</div>
               <div className="box full h-fit mt-1">
                  <div className="box full pd-1">
                     <textarea 
                        name="essay-question" 
                        id="essay-question" 
                        className="xs pd-2 pdx-2 full h-15 radius-20"
                        placeholder="Enter Essay Question (optional)"
                        onChange={(e) => setQuestion(e.target.value)}
                        value={question}
                     />
                  </div>

                  <div className="box full pd-1">
                     <textarea 
                        name="essay" 
                        id="essay" 
                        className="xs pd-2 pdx-2 full h-50 radius-20"
                        placeholder="Enter Essay"
                        onChange={(e) => setActualUserEssay(e.target.value)}
                        value={actualUserEssay}
                     />
                     <div className={`text-xxs pd-1 full dfb align-center justify-end ${actualUserEssay.length>maxlength && 'error-text'}`}>
                        {formatNumber(actualUserEssay.length, { useCommas: true })}/{formatNumber(maxlength, { useCommas: true })} characters
                     </div>
                  </div>

                  <AwaitButton className="xxs pd-14 pdx-3 radius-20" onClick={handleCreateEssayGradingReport}>
                     <FilePen size={17} /> Grade Essay
                  </AwaitButton>
                  <Spacing size={4} />
               </div>
            </>)}
         </div>
      </AppWrapper>
   )
}
