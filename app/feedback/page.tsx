'use client'
import "@/styles/landing.css"
import { useState } from "react";
import { useSession } from 'next-auth/react';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CustomIcon } from "@/components/Icons/Icon";
import { SendHorizontal } from "lucide-react";
import Header from "@/components/LandingPage/Header/Header";
import Footer from "@/components/LandingPage/Footer/Footer";
import Spacing from "@/components/Spacing/Spacing";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import UserDefaultImage from "@/public/user-def.png"

export default function FeedbackPage () {
   const { data: session, status } = useSession();
   const router = useRouter();
   const [feedback, setFeedback] = useState('');
   
   const sendFeedbackDCBtn = async () => {
      try {
         const grxndLogoUrl = "https://media.discordapp.net/attachments/1291120913936285750/1367930670499758140/grxnd_logo.png?ex=68d19536&is=68d043b6&hm=7d7380fb16cfbda2aacac3f491572f3bcffd0b7852583f4c961a574ae1eee977&=&format=webp&quality=lossless&width=522&height=522";
         const discordWebHookUrl = "https://discord.com/api/webhooks/1419399985501573130/t3wq9zPKmvSctdHFLINcLeBIeSknQbmiD95Tu6gmk8K2dr2A4GGl5jceKegSRPemhJYv";
         const request = new XMLHttpRequest();
         request.open("POST", discordWebHookUrl);
         request.setRequestHeader('Content-type', 'application/json');
         const params = {
            username: "Feedback Logger",
            avatar_url: grxndLogoUrl,
            content: `**User :** ${session?.user?.name}\n**Email :** ${session?.user?.email}\n**Date :** ${new Date(Date.now()).toUTCString()}\n**Feedback :** ${feedback}`,
         }
         request.send(JSON.stringify(params));
         toast.success("Feedback Sent. Thank you!");
         setFeedback("");
      } catch (e) {
         toast.error("Failed to send feedback");
      }
   }

   return (
      <div className='landing-page'>
         <Header />
         <div className="box full pd-2" style={{ background: "linear-gradient(to bottom, #dbd9ff, #ffffff)" }}>
            <div className="text-xb full bold-700 text-center mb-3">Give Us Feedback</div>

            {(session?.user) ? (<>
               <div className="hero-section-headline text-xxl full bold-700 text-center">We'd love to hear from you!</div>
               
               <div className="box full dfb align-center justify-center">
                  <div className="text-xs full text-center mb-2" style={{ width:"100%", maxWidth:"700px" }}>
                     Your thoughts, suggestions, and feedback help us improve. Share your experience below — whether it's something you liked, something we can do better, or an idea you want to see. Every message goes directly to us.   
                  </div>
               </div>

               <div className="box full dfb align-center justify-center">
                  <div style={{ width:"100%", maxWidth:"600px" }}>
                     <textarea    
                        className="xxs pd-2 pdx-2 feedback-input" 
                        placeholder="Your Feedback" 
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}   
                     />
                     <Spacing size={2} />
                     <AwaitButton className="xxs pd-13 full" onClick={sendFeedbackDCBtn}>
                        Send Feedback <SendHorizontal size={15} />
                     </AwaitButton>
                  </div>
               </div>
            
            </>) : (<>
               {(status == "loading") ? (<></>) : (<>
                  <div className="hero-section-headline text-xxl full bold-700 text-center">Sign Up to leave us a feedback</div>
                  <div className="box full dfb align-center justify-center">
                     <div className="text-xs full text-center mb-2" style={{ width:"100%", maxWidth:"700px" }}>
                        Create an account so we know who you are
                     </div>
                  </div>
                  <div className="box full dfb align-center justify-center">
                     <div className="box dfb align-center justify-center" style={{ width:"100%", maxWidth:"600px" }}>
                        <button className="xxs pd-12 pdx-3" onClick={() => router.push("/sign-in")}>
                           <CustomIcon url={UserDefaultImage.src} size={20} round />
                           Sign Up Today !
                        </button>
                     </div>
                  </div>
               
               </>)}
            </>)}
            <Spacing size={3} />
         </div>
         <div className="box full pd-2">
            <div className="hero-section-headline text-xxl full bold-700 text-center">Contact Us</div>
            
            <div className="box full dfb align-center justify-center">
               <div className="text-xs full text-center mb-2" style={{ width:"100%", maxWidth:"700px" }}>
                  Reach us directly via email   
               </div>
            </div>

            <div className="box full dfb align-center justify-center">
               <div className="text-xs full text-center mb-2" style={{ width:"100%", maxWidth:"700px" }}>
                  grxndapp@gmail.com
               </div>
            </div>

            <Spacing size={3} />
         </div>
         <Footer />
      </div>
   )
}
