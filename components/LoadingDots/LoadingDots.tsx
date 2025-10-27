'use client'
import styles from "./LoadingDots.module.css"

export default function LoadingDots() {
   return (
      <div className={styles.progressBarContainer}>
         <div className={styles.progressBar}>
            <div className={styles.progressBarInner}></div>
         </div>
      </div>
   )
}
