"use client"
import "@/styles/app.css"
import "./AppWrapper.css"
import { ReactNode } from 'react'
import { Backpack, House, Wrench } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CustomIcon, GrxndLogo } from '../Icons/Icon'
import userDefaultImage from "@/public/user-def.png"

export default function AppWrapper ({ children, noNavbar }: { children: ReactNode, noNavbar?: boolean }) {
   const { data: session } = useSession();
   const pathName = usePathname()
   const router = useRouter();

   const navbarItems = [
      { label: "Backpack", href: "/backpack", icon: Backpack },
      { label: "Home", href: "/home", icon: House },
      { label: "AI Tools", href: "/tools", icon: Wrench }
   ]

   return (
      <div className="app">
         <div className="account-bar-wrapper">
            <div className="account-bar">
               <div className="app-icon">
                  <GrxndLogo size={40} />
               </div>
               <div className="account-image" onClick={() => router.push("/settings")}>
                  <CustomIcon url={session?.user?.image! || userDefaultImage.src} size={40} round />
               </div>
            </div>
         </div>
         <div className="content">
            <div className="content-wrapper">
               {children}
            </div>
         </div>
         {(!noNavbar) && (<div className="navbar">
            <div className="navbar-wrapper">
               {navbarItems.map((navbarItem, index) => (
                  <div className={`navbar-item ${navbarItem.href == pathName && 'selected'}`} key={index} onClick={() => router.push(navbarItem.href)}>
                     <div className="icon">{<navbarItem.icon size={20} />}</div>
                     <div className="tiny-label">{navbarItem.label}</div>
                  </div>
               ))}
            </div>
         </div>)}
      </div>
   )
}