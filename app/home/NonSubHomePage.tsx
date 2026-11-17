'use client'
import "@/styles/paywall.css"
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Check, Crown, UserRoundCog } from 'lucide-react';
import { BiSolidZap } from "react-icons/bi";
import { SubjectIconBubble } from "@/styles-extra/styles";
import { CustomIcon } from "@/components/Icons/Icon";
import { useModal } from "@/components/Modal/ModalContext";
import { formatNumber } from "@/utils/num";
import Spacing from '@/components/Spacing/Spacing';
import SubscribeButton from "@/components/SubscribeButton/SubscribeButton";
import userDefaultImage from "@/public/user-def.png"

export default function NonSubHomePage() {
   const router = useRouter();
   const { data: session } = useSession();
   const { showModal, close } = useModal();

   const offers = [
      "Turn your notes into quizzes in seconds",
      "Take notes without being in class",
      "Unlock a surprise bonus when you subscribe",
   ]

   const SubjectIconBubbleAccent = {
      ...SubjectIconBubble, background: "var(--accent-color-10)", color: "var(--accent-color)",
      width: "fit-content"
   }
   
   function handleNavbarModal () {
      showModal({
         content: (
            <div className="box full pd-1 pdx-1">
               <div className="box full pd-15">
                  <div className="box full pd-1 mb-1">
                     <CustomIcon url={session?.user?.image! || userDefaultImage.src} size={120} round />
                  </div>
                  <div className="text-l full dfb align-center wrap gap-5">Hello, <span className="text-l bold-600 fit" style={{ wordBreak: "break-all" }}>{session?.user?.name}</span></div>

                  <div className="box full dfb column pd-15">
                     <div className="text-xxs grey-5 full">Your Points</div>
                     <div 
                        className="text-xxb full h-full bold-700 mb-1"
                        style={{
                           background: "linear-gradient(to bottom, var(--accent-color-70), var(--accent-color))",
                           backgroundClip: "text", color: "transparent"
                        }}
                     >
                        {formatNumber(0, { useCommas: true })}
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
   
   return (
      <div className='paywall'>
         <div className="paywall-container">
            <div className="box full pd-1 dfb align-center">
               <div className="box full">
                  <div className="upgrade-pill">
                     <BiSolidZap size={17} /> UPGRADE
                  </div>
               </div>
               <div className="box fit dfb align-center justify-end" onClick={handleNavbarModal}>
                  <CustomIcon url={session?.user?.image! || userDefaultImage.src} size={50} round />
               </div>
            </div>
            <div className="text-xxl bold-700 full pd-1 line-height-12">
               <span className="accent-color">{session?.user?.name}</span>,<br />We've got a deal for you.
            </div>
            <div className="text-xxs full text-left pd-05">Join <b>100+ people</b> on <b className="accent-color">Grxnd</b> and study better using AI</div>
            <Spacing />

            <div className="box full dfb align-center gap-15">
               <div className="strikethrough-price text-sm bold-600"><span style={{color:"black"}}>£10.99</span></div>
               <div className="text-s accent-color bold-600">64% discount!</div>
            </div>
            <div className="box full pd-05">
               <div className="text-xxb full bold-700 line-height-10">£3.99</div>
               <div className="text-xxs grey-5 line-height-10">per month</div>
            </div>
            <Spacing />

            <div className="paywall-card">
               {offers.map((offer, index) => (
                  <div key={index} className="box full dfb align-center gap-10">
                     <div className="box full dfb align-center gap-15">
                        <div style={SubjectIconBubbleAccent}>
                           <Check size={15} />
                        </div>
                        <div className="text-xxxs bold-600 full line-height-13 pd-1">{offer}</div>
                     </div>
                  </div>
               ))}
            </div>
            <Spacing />

            <div className="box full pd-1 dfb column gap-10">
               <div className="text-xxxs grey-5 line-height-10 full text-center">The price stays £3.99/month, if you unlock now!</div>
               <SubscribeButton>
                  <Crown size={17} /> Unlock Grxnd Pro !
               </SubscribeButton>
            </div>

            <Spacing size={7} />

         </div>
      </div>
   )
}
