'use client'
import { createContext, useCallback, useContext, useState } from "react";
import AppWrapper from "../AppWrapper/AppWrapper";
import SplashScreen from "./SplashScreen";

type SplashScreenConfig = {
   title: string | React.ReactNode;
   description: string | React.ReactNode;
   style: "error" | "loading" | "normal";
   actions: {
      appearance: "delete" | "normal" | "outline-black";
      action: () => void;
      label: string | React.ReactNode;
   }[];
   backToHome?: boolean;
};

type SplashScreenContextType = {
   openSplash: (config: SplashScreenConfig) => void;
   closeSplash: () => void;
};

const SplashScreenContext = createContext<SplashScreenContextType | null>(null);

export const useSplashScreen = () => {
   const ctx = useContext(SplashScreenContext);
   if (!ctx) throw new Error("Splash Screen Provider is missing");
   return ctx;
};


export const SplashScreenProvider = ({ children }: { children: React.ReactNode }) => {
   const [splashScreen, setSplashScreen] = useState<SplashScreenConfig | null>();

   const openSplash = useCallback((config: SplashScreenConfig) => {
      setSplashScreen(config);
   }, []);

   const closeSplash =  useCallback(() => setSplashScreen(null), []);

   return (
      <SplashScreenContext.Provider value={{ openSplash, closeSplash }}>
         {splashScreen && (<>
            <SplashScreen {...splashScreen} />
         </>)}
         {children}
      </SplashScreenContext.Provider>
   );
};
