'use client'
import "@/styles/landing.css"
import Header from "@/components/LandingPage/Header/Header";
import Footer from "@/components/LandingPage/Footer/Footer";

export default function LandingPage () {
	return (
		<div className='landing-page'>
         <Header />
         <div className="box full pd-4 pdx-5">
				<h1>Page Not Found</h1>
				<p>We were not able to find the page you are looking for, it has probably been deleted or it doesn't exist</p>
			</div>
         <Footer />
		</div>
	)
}
