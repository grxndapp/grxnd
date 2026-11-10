'use client'
import { LogOut, UserRound } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';

export default function page() {
   const { data: session } = useSession();
   const router = useRouter();

   return (
      <div className='box full pdx-3 pd-5'>
         <div className="text-xl bold-600 full">Account Not Found</div>
         <div className="text-xs full pd-05 grey-5">Please sign out and sign in again.</div>
         <div className="box full pd-1">
            {session?.user ? (<>
               <button className="xxs pd-14 pdx-2 radius-20" onClick={() => signOut()}>
                  <LogOut /> Sign Out
               </button>
            </>) : (<>
               <button className="xxs pd-14 pdx-2 radius-20" onClick={() => router.push('/sign-in')}>
                  <UserRound /> Sign In
               </button>
            </>)}
         </div>
      </div>
   )
}
