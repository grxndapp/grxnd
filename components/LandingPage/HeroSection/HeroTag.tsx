'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, Edit3, FileText, HelpCircle, Trophy, Users } from 'lucide-react';

const tagSize = 15
const tagStrokeWidth = 3
const tags = [
   <><Calendar size={tagSize} color="#5C6AC4" strokeWidth={tagStrokeWidth} /> Personal Timetable Maker</>,
   <><FileText size={tagSize} color="#4CAF50" strokeWidth={tagStrokeWidth} /> AI Notes in Seconds</>,
   <><HelpCircle size={tagSize} color="#FFB400" strokeWidth={tagStrokeWidth} /> Smart AI Quiz Maker</>,
   <><CheckCircle size={tagSize} color="#00BFA6" strokeWidth={tagStrokeWidth} /> Instant Essay Grading</>,
   <><Edit3 size={tagSize} color="#FF69B4" strokeWidth={tagStrokeWidth} /> AI-Powered Human-Like Essays</>,
   <><Users size={tagSize} color="#9C27B0" strokeWidth={tagStrokeWidth} /> Collaborative Quizzes with Friends</>,
   <><Trophy size={tagSize} color="#FF6B6B" strokeWidth={tagStrokeWidth} /> Compete on the Global Leaderboard</>,
];

const tagsColors = [
   "#5C6AC4",
   "#4CAF50",
   "#FFB400",
   "#00BFA6",
   "#FF69B4",
   "#9C27B0",
   "#FF6B6B"
]

export default function HeroTag() {
   const [index, setIndex] = useState(0);

   useEffect(() => {
      const interval = setInterval(() => {
         setIndex(prev => (prev + 1) % tags.length);
      }, 2000);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="tag fit mb-2 pdx-1" style={{ background: "white" }}>
         <AnimatePresence mode="wait">
            <motion.div
               key={tags.indexOf(tags[index])}
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: -20, opacity: 0 }}
               transition={{ duration: 0.3 }}
            >
               <div className='tag-msg' style={{ whiteSpace: "nowrap" }}>{tags[index]}</div>
            </motion.div>
         </AnimatePresence>
      </div>
   );
}