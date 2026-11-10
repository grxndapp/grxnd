'use client'
import "./Sidebar.css"
import { ReactNode, useEffect, useState } from "react";
import { House, Backpack, Home, Download, BookOpenCheck } from "lucide-react";
import { GrxndLogo } from "../Icons/Icon";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export const sidebarIconSize = 18
export const sidebarStrokeWidth = 1.4
export const routes = [
   {
      icon: <Home size={sidebarIconSize} strokeWidth={sidebarStrokeWidth} />,
      label: "Home",
      href: '/home'
   },
   {
      icon: <Backpack size={sidebarIconSize} strokeWidth={sidebarStrokeWidth} />,
      label: "Backpack",
      href: '/backpack'
   },
   {
      icon: <BookOpenCheck size={sidebarIconSize} strokeWidth={sidebarStrokeWidth} />,
      label: "Exam Ready Score",
      href: '/exam-ready-score'
   },
]

export default function Sidebar () {
   const { status } = useSession();
   const router = useRouter();
   const pathname = usePathname();
   const [iPhoneOrIpadUser, setIPhoneOrIpadUser] = useState(false);

   const sidebarIconSize = 18
   const sidebarStrokeWidth = 1.4

   const loadingRoutes = [
      {
         icon: <House size={sidebarIconSize} strokeWidth={sidebarStrokeWidth} />,
         label: "Home",
         href: '/home'
      }
   ]   

   function isIphoneOrIpad(): boolean {
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
      const platform = navigator.platform;

      const isIOS = /iPhone|iPad|iPod/.test(ua);
      const isMacWithTouch = platform === 'MacIntel' && navigator.maxTouchPoints > 1;

      return isIOS || isMacWithTouch;
   }

   useEffect(() => {
      setIPhoneOrIpadUser(isIphoneOrIpad());
   }, [])

   return (
      <div className='sidebar'>
         <div className="sidebar-nav-container">
            <div className="sidebar-icon-bar">
               <div className="text-s fit dfb align-center">
                  <GrxndLogo size={30} />
               </div>
               <div className="text-m bold-800 accent-color-gradient-dark-text">GRXND</div>
            </div>
            <nav className="sidebar-nav">
               {status == "loading" ? <>
                  {loadingRoutes.map((route, index) => (
                     <SidebarItem 
                        key={index} 
                        icon={route.icon} 
                        label={route.label} 
                        collapsed={false}
                        action={() => router.push(route.href)}
                        selected={pathname === route.href}
                     />
                  ))}
               </> : <>
                  {routes.map((route, index) => (
                     <SidebarItem 
                        key={index} 
                        icon={route.icon} 
                        label={route.label} 
                        collapsed={false}
                        action={() => router.push(route.href)}
                        selected={pathname === route.href}
                     />
                  ))}
                  {(iPhoneOrIpadUser) && (<>
                     <SidebarItem 
                        icon={<Download size={sidebarIconSize} strokeWidth={sidebarStrokeWidth} />} 
                        label="Install Grxnd" 
                        collapsed={false}
                        action={() => router.push("/install-ios")}
                        selected={pathname === "/install-ios"}
                     />
                  </>)}
               </>}
            </nav>
         </div>
      </div>
   );
}

type SidebarItemProps = {
   icon: ReactNode,
   label: string,
   collapsed: boolean,
   action: Function,
   selected: boolean,
   list?: boolean,
}

function SidebarItem({ icon, label, collapsed, action, selected, list }: SidebarItemProps) {
   return (
      <div className={"sidebar-item " + (list ? 'list-item ' : '')  + (selected ? 'selected' : '')} onClick={() => action()}>
         {icon && <span className="sidebar-item-icon">{icon}</span>}
         <span className="text-xxxs" style={{ opacity: collapsed ? 0 : 1, whiteSpace:"nowrap", cursor: collapsed ? 'default' : 'pointer' }}>{label}</span>
      </div>
   );
}
