"use client";
import { motion } from "framer-motion";
import { UsersRound } from "lucide-react";
import styles from "./RoomLoading.module.css";
import Spacing from "../Spacing/Spacing";

export default function RoomLoading () {
   return (
      <div className={styles.container}>
         {/* Icon + Title */}
         <motion.div
            className={styles.titleContainer}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
         >
            <UsersRound className={styles.icon} size={35} />
            <div className={`${styles.title} text-m bold-700`}>Room Loading</div>
         </motion.div>

         <motion.div
            className={styles.titleContainer}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
         >
            <div className="text-s bold-600 full text-center">
               Preparing Game for Players
            </div>
         </motion.div>

         <div className="text-xxs pd-05 full text-center">
            Please wait as this may take some time
         </div>
         <Spacing size={2} />

         {/* Infinite Progress Bar */}
         <div className={styles.progressBarContainer}>
            <div className={styles.progressBar}>
               <div className={styles.progressBarInner}></div>
            </div>
         </div>
      </div>
   );
}
