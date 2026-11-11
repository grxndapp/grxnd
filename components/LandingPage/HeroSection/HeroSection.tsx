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
      <div className="hero-container">
         <div className="hero">
            <Spacing size={2} />
            <div className="box full pd-1">
               <HeroTag />
            </div>
            <div className="hero-section-headline bold-800 text-left mt-2" style={{ padding: 0 }}>
               STUDY SMARTER <br /> NOT HARDER
            </div>
            <div className="box full mw-800">
               <div className="hero-sub-headline mb-2 text-left pd-05">
                  Plan your academic comeback, generate <b className="accent-color">smart notes</b>, <b className="accent-color">quizzes</b>, <b className="accent-color">grade your essays</b>, learn using our <b className="accent-color">magic tools</b> and ascend your studying all powered by AI.
               </div>
            </div>
            <div className="ct-actions mb-3">
               {session?.user ? <>
                  <button className="xxs pd-15 pdx-3 accent-hover" onClick={() => router.push('/home')}>
                     <CustomIcon url={session.user.image!} size={17} round /> Continue <ArrowRight size={17} />
                  </button>
               </> : <>
                  <button className="xxs pd-15 pdx-3" onClick={() => router.push('/sign-in')}>
                     Get Started <ArrowRight size={17} />
                  </button>
               </>}
               <Link href="/feedback" target="_blank" className="box">
                  <button className="outline-black xxs pd-15 pdx-3 full">Contact Us <Mail size={17} /></button>
               </Link>
            </div>
         </div>
      </div>
   )
}
