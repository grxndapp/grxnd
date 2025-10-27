'use client'
import { CircleCheck, CreditCard, KeyRound, LogOut, Trash2, UserRoundCog } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react'
import { CustomIcon } from '@/components/Icons/Icon';
import { formatMilliseconds } from '@/utils/date';
import { useRouter } from 'next/navigation';
import { useModal } from '@/contexts/useModal';
import { toast } from 'sonner';
import AppWrapper from '@/components/AppWrapper/AppWrapper'
import Spacing from '@/components/Spacing/Spacing'
import userDefaultImage from '@/public/user-def.png'
import Link from 'next/link';
import { sendVerificationEmailFromGrxnd } from '../actions/email';

type SettingsPageProps = {
   user: UserDetails;
}

export default function SettingsPage ({ user }: SettingsPageProps) {
   const router = useRouter();
   const { data: session, status } = useSession();
   const { showModal, close } = useModal();
   const manageBillingLink = "https://billing.stripe.com/p/login/test_28E5kCcKcc0J6IA9DccQU00"

   const sendVerificationEmail = async () => {
      const sentEmail = await sendVerificationEmailFromGrxnd(user.email);
      if (sentEmail) {
         showModal({
            children: <div className='box full h-fit pdx-2 pd-2'>
               <div className="text-xl bold-700 full mb-1 text-center">Verification Email Sent</div>
               <div className="text-xxs full text-center pd-1">
                  An email with a verification link has been sent to {user.email}. Please check spam folder if you can not find the email in your inbox.
               </div>
               <div className="box full mt-2">
                  <button className="xxs pd-11 full" onClick={close}>Continue</button>
               </div>
            </div>
         });
      } else {
         toast.error(`Failed to send ${user.email} a verification email`);
      }
   }

   const credentialVerifier = (oauth_provider: string) => {
      if (oauth_provider == "nv-credentials") {
         return false;
      } else if (oauth_provider == "v-credentials") {
         return true;
      }
   }

   return (
      <AppWrapper>
         <div className="text-l bold-700 full dfb align-center justify-center gap-7">
            Account Settings
         </div>
         <div className="box full pd-05">
            <CustomIcon url={session?.user?.image! || userDefaultImage.src} size={80} round />
         </div>
         <div className="text-m bold-500 full pd-05 mt-1">{session?.user?.name}</div>
         <div className="text-xs grey-5 full pd-05">{session?.user?.email}</div>
         <div className="text-xs grey-5 full pd-05 mb-1">Joined <b className="accent-color">Grxnd</b> on {formatMilliseconds(new Date(user.createdAt).getTime(), true)}</div>
         <button className="xxs full grey pd-11 tiny-shadow" onClick={() => signOut()}>
            <LogOut size={17} /> Log Out   
         </button>

         {(user.user_role == "admin") && (<>
            <Spacing size={3} />
            <div className="text-l bold-700 full gap-7">Admin Panel</div>
            <div className="text-xs full pd-1 mb-1">Click below to see admin dashboard and <b className="accent-color">Grxnd</b> information</div>
            <button className="xxs full pd-11 tiny-shadow" onClick={() => router.push("/admin")}><UserRoundCog size={17} /> Admin Dashboard</button>
         </>)}

         {(status === "authenticated") && (<>
            <Spacing size={3} />
            <div className="text-l bold-700 full gap-7">Manage Subscription</div>
            <div className="text-xs full pd-1 mb-1">Switch plans, manage, renew and cancel your <b className="accent-color">Grxnd</b> subscription</div>
            <Link href={`${manageBillingLink}?prefilled_email=${user.email}`} style={{display:"block",width:"100%"}} target="_blank">
               <button className="xxs full pd-11 tiny-shadow"><CreditCard size={17} /> Manage Billing</button>
            </Link>
         </>)}

         {(user.oauth_provider.includes("credentials")) && (<>
            <Spacing size={3} />
            <div className="text-l bold-700 full gap-7">Change Password</div>
            <div className="text-xs full pd-1 mb-1">Change your password frequently to keep account security</div>
            <button className="xxs full pd-11 tiny-shadow" onClick={() => router.push("/change-password")}><KeyRound size={17} /> Change</button>

            {(credentialVerifier(user.oauth_provider)) ? (<>
               <Spacing size={3} />
               <div className="text-l bold-700 full gap-7 success">Account Verified</div>
               <div className="text-xs full pd-1 mb-1">Your email has been verified</div>
            </>) : (<>
               <Spacing size={3} />
               <div className="text-l bold-700 full gap-7">Account Not Verified</div>
               <div className="text-xs full pd-1 mb-1">
                  This is a permanent action and will delete all your existing data on the Grxnd App
               </div>
               <button className="xxs full pd-11 tiny-shadow" onClick={sendVerificationEmail}>
                  <CircleCheck size={17} /> Verify Account
               </button>
            </>)}
         </>)}

         <Spacing size={3} />
         <div className="text-l bold-700 full gap-7">Account Privacy</div>
         <div className="text-xs full pd-1 mb-1">
            This is a permanent action and will delete all your existing data on the Grxnd App
         </div>
         <button className="xxs full delete pd-11 tiny-shadow" onClick={() => router.push("/delete-account")}>
            <Trash2 size={17} /> Delete Account
         </button>

         <Spacing size={5} />
      </AppWrapper>
   )
}
