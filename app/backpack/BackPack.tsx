'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CustomIcon } from "@/components/Icons/Icon";
import { StaticImageData } from "next/image";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Spacing from "@/components/Spacing/Spacing";
import Card from "@/components/Card/Card";
import TimeTableIcon from "@/public/timetable.png"
import NoteBookIcon from "@/public/notebook.png"

export default function BackPackPage () {
   const { data: session } = useSession();

   return (
      <AppWrapper>
         <div className="box full h-full">
            <div className="text-xxl bold-700 full dfb align-center justify-center gap-7">
               {session?.user?.name}'s Backpack
            </div>
            <Spacing size={2} />
            <BackPackTool label="Your Notebooks" href="/notebooks" icon={NoteBookIcon} />
            <Spacing size={1} />
            <BackPackTool label="Personal Timetable" href="/backpack" icon={TimeTableIcon} comingSoon />
         </div>
      </AppWrapper>
   )
}

function BackPackTool ({ label, href, icon, comingSoon }: { label: string, href: string, icon: StaticImageData, comingSoon?: boolean }) {
   const router = useRouter();

   return (<Card
      styles={{
         backgroundColor: "#88a4ff6e",
         border: "1px solid #e9e9e9",
         padding: "25px",
         cursor: comingSoon ? "default" : "pointer"
      }}
      onClick={() => router.push(href)}
   >
      <div className="box full dfb align-center">
         <div className="box full dfb column" style={{ width: "100%" }}>
            <div className="text-m bold-700 full">{label}</div>
            <div className="text-xxs pd-05 grey-5 full">{comingSoon ? 'Coming Soon' : 'Click to view'}</div>
         </div>
         <div className="box fit">
            <CustomIcon url={icon.src} size={60} />
         </div>
      </div>
   </Card>)
}
