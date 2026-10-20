'use client'
import "@/styles/paywall.css"
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Check, Crown } from 'lucide-react';
import { BiSolidZap } from "react-icons/bi";
import { SubjectIconBubble } from "@/styles-extra/styles";
import { grxndSubscriptionLink } from "@/lib/stripe";
import Spacing from '@/components/Spacing/Spacing';
import Link from "next/link";

export default function NonSubHomePage() {
   const router = useRouter();
   const { data: session } = useSession();

   const offers = [
      "Turn your notes into quizzes in seconds",
      "Take notes without being in class",
      "Unlock a surprise bonus when you subscribe",
   ]

   const SubjectIconBubbleAccent = {
      ...SubjectIconBubble, background: "var(--accent-color-10)", color: "var(--accent-color)",
      width: "fit-content"
   }
   
   return (
      <div className='paywall'>
         <div className="paywall-container">
            <Spacing />
            <div className="box full pd-1">
               <div className="upgrade-pill">
                  <BiSolidZap size={17} /> UPGRADE
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
               <Link className="box full" href={`${grxndSubscriptionLink}?prefilled_email=${session?.user?.email}`} target="_blank">
                  <button className="xxs pd-12 full">
                     <Crown size={17} /> Unlock Grxnd Pro !
                  </button>
               </Link>
            </div>

            <Spacing size={7} />

         </div>
      </div>
   )
}
