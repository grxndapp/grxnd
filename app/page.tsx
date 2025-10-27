'use client'
import "@/styles/landing.css"
import Header from "@/components/LandingPage/Header/Header";
import HeroSection from "@/components/LandingPage/HeroSection/HeroSection";
import Footer from "@/components/LandingPage/Footer/Footer";
import InfoSubjects from "@/components/LandingPage/InfoSubjects/InfoSubjects";
import InstallOnIos from "@/components/LandingPage/InstallOnIos/InstallOnIos";
import Features from "@/components/LandingPage/Features/Features";
import AppImages from "@/components/LandingPage/AppImages/AppImages";

export default function LandingPage () {
	return (
		<div className='landing-page'>
         <Header />
         <HeroSection />
			<InfoSubjects />
			<AppImages />
			<Features />
			<InstallOnIos />
         <Footer />
		</div>
	)
}
