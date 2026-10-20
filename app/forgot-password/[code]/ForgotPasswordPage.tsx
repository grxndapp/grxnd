'use client'
import "@/styles/forgot-password.css"
import Spacing from "@/components/Spacing/Spacing";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { resetUserPassword } from "@/app/actions/user";
import { toast } from "sonner";
import { Home, KeyRound } from "lucide-react";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import Link from "next/link";

type ForgotPasswordPageProps = {
   forgotPassword: {
      id: number;
      userid: string;
      forgottenPasswordCode: string;
      createdAt: Date;
   } | null
}

const minute = 1000 * 60;

export default function ForgotPasswordPage ({ forgotPassword }: ForgotPasswordPageProps) {
   const [password, setPassword] = useState('')
   const [password2, setPassword2] = useState('')
   const [error, setError] = useState<string | undefined>(undefined)
   const router = useRouter();

   const changePasswordBtn = async (callback: Function) => {
      setError(undefined);
      if (!forgotPassword) {
         setError("Invalid Forgotten Password Link");
         callback();
         return;
      }
      if (password == "") {
         setError("Please enter a password");
         callback();
         return;
      }
      if (password.length < 8) {
         setError("Password must contain at least 8 characters");
         callback();
         return;
      }
      if (password2 !== password) {
         setError("Passwords do not match");
         callback();
         return;
      }
      const changePwd = await resetUserPassword(forgotPassword.forgottenPasswordCode, forgotPassword?.userid, password);
      if (changePwd) {
         toast.success("Your Password has been reset");
         router.push("/sign-in");
      } else {
         setError("Failed to reset your password");
      }
      callback();
   }

   function isValidForgottenLink () {
      if (!forgotPassword) return false;
      const forgottenLinkTime = new Date(forgotPassword.createdAt).getTime();
      const currentTime = Date.now();
      const threshold = 30 * minute; // 30 mins
      return (currentTime-forgottenLinkTime) < threshold;
   }
   
   if (forgotPassword && isValidForgottenLink()) {
      return (
         <div className="forgot-password">
            <div className="forgot-password-wrapper">
               <Spacing size={2} />
               <div className="text-l bold-700 full">Reset Password</div>
               <div className="text-xxs full pd-1 mb-2">Fill in the fields below to reset your password</div>

               {(error !== undefined) && (<>
                  <div className="text-xxs bold-600 error text-center full pd-1 mb-1">{error}</div>
               </>)}

               <div className="box full dfb column align-center">
                  <div className="box full mw-600 pd-05">
                     <input 
                        type="password" 
                        className="xxs full pd-12 pdx-2" 
                        placeholder="New Password" 
                        value={password} onChange={(e) => setPassword(e.target.value)}
                     />
                  </div>
                  <div className="box full mw-600 pd-05">
                     <input 
                        type="password" 
                        className="xxs full pd-12 pdx-2" 
                        placeholder="New Password (again)" 
                        value={password2} onChange={(e) => setPassword2(e.target.value)}
                     />
                  </div>
                  <div className="box full mw-600 pd-05">
                     <AwaitButton className="xxs pd-12 full" onClick={changePasswordBtn}>
                        Reset <KeyRound size={17} />
                     </AwaitButton>
                  </div>
               </div>
            </div>
         </div>
      )

   } else {
      return (
         <div className="forgot-password">
            <div className="forgot-password-wrapper">
               <Spacing size={2} />
               <div className="text-l bold-700 full">Invalid Reset Password Link</div>
               <div className="text-s full pd-1">
                  We cannot process an invalid rest password link; either it expired or this is an invalid link.
               </div>
               <div className="text-s full mb-2">
                  You can close this page.
               </div>
               <Link href={"/"}>
                  <AwaitButton className="xxs pd-12 fit pd-13 pdx-2" onClick={changePasswordBtn}>
                     Home <Home size={17} />
                  </AwaitButton>
               </Link>
   
            </div>
         </div>
      )
   }
}
