"use client"
import "./AppWrapper.css"
import "@/styles/app.css"
import { ReactNode, RefObject, useEffect, useState } from 'react'
import { Backpack, ChevronRight, House, UserRoundCog } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CustomIcon } from '../Icons/Icon'
import { useModal } from "../Modal/ModalContext"
import { getCurrentUserScore } from "@/app/actions/user"
import { formatNumber } from "@/utils/num"
import userDefaultImage from "@/public/user-def.png"


export default function AppWrapper ({ children, noNavbar, contentRef }: { children: ReactNode, noNavbar?: boolean, contentRef?: RefObject<any | null> }) {
   const router = useRouter();
   const { data: session } = useSession();
   const { showModal, close } = useModal();
   const pathname = usePathname();
   const [score, setScore] = useState(0);
   
   async function getUserScore () {
      const score = await getCurrentUserScore();
      setScore(score ?? 0);
   }

   useEffect(() => {
      getUserScore()
   }, [])
   
   function handleNavbarModal () {
      showModal({
         content: (
            <div className="box full pd-1 pdx-1">
               <div className="box full pd-15">
                  <div className="box full pd-1 mb-1">
                     <CustomIcon url={session?.user?.image! || userDefaultImage.src} size={120} round />
                  </div>
                  <div className="text-l full dfb wrap gap-5">Hello, <span className="text-l bold-600 fit">{session?.user?.name}</span></div>

                  <div className="box full dfb column pd-15">
                     <div className="text-xxs grey-5 full">Your Points</div>
                     <div 
                        className="text-xxb full h-full bold-700 mb-1"
                        style={{
                           background: "linear-gradient(to bottom, var(--accent-color-70), var(--accent-color))",
                           backgroundClip: "text", color: "transparent"
                        }}
                     >
                        {formatNumber(score, { useCommas: true })}
                     </div>
                     <div 
                        className="text-xxs fit visible-link accent-color dfb align-center"
                        onClick={() => { router.push("/leaderboard"); close(); }}
                     >
                        Global Leaderboard <ChevronRight size={17} />
                     </div>
                  </div>
                  
                  <div className="box full pd-1 dfb gap-20 wrap">
                     <button className="xxs pd-13 full mw-300 tiny-shadow" onClick={() => { router.push("/settings"); close() }}>
                        <UserRoundCog size={17} /> Account Settings
                     </button>
                  </div>
               </div>
            </div>
         )
      })
   }

   const mobilePagesBackPackAllow = [
      '/settings', '/home', '/notebooks', '/notebook',
      '/note-maker', '/tools', '/quiz-stat', '/leaderboard'
   ]

   return (
      <div className="app">
         <div className="account-bar-wrapper">
            <div className="account-bar">
               {!noNavbar ? (<>
                  <div className="box full dfb align-center gap-10">
                     <div className="hamburger-menu-btn" onClick={() => router.push("/home")}>
                        <House size={23} />
                     </div>
                     <div className="hamburger-menu-btn" onClick={() => router.push("/backpack")}>
                        <Backpack size={23} />
                     </div>
                  </div>
               </>) : (
                  <div />
               )}
               <div className="account-image" onClick={handleNavbarModal}>
                  <CustomIcon url={session?.user?.image! || userDefaultImage.src} size={50} round />
               </div>
            </div>
         </div>
         <div className="content" ref={contentRef}>
            <div className="content-wrapper">
               {children}
            </div>
            {mobilePagesBackPackAllow.some(p => pathname.startsWith(p)) && (
               <div className="mobile-backpack-accessible-btn" onClick={() => router.push("/backpack")}>
                  <Backpack size={23} />
               </div>
            )}
         </div>
      </div>
   )
}