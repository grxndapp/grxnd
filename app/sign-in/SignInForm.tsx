'use client'
import "@/styles/auth.css"
import { useState } from "react"
import { GoogleIcon, GrxndLogo } from "@/components/Icons/Icon"
import { signIn } from "next-auth/react"
import { ArrowRight, ChevronLeft } from "lucide-react"
import { checkForNoExistingUser, createUserAccount } from "../actions/user"
import { useRouter } from "next/navigation"
import AwaitButton from "@/components/AwaitButton/AwaitButton"

export default function SignInForm() {
   const router = useRouter();

   const [email, setEmail] = useState('');
   const [name, setName] = useState('');
   const [password, setPassword] = useState('');
   const [password2, setPassword2] = useState('');

   const [authStep, setAuthStep] = useState<'start' | 'reg' | 'login'>('start');
   const [error, setError] = useState<string | undefined>(undefined)

   const continueWithEmailBtn = async () => {
      setError(undefined);
      if (email == "") {
         setError("Please enter an email");
         return;
      }
      const existingUserStatus = await checkForNoExistingUser(email);
      if (existingUserStatus === "google-auth") {
         setError("This email is connected to a Google Account on Grxnd");
      } else if (existingUserStatus === false) {
         setAuthStep("login");
      } else {
         setAuthStep("reg");
      }
   }

   const createAccountBtn = async () => {
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
      const createAcc = await createUserAccount({ name, email, password });
      if (createAcc) {
         const response = await signIn("credentials", { email, password, redirect: false });
         if (response?.error) {
            setError("Incorrect Email or Password");
         } else {
            router.push('/home');
         }
      } else {
         setError("Failed to create your account");
      }
   }

   const signInBtn = async () => {
      setError(undefined);
      if (password == "") {
         setError("Please enter a password");
         return;
      }
      const response = await signIn("credentials", { email, password, redirect: false });
      if (response?.error) {
         setError("Incorrect Email or Password");
      } else {
         router.push('/home');
      }
   }

   return (
      <div className="auth">
         <div className="auth-box">
            <div className="text-s pd-1 full dfb align-center justify-center">
               <GrxndLogo size={60} />
            </div>
            <div className="text-ml bold-700 pd-2">Sign In to Grxnd</div>

            {(error !== undefined) && (<>
               <div className="text-xxs bold-600 error full pd-1 mb-1">{error}</div>
            </>)}

            {(authStep == "start") && (<>
               <div className="box full dfb column gap-10">
                  <div className="box full">
                     <input type="text" className="xxs pd-12 pdx-2 full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="box full mb-05">
                     <AwaitButton className='xxs full pd-12 tiny-shadow' onClick={continueWithEmailBtn}>
                        Continue with Email <ArrowRight size={17} />
                     </AwaitButton>
                  </div>
               </div>            
               <div className="form">
                  <div className="form-content">
                     <button className='xxs full pd-12 outline-black tiny-shadow' onClick={() => signIn("google")}>
                        <GoogleIcon size={17} /> Continue with Google
                     </button>
                  </div>
               </div>
            </>)}

            {(authStep == "reg") && (<>
               <div className="box full dfb column gap-10">
                  <div className="box full dfb align-center gap-10 cursor-pointer" onClick={() => setAuthStep("start")}>
                     <ChevronLeft size={17} />
                     <div className="text-xxs pd-05 fit">{email}</div>
                  </div>
                  <div className="box full">
                     <input type="text" className="xxs pd-12 pdx-2 full" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} maxLength={30} />
                  </div>
                  <div className="box full">
                     <input type="password" className="xxs pd-12 pdx-2 full" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <div className="box full">
                     <input type="password" className="xxs pd-12 pdx-2 full" placeholder="Password (again)" value={password2} onChange={(e) => setPassword2(e.target.value)} />
                  </div>
                  <div className="box full mb-05">
                     <AwaitButton className='xxs full pd-12 tiny-shadow' onClick={createAccountBtn}>
                        Create Account <ArrowRight size={17} />
                     </AwaitButton>
                  </div>
               </div>
            </>)}

            {(authStep == "login") && (<>
               <div className="box full dfb column gap-10">
                  <div className="box full dfb align-center gap-10 cursor-pointer" onClick={() => setAuthStep("start")}>
                     <ChevronLeft size={17} />
                     <div className="text-xxs pd-05 fit">{email}</div>
                  </div>
                  <div className="box full">
                     <input type="password" className="xxs pd-12 pdx-2 full" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <div className="box full mb-05">
                     <AwaitButton className='xxs full pd-12 tiny-shadow' onClick={signInBtn}>
                        Login <ArrowRight size={17} />
                     </AwaitButton>
                  </div>
               </div>
            </>)}
         </div>
      </div>
   )
}
