'use client'
import { CircleX, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { deleteUserAccount } from '../actions/user';
import { signOut } from 'next-auth/react';
import AppWrapper from '@/components/AppWrapper/AppWrapper'
import Spacing from '@/components/Spacing/Spacing'
import AwaitButton from '@/components/AwaitButton/AwaitButton';


export default function DeleteAccountPage () {
   const router = useRouter();

   const deleteUserAccountBtn = async () => {
      const deleted = await deleteUserAccount();
      if (deleted) {
         signOut();
         toast.success("Account Deleted");
         return;
      }
      toast.error("Failed to delete account!");
   }

   return (
      <AppWrapper>
         <div className="text-l bold-700 full dfb align-center justify-center gap-7">
            Account Deletion
         </div>
         <div className="text-xxs full text-center pd-1">
            This is a permanent action and will delete all your existing data on the Grxnd App
         </div>
         <div className="text-xxs full text-center pd-1 bold-600">
            Are you sure you want to delete your account ?
         </div>
         <Spacing size={1} />

         <div className="box full dfb column gap-10">
            <button className="xxs full pd-11 tiny-shadow" onClick={() => router.push('/home')}>
               <CircleX size={17} /> Cancel
            </button>

            <AwaitButton className="xxs full delete pd-11 tiny-shadow" onClick={deleteUserAccountBtn}>
               <Trash2 size={17} /> Delete Account
            </AwaitButton>
         </div>
      </AppWrapper>
   )
}
