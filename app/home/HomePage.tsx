'use client'
import {  BookOpen, Lightbulb } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CustomRawIcon } from "@/components/Icons/Icon";
import { CustomIconUrls } from "@/lib/icons";
import { useSplashScreen } from "@/components/SplashScreen/SplashScreenContext";
import { toast } from "sonner";
import AppWrapper from "@/components/AppWrapper/AppWrapper";

type HomePageProps = {
   quizzes: QuizT[];
   notes: Note[];
   welcomeString: string;
}

export default function HomePage ({ quizzes, notes, welcomeString }: HomePageProps) {
   const router = useRouter();
   const { data: session } = useSession();
   const { openSplash } = useSplashScreen();

   function tresst () {
      openSplash({
         style: "normal",
         title: "Hey",
         description: "vicksstar",
         actions: [
            { label: "hello", action: () => toast("hello"), appearance: "normal" }
         ]
      })
   }

   return (
      <AppWrapper>
         <div className="box full h-full pd-1">
            <div className="box full mt-15">
               <div className="box full mb-1 dfb align-center justify-center">
                  <CustomRawIcon url={CustomIconUrls.WelcomeIcon} size={150} />
               </div>
               <div className="text-l full dfb wrap gap-5 align-center justify-center">Hello, <span className="text-l bold-600 fit">{session?.user?.name}</span></div>
               <div className="text-xxs full pd-05 text-center">{welcomeString}</div>
            </div>

            <div className="box full dfb column gap-10 align-center pd-4">
               <button className="xs pd-15 full mw-500 radius-20" onClick={() => router.push("/quiz-maker")}>
                  <Lightbulb size={19} /> Start A Quiz
               </button>
               <button className="xs pd-15 full mw-500 radius-20 outline-black" onClick={() => router.push("/note-maker")}>
                  <BookOpen size={19} /> Learn Something
               </button>
            </div>
         </div>
      </AppWrapper>
   )
}
