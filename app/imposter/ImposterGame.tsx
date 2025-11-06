'use client'
import PlayerCard from "./PlayerCard";
import Spacing from "@/components/Spacing/Spacing";
import { ArrowRightFromLine, CirclePlay } from "lucide-react";
import { useState } from "react";

type ImposterGameProps = {
   numberOfPlayers: number;
   subjectInfo: {
      subjectLevel: string;
      subject: string;
      topic: string;
   }
   gameInfo: ImposterGame;
   reset: () => void;
}

export default function ImposterGame ({ subjectInfo, numberOfPlayers, gameInfo, reset }: ImposterGameProps) {
   const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
   const [playingGame, setPlayingGame] = useState<boolean>(false);

   const nextPlayer = () => {
      if (currentPlayerIndex+1 == numberOfPlayers) {
         setPlayingGame(true);
      } else {
         setCurrentPlayerIndex(prev => prev+1);
      }
   }

   return (
      <div className="box full h-full">
         <div className="text-xxl mb-1 bold-700 full dfb align-center justify-center gap-7">
            Imposter Game
         </div>
         <div className="text-xxs grey-4 full text-center">
            {subjectInfo.subjectLevel} {subjectInfo.subject} {subjectInfo.topic}
         </div>
         
         {playingGame ? (<>
            <Spacing size={1} />
            <div className="text-s bold-500 full pd-1 text-center">
               Enjoy Imposter with your friends.
            </div>
            <div className="box full pd-1">
               <button className="full xs pd-12" onClick={reset}>
                  Play Another Game <CirclePlay size={18} />
               </button>
            </div>

         </>) : (<>
            <Spacing size={2} />
            <div className="box full h-fit pd-1 dfb align-center justify-center">
               <PlayerCard 
                  index={currentPlayerIndex}
                  imposter={(currentPlayerIndex == gameInfo.imposterIndex)}
                  word={(currentPlayerIndex == gameInfo.imposterIndex ? gameInfo.hint : gameInfo.word)}
               />
            </div>
            <Spacing size={1} />
            <div className="box full pd-1 dfb align-center justify-center">
               <button className="xxs fit pd-11 pdx-2 whitespace-nowrap" onClick={nextPlayer}>
                  Next Player <ArrowRightFromLine size={17} />
               </button>
            </div>
         </>)}
      </div>
   )
}
