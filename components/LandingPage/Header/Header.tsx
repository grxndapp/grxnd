'use client'
import "./Header.css"
import { GrxndLogo } from "@/components/Icons/Icon"
import { useRouter } from "next/navigation"

export default function Header() {
   const router = useRouter();

   return (
      <div className="header">
         <div className="header-container">
            <div className="app-icon" onClick={() => router.push('/')}>
               <GrxndLogo size={40} />
            </div>
            <div className="header-items">
               <div className="header-item" onClick={() => router.push("/pricing")}>Pricing</div>
            </div>
         </div>
      </div>
   )
}
