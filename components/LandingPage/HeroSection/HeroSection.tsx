'use client'
import "./Hero.css"
import { ArrowRight, Mail } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CustomIcon } from "@/components/Icons/Icon";
import HeroTag from "./HeroTag"
import Link from "next/link";
import Spacing from "@/components/Spacing/Spacing";

export default function HeroSection () {
   const { data: session } = useSession();
   const router = useRouter();

   return (
      <>
         <div className="hero">
            <HeroTag />
            <div className="hero-section-headline bold-800 mb-1 text-center pd-15 pdx-3">
               Your study grind, powered by AI
            </div>
            <div className="hero-sub-headline mb-2 text-center pdx-1">
               Build your timetable, generate notes and quizzes, grade essays, and challenge friends worldwide — all powered by AI.
            </div>
            <div className="ct-actions dfb align-center justify-center gap-10 mb-3">
               {session?.user ? <>
                  <button className="xxs pd-13 pdx-3" onClick={() => router.push('/home')}>
                     <CustomIcon url={session.user.image!} size={17} round /> Continue to App <ArrowRight size={17} />
                  </button>
               </> : <>
                  <button className="xxs pd-13 pdx-3" onClick={() => router.push('/sign-in')}>
                     Get Started <ArrowRight size={17} />
                  </button>
               </>}
               <Link href="/feedback" target="_blank">
                  <button className="outline-black xxs pd-13 pdx-3">Contact Us <Mail size={17} /></button>
               </Link>
            </div>
         </div>
      </>
   )
}
