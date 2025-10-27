'use client'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Crown } from 'lucide-react';
import AppWrapper from '@/components/AppWrapper/AppWrapper'
import Spacing from '@/components/Spacing/Spacing'

export default function NonSubHomePage() {
   const router = useRouter();
   const { data: session } = useSession();
   
   return (
      <AppWrapper>
         <Spacing size={3} />
         <div className="text-xxl bold-700 full dfb align-center justify-center gap-7">
            Hello <div className="span box accent-color">{session?.user?.name}</div>
         </div>
         <div className="text-xs full text-center pd-1">Subscribe to <b className="accent-color">Grxnd</b> to join everyone in studying better using AI</div>
         <Spacing size={1} />
         <div className="box full">
            <button className="xxs pd-12 full" onClick={() => router.push("/pricing")}><Crown size={17} /> Subscribe Today !</button>
         </div>
      </AppWrapper>
   )
}
