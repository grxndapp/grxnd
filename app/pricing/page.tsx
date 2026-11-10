import "@/styles/landing.css"
import { CSSProperties } from "react";
import { BookOpenCheck, ListChecks, Notebook, ReceiptPoundSterling, Trophy, Zap } from "lucide-react";
import { dalCheckUserSubscription } from "@/dal/helpers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { CustomIcon } from "@/components/Icons/Icon";
import Header from "@/components/LandingPage/Header/Header";
import Card from "@/components/Card/Card";
import Spacing from "@/components/Spacing/Spacing";
import Footer from "@/components/LandingPage/Footer/Footer";
import Link from "next/link";
import UserDefaultImage from "@/public/user-def.png"
import SubscribeButton from "@/components/SubscribeButton/SubscribeButton";


export default async function PricingPage () {
   const subscriptionStatus = await dalCheckUserSubscription();
   if (subscriptionStatus == "subscribed") redirect("/home");

   const session = await getServerSession(authOptions);

   const pricingCardStyles: CSSProperties = {
      width: "500px", padding: "35px",
      border: "1px solid #ebf0ffff",
      boxShadow: "0 2px 8px rgba(44, 48, 59, 0.2)",
      borderRadius: "30px"
   }

   return (
      <div className='landing-page'>
         <Header />
         <div className="box full pd-2" style={{ background: "linear-gradient(to bottom, #dbd9ff, #f0efff)" }}>
            <div className="hero-section-headline text-b">GRXND APP PRICING</div>
            <div className="text-s full text-center pd-1 mb-1 pdx-2">Flexible pricing plan so you can enjoy the Grxnd app experience</div>
            <div className="box pd-2 pdx-2 full dfb align-center justify-center gap-30 wrap">
               <Card styles={pricingCardStyles}>
                  <div className="text-s bold-500 full">Standard</div>
                  <div className="text-xxxl bold-800 full">£3.99</div>
                  <div className="text-xxxs grey-5 full mb-15">per month</div>
                  <div className="text-xxs full dfb align-center gap-5 pd-1">
                     <Notebook size={16} color="#1121ff" /> AI Notes Generator
                  </div>
                  <div className="text-xxs full dfb align-center gap-5 pd-1">
                     <ListChecks size={16} color="#1121ff" /> AI Quiz Builder
                  </div>
                  <div className="text-xxs full dfb align-center gap-5 pd-1">
                     <BookOpenCheck size={16} color="#1121ff" /> Exam Ready Score
                  </div>
                  <div className="text-xxs full dfb align-center gap-5 pd-1">
                     <Zap size={16} color="#1121ff" /> Fast Learning Tool
                  </div>
                  <div className="text-xxs full dfb align-center gap-5 pd-1">
                     <ReceiptPoundSterling size={16} color="#1121ff" /> Cash Giveaways Every Week
                  </div>
                  <div className="text-xxs full dfb align-center gap-5 pd-1">
                     <Trophy size={16} color="#1121ff" /> Global Leaderboard Access
                  </div>
                  <br />
                  {session?.user ? (
                     <SubscribeButton />
                     // <Link href={`${plans[0].billingLink}?prefilled_email=${session?.user?.email}`} target="_blank">
                     //    <button className="xxs pd-15 full accent-hover">
                     //       <UserRoundPlus size={18} /> Subscribe
                     //    </button>
                     // </Link>
                  ) : (
                     <Link href='/sign-in?redirect=pricing' target="_blank">
                        <button className="xxs pd-15 full"><CustomIcon url={UserDefaultImage.src} size={20} round /> Sign In</button>
                     </Link>
                  )}
               </Card>
            </div>
            <Spacing size={8} />
         </div>
         <Footer />
      </div>
   )
}
