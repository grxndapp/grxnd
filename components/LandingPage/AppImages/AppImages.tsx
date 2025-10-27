'use client'
import "./AppImages.css"
import Spacing from "@/components/Spacing/Spacing"

export default function AppImages () {
	const appImagesList = [
		"/features/ai-note-maker.png",
		"/features/ai-tools.png",
		"/features/quiz-view.png",
	]

	return (
		<>
			<div className="app-images">
				<div className="app-images-wrapper">
					<div className="box full pd-3">
						<div className="text-xmb full text-center bold-700">App Images</div>
					</div>
					<div className="list-images">
						{appImagesList.map((appImage, index) => (
							<div className="app-image" key={index}>
								<img src={appImage} alt="app image" />
							</div>
						))}
					</div>
				</div>
			</div>
			<Spacing size={4} />
		</>
	)
}
