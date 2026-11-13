'use client'
import "@/styles/landing.css"
import Header from "@/components/LandingPage/Header/Header";
import HeroSection from "@/components/LandingPage/HeroSection/HeroSection";
import Footer from "@/components/LandingPage/Footer/Footer";
import InfoSubjects from "@/components/LandingPage/InfoSubjects/InfoSubjects";
import InstallOnIos from "@/components/LandingPage/InstallOnIos/InstallOnIos";
import Features from "@/components/LandingPage/Features/Features";

export default function LandingPage () {
	return (
		<div className='landing-page'>
         <Header />
         <HeroSection />
			<InfoSubjects />
			<Features />
			<InstallOnIos />
         <Footer />
		</div>
	)
}
