'use client'
import "./SplashScreen.css"
import { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Home } from "lucide-react"
import { useSplashScreen } from "./SplashScreenContext"
import {
   AdministrationLoader, BiologyLoader, ChemistryLoader,
   ComputerScienceLoader, EnglishLoader, FlashcardMakingLoader, 
   MathLoader, NoteMakingLoader, PhysicsLoader, QuizLoader, SixtySevenLoader
} from '@/components/SubjectLoaders/SubjectLoaders'
import { CustomRawIcon } from "../Icons/Icon"
import AppWrapper from "../AppWrapper/AppWrapper"
import ErrorIcon from "@/public/error-icon.png"

type SplashScreenProps = {
   title: string | React.ReactNode;
   description: string | React.ReactNode;
   style: string;
   actions: {
      appearance: "delete" | "normal" | "outline-black";
      action: () => void;
      label: string | React.ReactNode;
   }[];
   backToHome?: boolean;
}

export default function SplashScreen ({ title, description, style, actions, backToHome }: SplashScreenProps) {
   const router = useRouter();
   const { closeSplash } = useSplashScreen();

   const iconsSize = 220;
   const icons: Record<SplashScreenProps['style'], ReactNode> = {
      "math": <MathLoader size={iconsSize} />,
      "physics": <PhysicsLoader size={iconsSize} />,
      "biology": <BiologyLoader size={iconsSize} />,
      "chemistry": <ChemistryLoader size={iconsSize} />,
      "computer science": <ComputerScienceLoader size={iconsSize} />,
      "administration": <AdministrationLoader size={iconsSize} />,
      "english": <EnglishLoader size={iconsSize} />,
      "quiz": <QuizLoader size={iconsSize} />,
      "note": <NoteMakingLoader size={iconsSize} />,
      "flashcard": <FlashcardMakingLoader size={iconsSize} />,
      "67": <SixtySevenLoader size={iconsSize} />,
      "error": <CustomRawIcon url={ErrorIcon.src} size={200} />
   }

   return (<div className="splash-screen-container">
      <AppWrapper>
         <div className="splash-screen">
            <div className="splash-screen-icon">{icons[style]}</div>
            <div className="splash-screen-title accent-color-gradient-dark-text">
               <div className="text-b fit bold-700 dfb align-center justify-center wrap gap-10">{title}</div>
            </div>
            <div className="splash-screen-description">
               <div className="text-s full text-center">{description}</div>
            </div>
            <div className="splash-screen-actions">
               {actions.map((action, index) => (
                  <button 
                     key={index} 
                     className={`xxs pd-15 full mw-500 radius-20 ${action.appearance}`}
                     onClick={() => action.action()}
                  >
                     {action.label}
                  </button>
               ))}
               {backToHome && (
                  <button 
                     className="xxs pd-15 full mw-500 radius-20 outline-black"
                     onClick={() => {
                        router.push("/home");
                        setTimeout(() => closeSplash(), 1000);
                     }}>
                     <Home size={17} /> Back To Home
                  </button>
               )}
            </div>
         </div>
      </AppWrapper>
   </div>)
}
