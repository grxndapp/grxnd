'use client'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function page() {
   return (
      <div className='box full pdx-3 pd-5'>
         <div className="text-xl bold-600 full">Account Not Found</div>
         <div className="text-xs full pd-05 grey-5">Please sign out and sign in again.</div>
         <div className="box full pd-1">
            <button className="xxs pd-14 pdx-2 radius-20" onClick={() => signOut()}>
               <LogOut /> Sign Out
            </button>
         </div>
      </div>
   )
}
