'use client'
import "./InstallOnIos.css"
import { FaAndroid, FaApple } from "react-icons/fa6";

export default function InstallOnIos() {
	return (
		<div className="install-app">
			<div className="install-wrapper">
				<div className="text-xxs full grey-5 bold-500 text-center">Get Started Today!</div>
				<div className="text-xxxb full bold-800 accent-color-gradient-dark-text line-height-12 text-center">
					INSTALL <br /> ON MOBILE
				</div>
				<div className="box full pd-1 line-height-15">
					<div className="text-s full text-center">
						Although <b className="accent-color">Grxnd</b> is on the web, we made it accessible to your phone. 
					</div>
					<div className="text-s full text-center">
						So you can <b className="accent-color">study everywhere and anywhere</b>!
					</div>
				</div>
				<div className="box full pd-2 dfb align-center justify-center wrap gap-10">
					<button className="xs pd-1 accent-hover pd-15 pdx-3 radius-20">
						<FaApple size={18} /> Install on iOS
					</button>
					<button className="xs pd-1 accent-color-50 pd-15 pdx-3 radius-20">
						<FaAndroid size={18} /> Install on Android
					</button>
				</div>
			</div>
		</div>
	)
}
