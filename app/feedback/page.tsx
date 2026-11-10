'use client'
import "@/styles/landing.css"
import { useState } from "react";
import { useSession } from 'next-auth/react';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CustomIcon } from "@/components/Icons/Icon";
import { Mail, SendHorizontal } from "lucide-react";
import { userCreateFeedback } from "../actions/feedback";
import Header from "@/components/LandingPage/Header/Header";
import Footer from "@/components/LandingPage/Footer/Footer";
import Spacing from "@/components/Spacing/Spacing";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import UserDefaultImage from "@/public/user-def.png"
import Link from "next/link";

export default function FeedbackPage () {
   const { data: session, status } = useSession();
   const router = useRouter();
   const [feedback, setFeedback] = useState('');
   const [feedbackSentToGrxnd, setFeedbackSentToGrxnd] = useState(false);
   const [feedbackError, setFeedbackError] = useState("");
   
   const sendFeedbackDCBtn = async (callback: Function) => {
      setFeedbackError('')
      if (feedback.trim() == "") {
         setFeedbackError("Please enter your feedback")
         callback();
         return;
      }
      if (feedback.length > 500) {
         setFeedbackError("Too many characters. Max 500 Characters.")
         callback();
         return;
      }

      const feedbackSent = await userCreateFeedback(feedback);
      if (feedbackSent.sent) {
         toast.success("Thanks for your feedback!");
         setFeedbackSentToGrxnd(feedbackSent.sent);
      } else {
         setFeedbackError(feedbackSent.error!);
      }
      callback();
   }

   return (
      <div className='landing-page'>
         <Header />
         <div className="box full pd-2 dfb column align-center" style={{ background: "linear-gradient(to bottom, #dbd9ff, #ffffff)" }}>
            {(session?.user) ? (<>
               {feedbackSentToGrxnd ? (<>
                  <div className="text-xb full bold-700 text-center mb-3 accent-color-gradient-dark-text">THANKS FOR THE FEEDBACK</div>
                  <div className="box full dfb align-center justify-center">
                     <div className="text-xs full text-center mb-2" style={{ width:"100%", maxWidth:"700px" }}>
                        We are doing our best to make sure that Grxnd is the best place for anyone to study effectively using AI.   
                     </div>
                  </div>
                  <Spacing />
                  <div className="box full dfb justify-center">
                     <button className="xxs pd-13 full mw-500 accent-hover" onClick={() => router.push("/home")}>
                        <CustomIcon url={session.user.image!} size={20} round /> Back to Grxnd
                     </button>
                  </div>
                  <Spacing size={10} />
               </>) : (<>
                  <div className="text-xb full bold-700 text-center mb-3 accent-color-gradient-dark-text">GIVE US FEEDBACK</div>
                  <div className="hero-section-headline text-xxl full bold-700 text-center">We'd love to hear from you!</div>
                  <div className="box full dfb column align-center justify-center">
                     <div className="text-xs full text-center mb-2" style={{ width:"100%", maxWidth:"700px" }}>
                        Your thoughts, suggestions, and feedback help us improve. Share your experience below — whether it's something you liked, something we can do better, or an idea you want to see. Every message goes directly to us.   
                     </div>
                     {feedbackError && <div className="text-xs full text-center mb-2 error-text" style={{ width:"100%", maxWidth:"700px" }}>{feedbackError}</div>}
                  </div>
                  <div className="box full dfb align-center justify-center">
                     <div style={{ width:"100%", maxWidth:"600px" }}>
                        <textarea    
                           className="xxs pd-2 pdx-2 feedback-input" 
                           placeholder="Your Feedback" 
                           value={feedback}
                           onChange={(e) => setFeedback(e.target.value)}   
                        />
                        <Spacing />
                        <div className="text-xxxs full text-center mb-2" style={{ width:"100%", maxWidth:"700px" }}>
                           You can only send us feedback once a week. So please put some thought into it!   
                        </div>
                        <Spacing />
                        <div className="box full dfb justify-center">
                           <AwaitButton className="xxs pd-13 full mw-500" onClick={sendFeedbackDCBtn}>
                              Send Feedback <SendHorizontal size={15} />
                           </AwaitButton>
                        </div>
                     </div>
                  </div>
               </>)}
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
         <div className="box full pd-4">
            <div className="hero-section-headline text-xxl full bold-700 text-center">Contact Us</div>
            
            <div className="box full dfb align-center justify-center">
               <div className="text-xs full text-center mb-2" style={{ width:"100%", maxWidth:"700px" }}>
                  Reach us directly via email   
               </div>
            </div>

            <div className="box full dfb align-center justify-center">
               <Link className="box fit mb-2" href={`mailto:grxndapp@gmail.com`} target='_blank'>
                  <button className="xxs pd-12 pdx-3"><Mail size={20} /> Mail Us !</button>
               </Link>
            </div>
         </div>
         <Footer />
      </div>
   )
}
