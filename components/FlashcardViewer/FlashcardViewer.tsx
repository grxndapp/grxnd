'use client'
import "./FlashcardViewer.css"
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, PlayingCardsFan, RefreshCcw } from "lucide-react";
import RenderMarkdown from "../RenderMarkdown/RenderMarkdown";

const variants = {
   enter: (direction: number) => ({
      x: direction * 100,
      opacity: 0,
      rotate: direction * 5,
   }),
   center: {
      x: 0,
      opacity: 1,
      rotate: 0,
   },
   exit: (direction: number) => ({
      x: direction * -180,
      opacity: 0,
      rotate: direction * -12,
   }),
};

export default function FlashcardViewer({ flashcards }: { flashcards: Flashcard[]; }) {
   const [currentIndex, setCurrentIndex] = useState(0);
   const [direction, setDirection] = useState(1);
   const [transitioning, setTransitioning] = useState(false);
   const [showAnswer, setShowAnswer] = useState(false);
   const animating = useRef(false);

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         const target = e.target;

         if (
            target instanceof HTMLElement &&
            (target.isContentEditable ||
               target.closest("input, textarea, select, button"))
         ) return;

         if (e.code !== "ArrowLeft" && e.code !== "ArrowRight") return;
         e.preventDefault();

         if (e.repeat || transitioning) return;
         const nextDirection = e.code === "ArrowRight" ? 1 : -1;
         const nextIndex = currentIndex + nextDirection;

         // Stop at the first and last cards.
         if (nextIndex < 0 || nextIndex >= flashcards.length) {
            setTransitioning(true);
            setDirection(nextDirection);
            setCurrentIndex(nextIndex < 0 ? flashcards.length - 1 : 0);
         } else {
            setTransitioning(true);
            setDirection(nextDirection);
            setCurrentIndex(nextIndex);
         }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => document.removeEventListener("keydown", handleKeyDown);
   }, [currentIndex, flashcards.length, transitioning]);
   
   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         const target = e.target;
         if (
            target instanceof HTMLElement &&
            (target.isContentEditable || target.closest("input, textarea, select, button"))
         ) return;

         if (e.code !== "Space") return;
         e.preventDefault();
         if (e.repeat || animating.current) return;
         animating.current = true;
         setShowAnswer((prev) => !prev);
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
   }, []);

   useEffect(() => {
      setShowAnswer(false);
   }, [currentIndex]);

   function toPreviousCard () {
      setCurrentIndex(ind => ind == 0 ? flashcards.length-1 : ind-1)
      if (document.activeElement instanceof HTMLElement) {
         document.activeElement.blur();
      }
   }

   function toNextCard () {
      setCurrentIndex(ind => ind == (flashcards.length-1) ? 0 : ind+1)
   }

   function flipCard () {
      setShowAnswer(prev => !prev)
   }

   if (flashcards.length === 0) {
      return <p>No flashcards available.</p>;
   }

   return (
      <div className="flashcard-viewer">
         <div className="flashcard-info">
            <div className="text-xxs bold-500">
               {currentIndex+1} of {flashcards.length} flashcards
            </div>
         </div>
         <div className="flashcard-container" style={{ overflow: "hidden", padding: "10px 0" }}>
            <AnimatePresence initial={false} mode="wait" custom={direction}>
               <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  style={{ width: "100%", display: "flex", justifyContent: "center" }}
                  onAnimationComplete={(definition) => {
                     if (definition === "center") setTransitioning(false);
                  }}
               >
                  <Flashcard 
                     flashcard={flashcards[currentIndex]} 
                     showAnswer={showAnswer} 
                     animating={animating}
                     onClick={flipCard}
                  />
               </motion.div>
            </AnimatePresence>
         </div>
         <div className="flashcard-controls">
            <div className="box full dfb align-center">
               <button className="xxs pd-1 pdx-1 radius-20 outline-black tiny-shadow" onClick={toPreviousCard}><ChevronLeft size={17} /></button>
            </div>
            <div className="box full dfb align-center justify-center">
               <button className="xxs pd-1 pdx-2 radius-20 outline-black tiny-shadow" onClick={flipCard}>
                  <RefreshCcw size={17} /> Flip
               </button>
            </div>
            <div className="box full dfb align-center justify-end">
               <button className="xxs pd-1 pdx-1 radius-20 outline-black tiny-shadow" onClick={toNextCard}><ChevronRight size={17} /></button>
            </div>
         </div>
         <div className="flashcard-keyboard">

         </div>
      </div>
   );
}

type FlashcardProps = {
   flashcard: Flashcard;
   showAnswer: boolean;
   animating: any;
   onClick: () => void;
}

function Flashcard({ animating, flashcard, showAnswer, onClick }: FlashcardProps) {
   // const [showAnswer, setShowAnswer] = useState(oShowAnswer);
   // const animating = useRef(false);

   return (
      <div style={{ perspective: 1200, width: "100%", maxWidth: "700px" }}>
         <motion.div
            className="flashcard"
            initial={false}
            animate={{ rotateY: showAnswer ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onAnimationStart={() => {
               animating.current = true;
            }}
            onAnimationComplete={() => { animating.current = false; }}
            style={{
               display: "grid", width: "100%",
               transformStyle: "preserve-3d",
            }}
            onClick={onClick}
         >
            <div
               className="flashcard-text-content"
               style={{ gridArea: "1 / 1", backfaceVisibility: "hidden" }}
            >
               <div className="text-xxs full text-center bold-600 accent-color-gradient-text pd-05">QUESTION</div>
               <div className="flashcard-text">
                  <RenderMarkdown content={flashcard.question} styles={{ fontSize: "1.16rem" }} />
               </div>
               <div className="text-xs full text-center bold-500 grey-5 pd-05 dfb align-center justify-center gap-5">
                  Click to Flip <PlayingCardsFan size={16} />
               </div>
            </div>

            <div
               className="flashcard-text-content"
               style={{
                  gridArea: "1 / 1",
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
               }}
            >
               <div className="text-xxs full text-center bold-600 accent-color-gradient-text pd-05">ANSWER</div>
               <div className="flashcard-text">
                  <RenderMarkdown content={flashcard.answer} styles={{ fontSize: "1.16rem" }} />
               </div>
               <div className="text-xs full text-center bold-500 accent-color pd-05 dfb align-center justify-center gap-5">
                  Click to Flip <PlayingCardsFan size={16} />
               </div>
            </div>
         </motion.div>
      </div>
   );
}