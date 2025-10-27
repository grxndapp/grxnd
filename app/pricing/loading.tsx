import "@/styles/landing.css"
import Header from "@/components/LandingPage/Header/Header";
import Spacing from "@/components/Spacing/Spacing";
import Footer from "@/components/LandingPage/Footer/Footer";

export default async function LoadingPricingPage () {
   return (
      <div className='landing-page'>
         <Header />
         <div className="box full pd-2" style={{ background: "linear-gradient(to bottom, #dbd9ff, #ffffff)" }}>
            <div className="hero-section-headline text-b">Loading Grxnd App Pricing</div>
         </div>
         <Spacing size={8} />
         <Footer />
      </div>
   )
}
