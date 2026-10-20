'use client';
import "./Features.css"
import Spacing from "@/components/Spacing/Spacing";
import { BookCheck, FilePen, GraduationCap, Notebook, Trophy, UserRoundPen, UsersRound } from 'lucide-react';

const features = [
   {
      icon: <Notebook size={24} />,
      title: 'AI Note Maker',
      description: 'Turn any topic or lecture into clean, structured notes instantly — ready to revise or share.',
   },
   {
      icon: <BookCheck size={24} />,
      title: 'AI Quiz Maker',
      description: 'Generate smart, adaptive quizzes that test your understanding and help you master every concept.',
   },
   {
      icon: <BookCheck size={24} />,
      title: 'Exam Readiness Score',
      description: 'See how ready you are for your exam and get a custom plan just for you to study for it.',
   },
   {
      icon: <GraduationCap size={24} />,
      title: 'Uni Students',
      description: 'Not just secondary school subject, even uni students can use Grxnd.',
   },
   {
      icon: <FilePen size={24} />,
      title: 'AI Essay Grader',
      description: 'Get instant, detailed feedback on your essays — grading accuracy, structure, and writing quality.',
   },
   {
      icon: <Trophy size={24} />,
      title: 'Global Leaderboard',
      description: 'Compete with students around the world, track your rank, and showcase your academic grind.',
   },
];

export default function Features () {
   return (
      <section className="features-section" id="features">
         <div className="section-heading text-xxxl bold-700">Features</div>
         <Spacing />
         <div className="features-grid">
            {features.map((feature, index) => (
               <div key={index} className="feature-card">
                  <div className="icon">
                     <div className="icon-wrapper">{feature.icon}</div>
                  </div>
                  <div>
                     <div className="text-xs bold-700 pd-05">{feature.title}</div>
                     <p>{feature.description}</p>
                  </div>
               </div>
            ))}
         </div>
         <Spacing size={2} />
      </section>
   );
}
