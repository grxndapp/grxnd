'use client'
import "./InstallOnIos.css"
import Card from "@/components/Card/Card"
import Spacing from "@/components/Spacing/Spacing"

export default function InstallOnIos() {

	const installSteps = [
		{ description: "Tap on the share icon at the bottom of your browser (safari)", image: "/install-guide/step1.jpg" },
		{ description: "Tap on 'Add to home screen'", image: "/install-guide/step2.jpg" },
		{ description: "Tap on 'Add' and the app should appear on your home screen", image: "/install-guide/step3.jpg" },
	]


	return (
		<>
			<div className="ios-install">
				<div className="ios-install-wrapper">
					<div className="box full pd-2">
						<div className="text-xmb full text-center bold-700">Install on iOS</div>
					</div>
					<div className="install-cards">
						{installSteps.map((installStep, index) => (
							<Card key={index} styles={{
								width: "350px", height: "fit-content",
								padding: "15px 20px", border: "1px solid #ebebeb",
								borderRadius: "18px", boxShadow: "0 2px 5px rgba(5, 5, 5, 0.1)"
							}}>
								<div className="install-card-image">
									<img src={installStep.image} alt="step image" />
								</div>
								<div className="text-m pd-1 full bold-700">Step {index+1}</div>
								<div className="text-xxs grey-5 full">{installStep.description}</div>
								<Spacing size={1} />
							</Card>
						))}
					</div>
				</div>
			</div>
			<Spacing size={4} />
		</>
	)
}
