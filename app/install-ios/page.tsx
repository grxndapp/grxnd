import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Card from "@/components/Card/Card";
import Spacing from "@/components/Spacing/Spacing";
import { dalRequireAuthRedirect } from "@/dal/helpers";

export default async function InstallIosPage () {
   await dalRequireAuthRedirect();

   const installSteps = [
      { description: "Tap on the share icon at the bottom of your browser (safari)", image: "/install-guide/step1.jpg" },
      { description: "Tap on 'Add to home screen'", image: "/install-guide/step2.jpg" },
      { description: "Tap on 'Add' and the app should appear on your home screen", image: "/install-guide/step3.jpg" },
	]

   return (
      <AppWrapper>
         <div className="box full h-full">
            <div className="text-xxl bold-700 full dfb align-center justify-center gap-7">
               Ios Installation
            </div>
            <div className="text-xs full text-center pd-1">
               Follow the 3 steps below to install the <b className="accent-color">Grxnd</b> App on your iPhone/iPad
            </div>
            <Spacing size={1} />
            <div className="box full h-fit dfb column align-center gap-20">
               {installSteps.map((installStep, index) => (
                  <Card key={index} styles={{
                     width: "350px", height: "fit-content", padding: "15px 20px",
                     border: "none", borderRadius: "0", boxShadow: "none"
                  }}>
                     <div className="box full" style={{borderRadius:"15px"}}>
                        <img 
                           src={installStep.image} alt="step image"
                           style={{
                              width: "100%", objectFit: "contain", objectPosition: "center", borderRadius:"15px"
                           }}
                        />
                     </div>
                     <div className="text-m pd-1 full bold-700">Step {index+1}</div>
                     <div className="text-xxs grey-5 full">{installStep.description}</div>
                     <Spacing size={1} />
                  </Card>
               ))}
            </div>
            <Spacing size={4} />
         </div>
      </AppWrapper>
   )

}
