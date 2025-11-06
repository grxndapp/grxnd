'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import LoadingDots from "@/components/LoadingDots/LoadingDots";
import ModalSelect from "@/components/ModalSelect/ModalSelect";
import Spacing from "@/components/Spacing/Spacing";
import ToolHeading from "@/components/ToolHeading/ToolHeading";
import NumberChooser from "@/components/NumberChooser/NumberChooser";
import ImposterGame from "./ImposterGame";
import imposterPrompt from "@/prompts/imposter";
import { useModal } from "@/contexts/useModal";
import { retrieveSubjectTopic, subjectLevels, subjects } from "@/utils/subjects";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { callChatGPT } from "../actions/ai";
import { toast } from "sonner";

export default function ImposterPage() {
   const { showModal, close } = useModal();
   
   const [imposterGameInfo, setImposterGameInfo] = useState<ImposterGame | null>(null);

   // prompt parameter states
   const [subjectLevel, setSubjectLevel] = useState('');
   const [subject, setSubject] = useState('');
   const [topic, setTopic] = useState('');
   const [numPlayers, setNumPlayers] = useState(3);
   const [canGenerateGame, setCanGenerateGame] = useState<boolean>(false)
   
   useEffect(() => {
      setCanGenerateGame((subject !== "" && subjectLevel !== "" && topic !== ""));
   }, [subject, subjectLevel, topic])

   useEffect(() => {
      setTopic('');
   }, [subject, subjectLevel])

   
   const createImposterGameAI = async () => {
      showModal({
         children: <>
            <div className="text-xl bold-700 full mb-1 text-center">Imposter Game</div>
            <div className="text-xxs full text-center">
               Generating words for the game, this can take up to 15 seconds.
            </div>
            <div className="box pd-2 full dfb justify-center">
               <LoadingDots />
            </div>
         </>
      });
      const data = await callChatGPT(imposterPrompt(subjectLevel, subject, topic, numPlayers));
      close();
      if (data == false) {
         toast.error("Failed to use AI. Please try again later.");
         return;
      }
      setImposterGameInfo(data.imposter || null);
   }

   return (
      <AppWrapper>
         {(imposterGameInfo == null) && (<>
            <div className="box full h-full">
               <ToolHeading title="Play Imposter" description="Choose your subject level, subject and maybe a topic and press Start Game" idClassName="imposter" />
               <div className="text-xxs full pd-1 text-center">Play with your friends, a fun way to learn things together.</div>
               <Spacing size={1} />

               <div className="text-sm bold-600 full mt-05 pd-1">Number of Players</div>
               <NumberChooser onChooseNum={(number) => setNumPlayers(number)} />
               <Spacing size={1} />

               <div className="text-sm bold-600 full pd-1">Subject Level</div>
               <ModalSelect
                  options={subjectLevels}
                  onSelect={(option) => setSubjectLevel(option)}
                  title="Choose Subject Level"
               />
               <Spacing size={1} />

               <div className="text-sm bold-600 full pd-1">Subject</div>
               <ModalSelect
                  options={subjects}
                  onSelect={(option) => setSubject(option)}
                  title="Choose Subject"
               />
               <Spacing size={1} />

               {(subject !== "" && subjectLevel !== "") && (<>
                  <div className="text-sm bold-600 full pd-1">Subject Topic (optional)</div>
                  <ModalSelect
                     options={retrieveSubjectTopic(subjectLevel, subject)!}
                     onSelect={(option) => setTopic(option)}
                     title={`Choose ${subjectLevel} ${subject} Topic`} showDeselect
                  />
                  <Spacing size={2} />
               </>)}

               {(canGenerateGame) && <AwaitButton className="xxs full pd-12 tiny-shadow" onClick={createImposterGameAI}>
                  <Play size={17} /> Start Game
               </AwaitButton>}

               <Spacing size={5} />
            </div>
         </>)}

         {(imposterGameInfo !== null && imposterGameInfo !== undefined) && (<>
            <ImposterGame
               numberOfPlayers={numPlayers}
               subjectInfo={{ subjectLevel, subject, topic }}
               gameInfo={imposterGameInfo}
               reset={() => {
                  setSubjectLevel("");
                  setSubject("");
                  setTopic("");
                  setImposterGameInfo(null);
               }}
            />
         </>)}
      </AppWrapper>
   )
}
