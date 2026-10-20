'use client'
import "@/styles/forgot-password.css"
import LoadingCard from '@/components/Card/LoadingCard'
import Spacing from '@/components/Spacing/Spacing'

export default function LoadingPage () {
   return (
      <div className="forgot-password">
         <div className="forgot-password-wrapper">
            <Spacing size={3} />
            {Array.from({ length: 3 }, (_, i) => i+1).map((value, index) => (
               <div className='box full' key={index}>
                  <LoadingCard styles={{
                     width: "100%",
                     height: "150px"
                  }} />
                  <Spacing size={1} />
               </div>
            ))}
         </div>
      </div>
   )
}
