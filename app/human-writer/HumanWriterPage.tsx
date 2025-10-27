'use client'
import { ClipboardPen, Copy, Edit, RotateCcw, UserRoundPen } from "lucide-react";
import { useRef, useState } from "react";
import { callChatGPT } from "../actions/ai";
import { useModal } from "@/contexts/useModal";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/str";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Spacing from "@/components/Spacing/Spacing";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import ToolHeading from "@/components/ToolHeading/ToolHeading";
import LoadingDots from "@/components/LoadingDots/LoadingDots";
import aiHumanizerPrompt from "@/prompts/aiHumanizer";
import SwitchSlide from "@/components/SwitchSlide/SwitchSlide";
import ModalSelect from "@/components/ModalSelect/ModalSelect";
import aiHumanWriterPrompt, { aiHumanWriterParams } from "@/prompts/aiHumanWriter";

export default function HumanWriterPage () {
   const essayRef = useRef<HTMLDivElement | null>(null);
   const [formType, setFormType] = useState<'humanize-ai' | 'ai-human-writer'>('humanize-ai');

   const [aiTextPrompt, setAiTextPrompt] = useState('');
   
   const [questionPrompt, setQuestionPrompt] = useState('');
   const [essayTone, setEssayTone] = useState('');
   const [essayAudience, setEssayAudience] = useState('');
   const [essayType, setEssayType] = useState('');

   const [humanizedResult, setHumanizedResult] = useState('');
   const { showModal, close } = useModal();
   const maxLength = 10000;

   const writeBtn = async () => {
      if (questionPrompt == "") {
         toast.error("Please enter a question");
         return;
      }
      if (essayTone == "") {
         toast.error("Please choose an essay tone");
         return;
      }
      if (essayAudience == "") {
         toast.error("Please choose an essay audience");
         return;
      }
      if (essayType == "") {
         toast.error("Please choose an essay type");
         return;
      }
      showModal({
         children: <>
            <div className="text-xl bold-700 full mb-1 text-center">AI Human Writer</div>
            <div className="text-xxs full text-center">
               AI is currently writing your essay...
            </div>
            <div className="box pd-2 full dfb justify-center">
               <LoadingDots />
            </div>
         </>
      });
      const result = await callChatGPT(aiHumanWriterPrompt(questionPrompt, essayTone, essayAudience, essayType));
      close();
      console.log(result.result);
      if (result == false || result == undefined || result.result == undefined) {
         toast.error("Failed to chat with AI. Please try again later.")
         return;
      }
      showModal({
         children: <>
            <div className="text-xl bold-700 full mb-1 text-center">AI Human Writer</div>
            <div className="text-xxs full text-center">
               AI is currently humanizing your essay...
            </div>
            <div className="box pd-2 full dfb justify-center">
               <LoadingDots />
            </div>
         </>
      });
      const result2 = await callChatGPT(aiHumanizerPrompt(result.result));
      close();
      console.log(result2.human_text);
      if (result2 == false || result2 == undefined || result2.human_text == undefined) {
         toast.error("Failed to chat with AI. Please try again later.")
         return;
      }
      setHumanizedResult(result2.human_text);
   }

   const humanizeBtn = async () => {
      if (aiTextPrompt == "") {
         toast.error("Please enter some ai generated text");
         return;
      }
      if (aiTextPrompt.length > maxLength) {
         toast.error("Your AI Text must be lower than 10,000 characters");
         return;
      }
      showModal({
         children: <>
            <div className="text-xl bold-700 full mb-1 text-center">AI Human Writer</div>
            <div className="text-xxs full text-center">
               AI is currently humanizing your ai text...
            </div>
            <div className="box pd-2 full dfb justify-center">
               <LoadingDots />
            </div>
         </>
      });
      const data = await callChatGPT(aiHumanizerPrompt(questionPrompt));
      close();
      if (data == false || data == undefined || data.human_text == undefined) {
         toast.error("Failed to chat with AI. Please try again later.")
         return;
      }
      setHumanizedResult(data.human_text);
   }

   const resetBtn = () => {
      setAiTextPrompt("");
      setQuestionPrompt("");
      setEssayTone("");
      setEssayAudience("");
      setEssayType("");
      setHumanizedResult("");
   }

   const formatText = (text: string) => {
      console.log(text);
      return text.split("\\n\\n").map((text, index) => (
         <div key={index} className="text-xxs pd-05" style={{lineHeight:"1.8rem"}}>
            {text}
            <Spacing size={2} />
         </div>
      ))
   }

   const copyEssayBtn = () => {
      if (essayRef.current) {
         copyToClipboard(essayRef.current.innerText);
         toast.success("Copied!");
      }
   }

   return (
      <AppWrapper>
         <div className="box full h-full">
            <ToolHeading title="AI Human Writer" description="Write your essay and humanize using AI or humanize your ai text" idClassName="human-writer" />
            <Spacing size={1} />

            <SwitchSlide 
               items={[
                  { label: <><ClipboardPen size={17} /> Humanize AI</>, key: 'humanize-ai' },
                  { label: <><UserRoundPen size={17} /> AI Human Writer</>, key: "ai-human-writer" },
               ]}
               onItemSelected={(key: any) => setFormType(key)}
            />

            {(humanizedResult !== "") ? (<>
               <Spacing size={1} />
               <div className="text-xl bold-700 full pd-1">Your Essay</div>
               <div className="box full" ref={essayRef}>{formatText(humanizedResult)}</div>
               <Spacing size={1} />
               <div className="box full dfb column" style={{gap:'10px'}}>
                  <button className="xxs outline-black tiny-shadow pd-1 full" onClick={copyEssayBtn}><Copy size={17} /> Copy Essay</button>
                  <button className="xxs pd-1 full" onClick={resetBtn}><RotateCcw size={17} /> Humanize Again</button>
               </div>
               <Spacing size={4} />
            </>) : (<>
               {(formType == "humanize-ai") && (<>
                  <Spacing size={1} />
                  <textarea 
                     className="xs pd-15 pdx-15 full h-45 border-radius-15"
                     name="ai-text-input" 
                     id="ai-text-input" 
                     placeholder="AI Text..."
                     value={aiTextPrompt}
                     onChange={(e) => setAiTextPrompt(e.target.value)}
                  />
                  <div className={`text-xxxs grey-5 dfb align-center justify-end mb-1 ${(aiTextPrompt.length > maxLength) && 'error-text'}`}>
                     {aiTextPrompt.length}/{maxLength} characters
                  </div>
                  <Spacing size={1} />
                  <AwaitButton className="xxs pd-1 full" onClick={humanizeBtn}>
                     <Edit size={17} /> Humanize
                  </AwaitButton>
                  <Spacing size={4} />
               </>)}

               {(formType == "ai-human-writer") && (<>
                  <Spacing size={1} />
                  <textarea 
                     className="xs pd-15 pdx-15 full h-20 border-radius-15"
                     name="essay-input" 
                     id="essay-input" 
                     placeholder="Question or Prompt..."
                     value={questionPrompt}
                     onChange={(e) => setQuestionPrompt(e.target.value)}
                  />
                  <Spacing size={2} />

                  <div className="text-sm bold-600 full pd-1">Essay Type</div>
                  <div className="text-xxs full mb-1">The type of essay you would like written</div>
                  <ModalSelect
                     options={aiHumanWriterParams.types}
                     onSelect={(option) => setEssayType(option)}
                     title="Choose Essay Type"
                  />
                  <Spacing size={1} />

                  <div className="text-sm bold-600 full pd-1">Essay Audience</div>
                  <div className="text-xxs full mb-1">The audience you want to read this essay</div>
                  <ModalSelect
                     options={aiHumanWriterParams.audiences}
                     onSelect={(option) => setEssayAudience(option)}
                     title="Choose Essay Audience"
                  />
                  <Spacing size={1} />

                  <div className="text-sm bold-600 full pd-1">Essay Tone</div>
                  <div className="text-xxs full mb-1">The tone of essay that will be written</div>
                  <ModalSelect
                     options={aiHumanWriterParams.tones}
                     onSelect={(option) => setEssayTone(option)}
                     title="Choose Essay Tone"
                  />
                  <Spacing size={1} />
                  <AwaitButton className="xxs pd-1 full" onClick={writeBtn}>
                     <Edit size={17} /> Write
                  </AwaitButton>
                  <Spacing size={4} />
               </>)}
            </>)}

         </div>
      </AppWrapper>
   )
}
