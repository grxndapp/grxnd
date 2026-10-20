'use client';
import './ExamAnalysisLoader.css';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, LoaderCircle } from 'lucide-react';

const steps = [
   {
      title: 'Getting Requirements',
      description: 'Talking to Qualifications Scotland... 📚',
   },
   {
      title: 'Checking your progress on Grxnd',
      description: 'Seeing how well you have done... 📈',
   },
   {
      title: 'Comparing with your target grade',
      description: 'Have you been studying enough? 🎯',
   },
   {
      title: 'Collecting information',
      description: 'Preparing your exam-ready score... ✨',
   },
];

type ExamAnalysisLoaderProps = {
  onComplete?: () => void;
};

export default function ExamAnalysisLoader ({ onComplete }: ExamAnalysisLoaderProps) {
   const [activeStep, setActiveStep] = useState(0);

   useEffect(() => {
      const timers = [
         setTimeout(() => setActiveStep(1), 2000),
         setTimeout(() => setActiveStep(2), 4000),
         setTimeout(() => setActiveStep(3), 6000),
         setTimeout(() => {
         setActiveStep(4);
         onComplete?.();
         }, 8000),
      ];

      return () => timers.forEach(clearTimeout);
   }, [onComplete]);

   return (
      <div className="exam-analysis-loader">
         <div className="analysis-steps">
         <AnimatePresence initial={false}>
            {steps.slice(0, activeStep + 1).map((step, index) => {
               const completed = index < activeStep;

               return (
                  <motion.div
                     key={step.title}
                     className="analysis-step"
                     initial={{ opacity: 0, y: 12 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                     }}
                  >
                     <div className="analysis-step-icon">
                        {completed ? ( <Check size={15} /> ) : ( <LoaderCircle size={16} className="analysis-spinner" /> )}
                     </div>

                     <div className="analysis-step-content">
                        <div className="analysis-step-title text-sm bold-600">{step.title}</div>
                        <div className="analysis-step-description text-xxs">{step.description}</div>
                     </div>
                  </motion.div>
               );
            })}
         </AnimatePresence>
         </div>
      </div>
   );
}
