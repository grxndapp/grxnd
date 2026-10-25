'use client'
import { useRouter } from "next/navigation";
import { CustomIcon } from "@/components/Icons/Icon";
import { StaticImageData } from "next/image";
import { BackpackOpenIconBubble } from "@/styles-extra/styles";
import { ArrowRight } from "lucide-react";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Card from "@/components/Card/Card";
import TimeTableIcon from "@/public/timetable.png"
import ExamReadyScoreIcon from "@/public/exam-ready-score.png"
import Spacing from "@/components/Spacing/Spacing";

export default function BackPackPage () {
   return (
      <AppWrapper>
         <div className="box full h-full pd-1">
            <div className="box full pd-05 dfb column">
               <div className="text-xl bold-700 full">Your Backpack</div>
            </div>
            <div className="box full pd-1">
               <BackPackTool 
                  style="wide" icon={ExamReadyScoreIcon}
                  label="Exam Ready Score" description="How ready are you for your next exam"
                  href="/exam-ready-score"
               />
            </div>
            <div className="box full pd-1">
               <BackPackTool 
                  style="wide" icon={TimeTableIcon}
                  label="Personal Timetable" description=""
                  href="/backpack" comingSoon
               />
            </div>
            <Spacing size={4} />
         </div>
      </AppWrapper>
   )
}

type BackPackToolProps = {
   label: string;
   href: string;
   description: string;
   icon: StaticImageData;
   style: "wide" | "slim";
   comingSoon?: boolean;
}

function BackPackTool ({ label, href, style, description, icon, comingSoon }: BackPackToolProps) {
   const router = useRouter();

   if (style == "wide") {
      return (
         <Card
            styles={{
               backgroundColor: "#88a4ff6e", width: "100%", height: "200px",
               border: "1px solid #e9e9e9", padding: "25px", borderRadius: "30px",
               cursor: comingSoon ? "default" : "pointer",
               filter: `saturate(${comingSoon ? 0 : 100}%)`
            }}
            onClick={() => router.push(href)}
         >
            <div className="box full h-full dfb align-center">
               <div className="box full dfb column">
                  <div className="text-ml bold-700 full">{label}</div>
                  <div className="text-xxs grey-5 full pd-05">{comingSoon ? 'Coming Soon' : description}</div>
                  {/* <div style={BackpackOpenIconBubble}><ArrowRight size={17} /></div> */}
               </div>
               <div className="box fit">
                  <CustomIcon url={icon.src} size={120} />
               </div>
            </div>
         </Card>
      )
   } else {
      return (
         <Card
            styles={{
               backgroundColor: "#88a4ff6e", width: "100%", height: "fit-content",
               border: "1px solid #e9e9e9", padding: "15px", borderRadius: "30px",
               cursor: comingSoon ? "default" : "pointer",
               filter: `saturate(${comingSoon ? 0 : 100}%)`
            }}
            onClick={() => router.push(href)}
         >
            <div className="box full dfb column">
               <div className="box full dfb justify-center"><CustomIcon url={icon.src} size={90} /></div>
               <div className="text-sm bold-700 full">{label}</div>
               <div className="text-xxxs grey-5 full pd-05">{comingSoon ? 'Coming Soon' : description}</div>
               <div className="box full dfb justify-end gap-5">
                  <div style={BackpackOpenIconBubble}><ArrowRight size={17} /></div>
               </div>
            </div>
         </Card>
      )
   }
}
