'use client'
import "./LyricDisplay.css";
import { motion } from "framer-motion";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { FaArrowRotateRight, FaPause, FaPlay } from "react-icons/fa6";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import RenderMarkdown from "../RenderMarkdown/RenderMarkdown";
import Spacing from "../Spacing/Spacing";

type LyricDisplayProps = {
   lyrics: Lyric[];
   themeColor: string;
   animationLoader: React.JSX.Element;
   title: string;
   artist: string;
   backButton?: () => void;
}

export default function LyricDisplay ({ lyrics, themeColor, animationLoader, title, artist, backButton }: LyricDisplayProps) {
   const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
   const [translateY, setTranslateY] = useState(0);

   const viewportRef = useRef<HTMLDivElement>(null);
   const trackRef = useRef<HTMLDivElement>(null);
   const lyricRefs = useRef<(HTMLDivElement | null)[]>([]);

   const [isPlaying, setIsPlaying] = useState(false);

   useLayoutEffect(() => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;

      function updatePosition() {
         const activeLyric = lyricRefs.current[currentLyricIndex];
         if (!viewport || !activeLyric) return;

         // Keep the active lyric's top 30% down the viewport.
         const anchor = viewport.clientHeight * 0.3;
         setTranslateY(anchor - activeLyric.offsetTop);
      }
      updatePosition();

      // Recalculate when text wraps, fonts load, or the viewport changes.
      const observer = new ResizeObserver(updatePosition);
      observer.observe(viewport);
      observer.observe(track);
      lyricRefs.current.forEach((element) => {
         if (element) observer.observe(element);
      });

      if (currentLyricIndex == lyrics.length - 1) setIsPlaying(false);

      return () => observer.disconnect();
   }, [currentLyricIndex, lyrics]);

   const currentLyric = lyrics[currentLyricIndex];
   const isLastLyric = currentLyricIndex >= lyrics.length - 1;
   const isFirstLyric = currentLyricIndex == 0;

   function handlePlayBtn() {
      if (!currentLyric) return;
      if (isLastLyric && !isPlaying) {
         setCurrentLyricIndex(0);
         setIsPlaying(true);
         return;
      }
      setIsPlaying((prev) => !prev);
   }
   
   useEffect(() => {
      if (!isPlaying || !currentLyric) return;

      // Allow roughly 3 words per second, plus a short pause.
      const wordCount = `${currentLyric.line_one} ${currentLyric.line_two}`.trim().split(/\s+/).length;
      const duration = Math.max(3000, (wordCount / 3) * 1000 + 1000);

      const timeout = setTimeout(() => {
         if (isLastLyric) {
            setIsPlaying(false);
            return;
         }

         setCurrentLyricIndex((index) =>
            Math.min(index + 1, lyrics.length - 1)
         );
      }, duration);

      return () => clearTimeout(timeout);
   }, [
      isPlaying,
      currentLyricIndex,
      currentLyric,
      isLastLyric,
      lyrics.length,
   ]);

   return (
      <div className="lyrics-display">
         <div className="lyric-player-controls">
            <div className="lyrics-player" ref={viewportRef}>
               <motion.div
                  ref={trackRef} className="lyrics-track"
                  initial={false} animate={{ y: translateY }}
                  transition={{ type: "spring", stiffness: 100, damping: 24, mass: 1 }}
               >
                  {lyrics.map((lyric, index) => (
                     <motion.div
                        key={index}
                        ref={(element) => { lyricRefs.current[index] = element; }}
                        className={`text-xxl lyric-text-display ${index === currentLyricIndex ? "current-lyric" : ""}`}
                        style={{ color: themeColor }} initial={false}
                        animate={{ opacity: index === currentLyricIndex ? 1 : 0.35 }}
                        transition={{ duration: 0.35 }}
                     >{`${lyric.line_one}\n`}{currentLyric.line_two}</motion.div>
                  ))}
               </motion.div>
            </div>
            <div className="lyric-controls">
               <div className="lyric-control-music-info">
                  <div className="lyric-music-info-cover">{animationLoader}</div>
                  <div className="lyric-music-info-ta">
                     <div className="text-xxs bold-600 full" style={{ color: themeColor }}>{title}</div>
                     <div className="text-xxxs full">{artist}</div>
                  </div>
               </div>
               <div className="lyric-control-tools">
                  <button 
                     disabled={!currentLyric || isFirstLyric}
                     onClick={() => setCurrentLyricIndex((index) => Math.min(index - 1, lyrics.length - 1))}
                  >
                     <BiSkipPrevious size={35} />
                  </button>
                  <button
                     className="play-button" onClick={handlePlayBtn} disabled={!currentLyric}
                     aria-label={isPlaying ? "Pause" : isLastLyric ? "Restart" : "Play"}
                  >
                     {isPlaying ? (<FaPause size={30} />)
                     : isLastLyric ? (<FaArrowRotateRight size={30} />) : (
                        <FaPlay size={30} />
                     )}
                  </button>
                  <button 
                     disabled={!currentLyric || isLastLyric}
                     onClick={() => setCurrentLyricIndex((index) => Math.min(index + 1, lyrics.length - 1))}
                  >
                     <BiSkipNext size={35} />
                  </button>
               </div>
            </div>
         </div>
         <div className="lyric-meaning">
            <div className="text-ml bold-700 full accent-color-gradient-dark-text">Meaning</div>
            <div className="box full pd-05">
               <div className="text-xxxxs full bold-600 grey-5">Lyric</div>
               <div className="text-xs bold-600 full accent-color-gradient-text">"{currentLyric.line_one}</div>
               <div className="text-xs bold-600 full accent-color-gradient-text">{currentLyric.line_two}"</div>
            </div>
            <div className="box full">
               <div className="text-xxxxs full bold-600 grey-5">Meaning</div>
               <div className="text-xs"><RenderMarkdown content={currentLyric.meaning} /></div>
               <Spacing />
               {backButton && (
                  <button className="xxs pd-13 pdx-2 radius-20 accent-hover" onClick={backButton}>Make New Lyrics</button>
               )}
            </div>
         </div>
      </div>
   )
}