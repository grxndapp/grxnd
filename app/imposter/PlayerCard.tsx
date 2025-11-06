'use client'

import { titleCase } from "@/lib/str";
import { motion, useAnimation } from "framer-motion";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import { CSSProperties, useEffect, useState } from "react";

type PlayerCardProps = {
   index: number;
   imposter: boolean;
   word: string;
}

const playerCardColors = [
   "#AEC6CF", "#FFB347","#77DD77", "#FF6961",
   "#CFCFC4", "#F49AC2","#B39EB5", "#FFD1DC",
   "#C2EABD", "#FDFD96" 
]

export default function PlayerCard ({ index, imposter, word }: PlayerCardProps) {

   const cardStyles: CSSProperties = {
      backgroundColor: playerCardColors[index],
      border: "1px solid #e9e9e9",
      padding: "30px 25px",
      width: "100%",
      maxWidth: "400px",
      borderRadius: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)"
   }

   const wrapperStyles: CSSProperties = {
      position: "absolute",
      bottom: 0
   }

   const identityImposterStyles: CSSProperties = {
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "20px 25px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
      width: "100%",
      color: "red",
      textAlign: "center",
      fontWeight: "bolder",
      fontSize: "1.2rem"
   }

   const identitySafeStyles: CSSProperties = {
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "20px 25px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
      width: "100%",
      color: "green",
      textAlign: "center",
      fontWeight: "bolder",
      fontSize: "1.2rem"
   }

   const controls = useAnimation();
   const [showWord, setShowWord] = useState<boolean>(false);

   useEffect(() => {
      if (showWord) {
         controls.start({
            y: -75,
            transition: { ease: "easeIn", duration: 0.1 },
            animationDuration: 0.1
         });
      } else {
         controls.start({
            y: 0,
            transition: { ease: "easeIn", duration: 0.1 },
            animationDuration: 0.1
         });
      }
   }, [showWord, controls])

   return (
      <div className="box full pd-05 dfb align-end justify-center" style={{
         position:"relative", height: "30vh"
      }}>

         <motion.div 
            animate={controls}
            className="box full dfb align-center justify-center"
            style={wrapperStyles}
         >
            <div style={cardStyles}>
               <div className="text-xxl full bold-600 text-center mb-2" style={{textTransform:"uppercase"}}>Player {index+1}</div>

               {imposter ? (<>
                  <div style={identityImposterStyles}>YOU ARE THE IMPOSTER</div>
               </>) : (<>
                  <div style={identitySafeStyles}>YOU ARE SAFE</div>
               </>)}
                  
               <motion.div 
                  className="text-sm mt-2 full pd-1 dfb align-center justify-center gap-10 bold-700"
                  onPointerDown={(e) => {
                     e.preventDefault();
                     setShowWord(true);
                  }}
                  onPointerUp={() => setShowWord(false)}
                  onPointerCancel={() => setShowWord(false)}
                  onPointerLeave={() => setShowWord(false)}
               >
                  <ArrowRightFromLine size={24} />
                  <span>HOLD TO REVEAL</span>
                  <ArrowLeftFromLine size={24} />
               </motion.div>
            
            </div>
         </motion.div>
         
         <div className="box full pd-1 dfb justify-center">
            <div className="text-s full pd-1 bold-500 text-center" style={{maxWidth: "350px"}}>
               {titleCase(word)}
            </div>
         </div>

      </div>
   )
}
