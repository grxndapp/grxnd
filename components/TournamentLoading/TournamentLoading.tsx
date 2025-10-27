"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { CustomSpinner } from "../Spinner/Spinner";
import Spacing from "../Spacing/Spacing";
import styles from "./TournamentLoading.module.css";

const loadingMessages = [
   "Fetching quiz questions…",
   "Setting up tournament arena…",
   "Preparing scoreboard…",
   "Almost ready to lock in!"
];

type TournamentLoadingProps = {
   quizConfig: {
      subjectLevel: string;
      subject: string;
      topic: string;
      numQuestions: string;
   }
}

export default function TournamentLoading({ quizConfig }: TournamentLoadingProps) {
   const [messageIndex, setMessageIndex] = useState(0);

   // Rotate loading messages
   useEffect(() => {
      const msgInterval = setInterval(() => {
         setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
      return () => clearInterval(msgInterval);
   }, []);

   return (
      <div className={styles.container}>
         {/* Icon + Title */}
         <motion.div
            className={styles.titleContainer}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
         >
            <Trophy className={styles.icon} size={35} />
            <div className={`${styles.title} text-m bold-700`}>Tournament Loading</div>
         </motion.div>

         <motion.div
            className={styles.titleContainer}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
         >
            <div className="text-s bold-600 full text-center">
               {quizConfig.subjectLevel} {quizConfig.subject} {quizConfig.topic}
            </div>
         </motion.div>

         <CustomSpinner color="#1131ff" size={60} />
         <Spacing size={1} />

         {/* Message */}
         <motion.p
            key={messageIndex}
            className={styles.message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
         >
            {loadingMessages[messageIndex]}
         </motion.p>

         {/* Infinite Progress Bar */}
         <div className={styles.progressBarContainer}>
            <div className={styles.progressBar}>
               <div className={styles.progressBarInner}></div>
            </div>
         </div>
      </div>
   );
}
