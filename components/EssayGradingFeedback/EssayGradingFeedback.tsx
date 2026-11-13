'use client'
import './EssayGradingFeedback.css'
import { ChevronDown, ChevronUp, Copy, MousePointerClick } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { copyToClipboard } from '@/lib/str';
import { toast } from 'sonner';
import ProgressBar from '../ProgressBar/ProgressBar';

export default function EssayGradingFeedback ({ essayText, essayFeedback }: { essayText: string; essayFeedback: EssayGradeReport }) {
   const essayTextRef = useRef<HTMLDivElement>(null);
   const [essayTextReference, setEssayTextReference] = useState('');
   const [essayContent, setEssayContent] = useState(essayText);
   const [openSectionHandler, setOpenSectionHandler] = useState<Record<any, boolean>>({
      strengths: true,
      weaknesses: false,
      improvements: false
   });

   const sectionHeadingClassnames = "text-sm bold-600 full accent-color-gradient-text dfb align-center gap-5 cursor-pointer no-select";
   function isOpenIcon (key: string) {
      return (openSectionHandler[key]) ? <ChevronDown size={18} color='#000' /> : <ChevronUp size={18} color='#000' />
   }
   function isOpenSection (key: string) {
      return openSectionHandler[key]
   }

   function handleOpenSection (key: string) {
      setOpenSectionHandler(prev => {
         return (prev[key])
            ?  { ...prev, [key]: false }
            : { ...prev, [key]: true }
      })
   }

   function handleFindReference (ref: string) {
      setEssayTextReference(ref);
   }

   function handleCopyEssay () {
      try {
         copyToClipboard(essayContent);
         toast("Copied Essay!");
      } catch (err) {}
   }

   useEffect(() => {
      if (!essayTextReference) return;
      essayTextRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
   }, [essayTextReference]);

   return (
      <div className='essay-grading-feedback-tool'>

         <div className="box full dfb column gap-10">
            <div className="box full dfb align-center">
               <div className="text-l bold-700 full">Your Essay</div>
               <button className="xxxs pd-12 pdx-2 radius-20 outline-black tiny-shadow whitespace-nowrap" onClick={handleCopyEssay}>
                  <Copy size={17} /> Copy Essay
               </button>
            </div>
            <div className="essay-text">
               {essayTextReference !== '' && essayContent.includes(essayTextReference) ? (<>
                  {essayContent.split(essayTextReference)[0]}
                  <span className="highlight-selection" ref={essayTextRef}>{essayTextReference}</span>
                  {essayContent.split(essayTextReference)[1]}
               </>) : (<>
                  {essayContent}
               </>)}
            </div>
         </div>

         <div className="essay-feedback">
            <div className="text-ml full bold-600">Essay Grade</div>

            <div className="box full dfb column gap-5 pd-2">
               <div className="text-xs full bold-500">Grade: {(essayFeedback.grade*10)}%</div>
               <ProgressBar percentage={essayFeedback.grade*10} />
            </div>

            <div className="box full pd-2">
               <div className={sectionHeadingClassnames} onClick={() => handleOpenSection("strengths")}>
                  Strengths {isOpenIcon("strengths")}
               </div>
               {isOpenSection("strengths") && (<>
                  {essayFeedback.strengths.map((strength, index) => (
                     <div key={index} className="text-xxs full line-height-15 pd-05">{strength}</div>
                  ))}
               </>)}
            </div>

            <div className="box full pd-2">
               <div className={sectionHeadingClassnames} onClick={() => handleOpenSection("weaknesses")}>
                  Weaknesses {isOpenIcon("weaknesses")}
               </div>
               {isOpenSection("weaknesses") && (<>
                  {essayFeedback.weaknesses.map((weakness, index) => (
                     <div key={index} className="text-xxs full line-height-15 pd-05">{weakness}</div>
                  ))}
               </>)}
            </div>

            <div className="box full pd-2">
               <div className={sectionHeadingClassnames} onClick={() => handleOpenSection("improvements")}>
                  Improvements {isOpenIcon("improvements")}
               </div>
               {isOpenSection("improvements") && (<>
                  {essayFeedback.improvements.map((improvement, index) => (
                     <div key={index} className="box full dfb column pd-05 mb-2">
                        <div className="text-s full bold-600 pd-05">Improvement {index+1}</div>
                        <div className="text-xxs full line-height-15">{improvement.improvement}</div>

                        <div 
                           className="text-xxs full pd-05 ref-highlight-link dfb column gap-5"
                           onClick={() => {
                              if (essayContent.includes(improvement.quote)) {
                                 handleFindReference(improvement.quote)
                              } else {
                                 setEssayContent(prev => prev.replace(improvement.possible_replacement, improvement.quote))
                                 handleFindReference(improvement.quote)
                              }
                           }}
                        >
                           <div className="box full pd-05">
                              "{improvement.quote}" <span style={{ display: "inline" }}><MousePointerClick size={17} /></span>
                           </div>
                           {essayContent.includes(improvement.quote) ? (
                              <div className="text-t bold-500 full accent-color">
                                 Click to Reference
                              </div>
                           ) : (
                              <div className="text-t bold-500 full accent-color">Click to Replace Improvement</div>
                           )}
                        </div>

                        <div className="box full pd-05">
                           <div 
                              className="text-xxs full pd-05 line-height-15 new-improve-link dfb column gap-5"
                              onClick={() => {
                                 if (essayContent.includes(improvement.quote)) {
                                    setEssayContent(prev => prev.replace(improvement.quote, improvement.possible_replacement))
                                 }
                              }}
                           >
                              <div className="text-xs full bold-600">You could say:</div>
                              "{improvement.possible_replacement}"
                              {essayContent.includes(improvement.possible_replacement) ? (
                                 <div className="text-t bold-500 full accent-color">Done!</div>
                              ) : (
                                 <div className="text-t bold-500 full accent-color">Click to Replace</div>
                              )}
                           </div>
                        </div>
                     </div>
                  ))}
               </>)}
            </div>

            <div className="box full pd-2">
               <div className={sectionHeadingClassnames}>Comments</div>
               <div className="text-xxs full pd-1 line-height-15">{essayFeedback.comments}</div>
            </div>
         </div>
      </div>
   )
}