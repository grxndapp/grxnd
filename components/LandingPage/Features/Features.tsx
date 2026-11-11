'use client';
import "./Features.css"
import Spacing from "@/components/Spacing/Spacing";
import MakeNoteImg from "@/public/landing-page-assets/features/make-notes.png"
import TakeQuizImg from "@/public/landing-page-assets/features/taking-quiz.png"
import LeaderboardImg from "@/public/landing-page-assets/features/leaderboard.png"
import AnythingStudyImg from "@/public/landing-page-assets/features/anything-study.png"
import ExamReadinessScoreImg from "@/public/landing-page-assets/features/exam-readiness-score.png"



const features = [
   {
      icon: MakeNoteImg,
      title: 'Make notes for any subject',
      description: 'Turn any topic or lecture into clean, structured notes instantly — ready to revise or share.',
   },
   {
      icon: TakeQuizImg,
      title: 'Test yourself on your subjects',
      description: 'Generate smart, adaptive quizzes that test your understanding and help you master every concept.',
   },
   {
      icon: ExamReadinessScoreImg,
      title: 'Check exam readiness',
      description: 'See how ready you are for your exam and get a custom plan just for you to study for it.',
   },
   {
      icon: AnythingStudyImg,
      title: 'Study anything even pdfs',
      description: 'Not just secondary school subject, even uni students can use Grxnd.',
   },
   {
      icon: ExamReadinessScoreImg,
      title: 'Grade your essays and get instant feedback',
      description: 'Get instant, detailed feedback on your essays — grading accuracy, structure, and writing quality.',
   },
   {
      icon: LeaderboardImg,
      title: 'Compete with friends and get gbp5 every week',
      description: 'Compete with students around the world, track your rank, and showcase your academic grind.',
   },
];

export default function Features () {
   return (
      <section className="features-section" id="features">
         <div className="features-container">
            <div className="box text-s full line-height-11 dfb column">
               <div className="text-xxs full bold-500">Features</div>
               <div className="text-b bold-800 accent-color-gradient-dark-text line-height-15">WHAT GRXND CAN DO</div>
            </div>
            <Spacing />
            <div className="features-list">
               {features.map((feature, index) => (
                  <div key={index} className="feature-card">
                     <div className="feature-image">
                        <img src={feature.icon.src} alt="feature image" />
                     </div>
                     <div className="feature-bg-gradient" />
                     <div className="feature-info">
                        <div className="text-m full bold-600 accent-color">{feature.title}</div>
                        <div className="text-xs full">{feature.description}</div>
                        <Spacing />
                     </div>
                  </div>
               ))}
            </div>
            <Spacing size={2} />
         </div>
      </section>
   );
}
