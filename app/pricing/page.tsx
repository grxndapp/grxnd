import "@/styles/landing.css"
import { CSSProperties } from "react";
import { Check } from "lucide-react";
import { dalCheckUserSubscription } from "@/dal/helpers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Header from "@/components/LandingPage/Header/Header";
import Card from "@/components/Card/Card";
import Spacing from "@/components/Spacing/Spacing";
import Footer from "@/components/LandingPage/Footer/Footer";
import Link from "next/link";

export const plans = [
   {
      priceId: "price_1SMdYFCVAZUVXTsBQzqrWSGF",
      billingLink: "https://buy.stripe.com/test_28E5kCcKcc0J6IA9DccQU00",
      price: 2.99,
      duration: '/month'
   },
   {
      priceId: "price_1SMdhOCVAZUVXTsBwOYgk8LE",
      billingLink: "https://buy.stripe.com/test_8x200i11uc0J1og2aKcQU01",
      price: 55,
      duration: 'lifetime'
   }
]

export default async function PricingPage () {
   const subscriptionStatus = await dalCheckUserSubscription();
   if (subscriptionStatus == "subscribed") redirect("/home");

   const session = await getServerSession(authOptions);

   const pricingCardStyles: CSSProperties = {
      width: "500px", padding: "25px",
      border: "1px solid #ebf0ffff",
      boxShadow: "0 2px 8px rgba(44, 48, 59, 0.2)"
   }

   return (
      <div className='landing-page'>
         <Header />
         <div className="box full pd-2" style={{ background: "linear-gradient(to bottom, #dbd9ff, #ffffff)" }}>
            <div className="hero-section-headline text-b">Grxnd App Pricing</div>
            <div className="text-s full text-center pd-1 mb-2 pdx-2">Flexible pricing plans so you can enjoy the Grxnd app experience</div>
            <div className="box pd-2 pdx-2 full dfb align-center justify-center gap-30 wrap">
               <Card styles={pricingCardStyles}>
                  <div className="text-s bold-500 full mb-05">Standard</div>
                  <div className="text-xl bold-800 full">£2.99</div>
                  <div className="text-xxxs grey-5 full mb-15">per month</div>
                  <div className="text-xxs full dfb align-center gap-5 pd-1"><Check size={16} color="#1121ff" /> AI Timetable Maker</div>
                  <div className="text-xxs full dfb align-center gap-5 pd-1"><Check size={16} color="#1121ff" /> AI Notes Generator</div>
                  <div className="text-xxs full dfb align-center gap-5 pd-1"><Check size={16} color="#1121ff" /> AI Quiz Builder</div>
                  <div className="text-xxs full dfb align-center gap-5 pd-1"><Check size={16} color="#1121ff" /> AI Essay Grader</div>
                  <div className="text-xxs full dfb align-center gap-5 pd-1"><Check size={16} color="#1121ff" /> AI Essay Writer</div>
                  <div className="text-xxs full dfb align-center gap-5 pd-1"><Check size={16} color="#1121ff" /> Collaborative Quizzes</div>
                  <div className="text-xxs full dfb align-center gap-5 pd-1"><Check size={16} color="#1121ff" /> Global Leaderboard Access</div>
                  <br />
                  <Link href={`${plans[0].billingLink}?prefilled_email=${session?.user?.email}`} target="_blank">
                     <button className="xxs pd-12 full">Subscribe</button>
                  </Link>
               </Card>

               <Card styles={pricingCardStyles}>
                  <div className="text-s bold-500 full mb-05">LifeTime Access</div>
                  <div className="text-xl bold-800 full">£55.00</div>
                  <div className="text-xxxs grey-5 full mb-15">one time payment</div>
                  <div className="text-xxs full dfb align-center gap-5 pd-1"><Check size={16} color="#1121ff" /> All Standard Features</div>
                  <div className="text-xxs full dfb align-center gap-5 pd-1"><Check size={16} color="#1121ff" /> Unlimited Access — Forever</div>
                  <div className="text-xxs full dfb align-center gap-5 pd-1"><Check size={16} color="#1121ff" /> No Monthly Payments</div>
                  <div className="text-xxs full dfb align-center gap-5 pd-1"><Check size={16} color="#1121ff" /> Priority Feature Updates</div>
                  <div className="text-xxs full dfb align-center gap-5 pd-1"><Check size={16} color="#1121ff" /> Early Access to New Tools</div>
                  <Spacing size={5} />
                  <Link href={`${plans[1].billingLink}?prefilled_email=${session?.user?.email}`} target="_blank">
                     <button className="xxs pd-12 full">Purchase</button>
                  </Link>
               </Card>
            </div>
         </div>
         <Spacing size={8} />
         <Footer />
      </div>
   )
}
