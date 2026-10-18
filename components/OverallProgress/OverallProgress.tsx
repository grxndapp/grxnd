'use client';
import { formatNumber } from '@/utils/num';
import './OverallProgress.css';

type OverallProgressProps = {
   percentage: number;
   score: number;
};

function getProgressStatus(percentage: number) {
   if (percentage < 20) {
      return {
         color: '#E04444',
         message: 'Your journey is just beginning',
         level: 'Getting Started',
      };
   }

   if (percentage < 40) {
      return {
         color: '#EA8035',
         message: "You're building momentum!",
         level: 'Making Progress',
      };
   }

   if (percentage < 60) {
      return {
         color: '#C99A16',
         message: "You're making steady progress!",
         level: 'On The Rise',
      };
   }

   if (percentage < 80) {
      return {
         color: '#3478D4',
         message: "You're ahead of the curve!",
         level: 'High Achiever',
      };
   }

   return {
      color: '#249A62',
      message: "You're among the top learners!",
      level: 'Top Performer',
   };
}

export default function OverallProgress ({ percentage, score }: OverallProgressProps) {
   const progress = Math.min(100, Math.max(0, percentage));
   const status = getProgressStatus(progress);

   return (
      <div className="overall-progress" style={{ '--progress-color': status.color } as React.CSSProperties}>
         <div className="overall-progress-content">
            <div className="overall-progress-percentage">
               {Math.round(progress)}%
            </div>
            <div className="overall-progress-message">
               {status.message}
            </div>
            <p className="overall-progress-description">
               You've earned more points than
               <strong> {Math.round(progress)}% </strong>
               of other learners.
            </p>
            <div className="overall-progress-level">
               {formatNumber(score, { showShortHand: true, useShorthand: true })} points
            </div>
         </div>
      </div>
   );
}
