'use client'
import "./InfoSubjects.css"
import { subjectIcon } from "@/utils/subjects"
import { Ellipsis } from "lucide-react"
import Spacing from "@/components/Spacing/Spacing"
import MathIcon from "@/public/landing-page-assets/subjects/math.png"
import EnglishIcon from "@/public/landing-page-assets/subjects/english.png"
import PhysicsIcon from "@/public/landing-page-assets/subjects/physics.png"
import BiologyIcon from "@/public/landing-page-assets/subjects/biology.png"
import ChemistryIcon from "@/public/landing-page-assets/subjects/chemistry.png"
import AdministrationIcon from "@/public/landing-page-assets/subjects/administration.png"
import ComputerScienceIcon from "@/public/landing-page-assets/subjects/computer-science.png"
import AnythingIcon from "@/public/landing-page-assets/subjects/anything.png"

const subjects = [
   {
      subject: "Math",
      description: "Build confidence with numbers, equations, and problem-solving.",
      icon: MathIcon
   },
   {
      subject: "English",
      description: "Sharpen your writing, analyse texts, and express ideas clearly.",
      icon: EnglishIcon
   },
   {
      subject: "Physics",
      description: "Explore the forces, energy, and motion that shape our universe.",
      icon: PhysicsIcon
   },
   {
      subject: "Biology",
      description: "Discover how living things work, from cells to ecosystems.",
      icon: BiologyIcon
   },
   {
      subject: "Chemistry",
      description: "Understand substances, reactions, and the science behind matter.",
      icon: ChemistryIcon
   },
   {
      subject: "Computer Science",
      description: "Develop your coding skills and understand how computers work.",
      icon: ComputerScienceIcon
   },
   {
      subject: "Administration",
      description: "Build practical skills in organisation, communication, and office technology.",
      icon: AdministrationIcon
   },
   {
      subject: "Anything Else",
      description: "Whatever you're learning, make it easier to understand and remember.",
      icon: AnythingIcon
   },
];

export default function InfoSubjects () {
   return (
      <div className="info-subjects">
         <div className="info-subjects-container">
            <Spacing size={3} />
            <div className="box full dfb">
               <div className="box full mw-1200 dfb column gap-5">
                  <div className="text-b full bold-800 accent-color-gradient-dark-text line-height-12">
                     {'Literally Study Anything'.toUpperCase()}
                  </div>
                  <div className="text-s full pd-1">We have a wide variety of subjects and you can add the ones you want to study yourself</div>
                  <div className="box pd-2 full dfb wrap gap-20">
                     {subjects.map(subject => (
                        <div key={subject.subject} className="info-subject-card">
                           <div className="info-subject-card-image">
                              <img src={subject.icon.src} alt="info subject card image" />
                           </div>
                           <div className="text-sm full bold-700 accent-color">{subject.subject}</div>
                           <div className="text-xs full grey-5 bold-500 line-height-14">{subject.description}</div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
            <Spacing size={2} />
         </div>
      </div>
   )
}
