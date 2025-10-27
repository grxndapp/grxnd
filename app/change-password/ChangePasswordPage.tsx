'use client'
import { useState } from "react"
import { KeyRound } from "lucide-react"
import { useRouter } from "next/navigation"
import { changeUserPassword } from "../actions/user"
import { toast } from "sonner"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Spacing from "@/components/Spacing/Spacing"
import AwaitButton from "@/components/AwaitButton/AwaitButton"

export default function ChangePasswordPage() {
   const [password, setPassword] = useState('')
   const [password2, setPassword2] = useState('')
   const [error, setError] = useState<string | undefined>(undefined)
   const router = useRouter();

   const changePasswordBtn = async () => {
      setError(undefined);
      if (password == "") {
         setError("Please enter a password");
         return;
      }
      if (password.length < 8) {
         setError("Password must contain at least 8 characters");
         return;
      }
      if (password2 !== password) {
         setError("Passwords do not match");
         return;
      }
      const changePwd = await changeUserPassword(password);
      if (changePwd) {
         toast.success("Changed Password");
         router.push("/settings");
      } else {
         setError("Failed to change your password");
      }
   }

   return (
      <AppWrapper noNavbar>
         <Spacing size={2} />
         <div className="text-l bold-700 full dfb align-center justify-center gap-7">
            Change Password
         </div>
         <div className="text-xxs full pd-1 text-center mb-2">Fill in the fields below to change your password</div>

         {(error !== undefined) && (<>
            <div className="text-xxs bold-600 error text-center full pd-1 mb-1">{error}</div>
         </>)}

         <div className="box full pd-05">
            <input 
               type="password" 
               className="xxs full pd-12 pdx-2" 
               placeholder="New Password" 
               value={password} onChange={(e) => setPassword(e.target.value)}
            />
         </div>
         <div className="box full pd-05">
            <input 
               type="password" 
               className="xxs full pd-12 pdx-2" 
               placeholder="New Password (again)" 
               value={password2} onChange={(e) => setPassword2(e.target.value)}
            />
         </div>
         <div className="box full pd-05">
            <AwaitButton className="xxs pd-12 full" onClick={changePasswordBtn}>
               Change <KeyRound size={17} />
            </AwaitButton>
         </div>
      </AppWrapper>
   )
}
