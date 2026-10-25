'use client'
import "./SplashScreen.css"
import { ReactNode } from "react"
import { CustomRawIcon } from "../Icons/Icon"
import { useRouter } from "next/navigation"
import { Home } from "lucide-react"
import { useSplashScreen } from "./SplashScreenContext"
import NormalStyleLogo from "@/public/welcome-icon.png"
import ErrorStyleLogo from "@/public/error-icon.png"
import LoadingStyleLogo from "@/public/loading-icon.png"
import AppWrapper from "../AppWrapper/AppWrapper"

type SplashScreenProps = {
   title: string | React.ReactNode;
   description: string | React.ReactNode;
   style: "error" | "loading" | "normal";
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

   const iconsSize = 180;
   const icons: Record<SplashScreenProps['style'], ReactNode> = {
      "normal": <CustomRawIcon url={NormalStyleLogo.src} size={iconsSize} />,
      "error": <CustomRawIcon url={ErrorStyleLogo.src} size={iconsSize} />,
      "loading": <CustomRawIcon url={LoadingStyleLogo.src} size={iconsSize} />,
   }
   const colors: Record<SplashScreenProps['style'], string> = {
      "normal": "normal-title",
      "error": "error-title",
      "loading": "loading-title",
   }

   return (<div className="splash-screen-container">
      <AppWrapper>
         <div className="splash-screen">
            <div className="splash-screen-icon">{icons[style]}</div>
            <div className={`splash-screen-title ${colors[style]}`}>
               <div className="text-xl fit bold-700 dfb align-center justify-center wrap gap-10">{title}</div>
            </div>
            <div className="splash-screen-description">
               <div className="text-xs fit text-center">{description}</div>
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
