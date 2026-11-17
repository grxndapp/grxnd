'use client'
import "@/styles/auth.css"
import { useEffect, useState } from "react"
import { CustomRawIcon, GoogleIcon, GrxndLogo } from "@/components/Icons/Icon"
import { signIn } from "next-auth/react"
import { ArrowRight, ChevronLeft } from "lucide-react"
import { checkForNoExistingUser, createUserAccount, sendUserForgotPasswordEmail } from "../actions/user"
import { useRouter, useSearchParams } from "next/navigation"
import { CustomIconUrls } from "@/lib/icons"
import { referralChannels, studentTypes } from "./onboardingUtil"
import { AnimatePresence, motion } from "framer-motion"
import AwaitButton from "@/components/AwaitButton/AwaitButton"

export default function SignInForm() {
   const searchParams = useSearchParams();
   const router = useRouter();

   const [email, setEmail] = useState('');
   const [name, setName] = useState('');
   const [password, setPassword] = useState('');
   const [password2, setPassword2] = useState('');

   const [referralChannel, setReferralChannel] = useState<string>("");
   const [studentType, setStudentType] = useState<string>("");

   const [authStep, setAuthStep] = useState<'pre' | 'start' | 'onboarding-ch' | 'onboarding-st' | 'forgot' | 'reg' | 'login'>('pre');
   const [error, setError] = useState<string | undefined>(undefined);
   const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

   const onboardingChoiceTimeout = 600;

   async function handleGoogleSignup () {
      if (studentType == '') return;
      if (referralChannel == '') return;
      
      const data = encodeURIComponent(JSON.stringify({ referralChannel, studentType }) );
      const secure = window.location.protocol === "https:" ? "; Secure" : "";

      document.cookie = `grxnd_signup=${data}; Path=/; Max-Age=1800; SameSite=Lax${secure}`;

      await signIn("google", { callbackUrl: "/home" });
   }

   const continueWithEmailBtn = async (callback: Function) => {
      setError(undefined);
      if (email == "") {
         setError("Please enter an email");
         callback();
         return;
      }
      const noUserFoundStatus = await checkForNoExistingUser(email);
      if (noUserFoundStatus === "google-auth") {
         await handleGoogleSignup();
      } else if (noUserFoundStatus) {
         setAuthStep("reg");
      } else {
         setAuthStep("login");
      }
      callback();
   }

   const createAccountBtn = async (callback: Function) => {
      setError(undefined);
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

      const createAcc = await createUserAccount({ name, email, password, studentType, referralChannel });
      if (createAcc) {
         const response = await signIn("credentials", { email, password, redirect: false });
         if (response?.error) {
            setError("Incorrect Email or Password");
            callback();
         } else {
            router.push(searchParams.get("redirect") ? `/${searchParams.get("redirect")}` : '/home');
         }
      } else {
         setError("Failed to create your account");
         callback();
      }
   }

   async function handleSendForgotPasswordEmail (callback: Function) {
      setError(undefined);
      if (email == "") {
         setError("Please enter an email");
         callback();
         return;
      }
      const sent = await sendUserForgotPasswordEmail(email);
      setForgotPasswordSent(sent);
      callback();
   }

   const signInBtn = async (callback: Function) => {
      setError(undefined);
      if (password == "") {
         setError("Please enter a password");
         callback();
         return;
      }
      const response = await signIn("credentials", { email, password, redirect: false });
      if (response?.error) {
         setError("Incorrect Email or Password");
      } else {
         router.push('/home');
      }
      callback();
   }

   useEffect(() => {
      if (referralChannel == '') return;
      const channelSelectedTimeout = setTimeout(() => setAuthStep("onboarding-st"), onboardingChoiceTimeout);
      return () => clearTimeout(channelSelectedTimeout);
   }, [referralChannel])

   useEffect(() => {
      if (studentType == '') return;
      const studentTypeSelectedTimeout = setTimeout(() => setAuthStep("start"), onboardingChoiceTimeout);
      return () => clearTimeout(studentTypeSelectedTimeout);
   }, [studentType])

   return (
      <div className="auth">
         <div className="auth-box">
            <AnimatePresence mode="wait" initial={false}>
               <motion.div
                  key={authStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
               >
                  {(authStep == "pre") && (<>
                     <div className="box full">
                        <div className="box full mb-1 dfb align-center justify-center">
                           <CustomRawIcon url={CustomIconUrls.WelcomeIcon} size={150} />
                        </div>
                        <div className="text-l full bold-500">Welcome to Grxnd</div>
                        <div className="text-xxs full pd-05 text-center">Lock in Today! The Grxnd Begins!</div>
                     </div>
                     <div className="box full dfb column gap-10 mt-15 pd-2 align-center">
                        <button className="xxs pd-14 full mw-400 radius-20 accent-hover" onClick={() => setAuthStep("onboarding-ch")}>
                           <div className="box full dfb column align-center">
                              <span className="text-xs full bold-600">Sign Up</span>
                              <div className="text-t full bold-500" style={{ opacity: 0.8 }}>First time on Grxnd</div>
                           </div>
                        </button>
                        <button className="xxs pd-14 full mw-400 outline-black tiny-shadow radius-20" onClick={() => setAuthStep("start")}>
                           <div className="box full dfb column align-center">
                              <span className="text-xs full bold-600">Login</span>
                              <div className="text-t full bold-500" style={{ opacity: 0.8 }}>Coming back to Grxnd</div>
                           </div>
                        </button>
                     </div>
                  </>)}
                  
                  {(authStep == "onboarding-ch") && (<>
                     <div className="box full">
                        <button className="xs pd-15 pdx-15 outline-black tiny-shadow radius-30" onClick={() => setAuthStep("pre")}><ChevronLeft size={20} /></button>
                     </div>
                     <div className="box full mt-15 mb-1">
                        <div className="box full mb-1 dfb align-center justify-center">
                           <CustomRawIcon url={CustomIconUrls.WelcomeIcon} size={150} />
                        </div>
                        <div className="text-l full bold-500">How did you find Grxnd?</div>
                        <div className="text-xxs full pd-05 text-center">How'd you find us, were you stalking?</div>
                     </div>
                     <div className="onboarding-list grid-22">
                        {referralChannels.map((channelItem, index) => (
                           <div 
                              key={index} 
                              className={`onboarding-card ${referralChannel == channelItem.channel ? channelItem.channel : ''}`}
                              onClick={() => setReferralChannel(channelItem.channel)}
                           >
                              <div className="box full">{channelItem.icon}</div>
                              <div className="text-xxs full bold-500">{channelItem.label}</div>
                           </div>
                        ))}
                     </div>
                  </>)}
                  
                  {(authStep == "onboarding-st") && (<>
                     <div className="box full">
                        <button className="xs pd-15 pdx-15 outline-black tiny-shadow radius-30" onClick={() => setAuthStep("onboarding-ch")}><ChevronLeft size={20} /></button>
                     </div>
                     <div className="box full mb-1">
                        <div className="box full mb-1 dfb align-center justify-center">
                           <CustomRawIcon url={CustomIconUrls.WelcomeIcon} size={150} />
                        </div>
                        <div className="text-l full bold-500">What best describes you?</div>
                        <div className="text-xxs full pd-05 text-center">Where do you study at</div>
                     </div>
                     <div className="onboarding-list grid-22">
                        {studentTypes.map((studentTypeItem, index) => (
                           <div 
                              key={index} 
                              className={`onboarding-card ${studentType == studentTypeItem.studentType && 'selected'}`}
                              onClick={() => setStudentType(studentTypeItem.studentType)}
                           >
                              <div className="box full">{studentTypeItem.icon}</div>
                              <div className="text-xxs full bold-500">{studentTypeItem.label}</div>
                           </div>
                        ))}
                     </div>
                  </>)}

                  {(authStep == "start") && (<>
                     <div className="box full mb-1">
                        <div className="box full mb-1 dfb align-center justify-center">
                           <CustomRawIcon url={CustomIconUrls.WelcomeIcon} size={130} />
                        </div>
                        <div className="text-l full bold-600">Sign In to Grxnd</div>
                        {(error !== undefined) && (<><div className="text-xxs bold-600 error full pd-1 mb-1">{error}</div></>)}
                     </div>
                     <div className="box full dfb column gap-10">
                        <div className="box full pd-1">
                           <input type="text" className="xs pd-14 pdx-2 full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="box full pd-05">
                           <div className="text-xs fit bold-600 cursor-pointer accent-color visible-link" onClick={() => setAuthStep("forgot")}>
                              Forgot Password?
                           </div>
                        </div>
                        <div className="box full mb-1">
                           <AwaitButton className='xs full pd-12 tiny-shadow accent-hover' onClick={continueWithEmailBtn}>
                              Continue with Email <ArrowRight size={17} />
                           </AwaitButton>
                        </div>
                     </div>
                     <div className="form">
                        <div className="form-content">
                           <button className='xs full pd-12 outline-black tiny-shadow' onClick={handleGoogleSignup}>
                              <GoogleIcon size={17} /> Continue with Google
                           </button>
                        </div>
                     </div>
                  </>)}

                  {(authStep == "forgot") && (<>
                     <div className="text-s pd-1 full dfb align-center justify-center"><GrxndLogo size={60} /></div>
                     <div className="text-ml bold-700 mb-2">Reset your password</div>
                     {(error !== undefined) && (<><div className="text-xxs bold-600 error full pd-1 mb-1">{error}</div></>)}

                     {forgotPasswordSent ? (<>
                        <div className="box full dfb column gap-10">
                           <div className="box full">
                              <div className="text-xs full text-center">
                                 The reset password link has been sent to <b>{email}</b>. Please check your inbox and spam folders.
                              </div>
                           </div>
                           <div className="box full pd-05 dfb align-center justify-center">
                              <div className="text-xxs fit bold-600 cursor-pointer visible-link" onClick={() => setAuthStep("start")}>
                                 Back to Login
                              </div>
                           </div>
                        </div>
                     </>) : (<>
                        <div className="box full dfb column gap-10">
                           <div className="box full">
                              <div className="text-xs full text-center">
                                 Enter your email and we'll send you a link to reset your password.
                              </div>
                           </div>
                           <div className="box full">
                              <input type="text" className="xxs pd-12 pdx-2 full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                           </div>
                           <div className="box full mb-05">
                              <AwaitButton className='xxs full pd-12 tiny-shadow' onClick={handleSendForgotPasswordEmail}>
                                 Send Reset Link <ArrowRight size={17} />
                              </AwaitButton>
                           </div>
                           <div className="box full pd-05 dfb align-center justify-center">
                              <div className="text-xxs fit bold-600 cursor-pointer visible-link" onClick={() => setAuthStep("start")}>
                                 Back to Login
                              </div>
                           </div>
                        </div>
                     </>)}
                  </>)}

                  {(authStep == "reg") && (<>
                     <div className="box full mb-1">
                        <div className="box full mb-1 dfb align-center justify-center">
                           <CustomRawIcon url={CustomIconUrls.WelcomeIcon} size={130} />
                        </div>
                        <div className="text-l full bold-600">Sign In to Grxnd</div>
                        {(error !== undefined) && (<><div className="text-xxs bold-600 error full pd-1 mb-1">{error}</div></>)}
                     </div>

                     <div className="box full dfb column gap-10">
                        <div className="box full dfb align-center gap-10 cursor-pointer pd-05" onClick={() => setAuthStep("start")}>
                           <ChevronLeft size={17} />
                           <div className="text-xs pd-05 fit">{email}</div>
                        </div>
                        <div className="box full pd-05">
                           <input type="text" className="xs pd-14 pdx-2 full" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} maxLength={30} />
                        </div>
                        <div className="box full pd-05">
                           <input type="password" className="xs pd-14 pdx-2 full" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="box full pd-05">
                           <input type="password" className="xs pd-14 pdx-2 full" placeholder="Password (again)" value={password2} onChange={(e) => setPassword2(e.target.value)} />
                        </div>
                        <div className="box full mb-05">
                           <AwaitButton className='xs full pd-15 tiny-shadow accent-hover' onClick={createAccountBtn}>
                              Create Account <ArrowRight size={17} />
                           </AwaitButton>
                        </div>
                     </div>
                  </>)}

                  {(authStep == "login") && (<>
                     <div className="box full mb-1">
                        <div className="box full mb-1 dfb align-center justify-center">
                           <CustomRawIcon url={CustomIconUrls.WelcomeIcon} size={130} />
                        </div>
                        <div className="text-l full bold-600">Sign In to Grxnd</div>
                        {(error !== undefined) && (<><div className="text-xxs bold-600 error full pd-1 mb-1">{error}</div></>)}
                     </div>

                     <div className="box full dfb column gap-10">
                        <div className="box full dfb align-center gap-10 cursor-pointer" onClick={() => setAuthStep("start")}>
                           <ChevronLeft size={17} />
                           <div className="text-xxs pd-05 fit">{email}</div>
                        </div>
                        <div className="box full">
                           <input type="password" className="xs pd-14 pdx-2 full" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="box full pd-05">
                           <div className="text-xs fit bold-600 cursor-pointer accent-color visible-link" onClick={() => setAuthStep("forgot")}>
                              Forgot Password?
                           </div>
                        </div>
                        <div className="box full mb-05">
                           <AwaitButton className='xs full pd-14 tiny-shadow accent-hover' onClick={signInBtn}>
                              Login <ArrowRight size={17} />
                           </AwaitButton>
                        </div>
                     </div>
                  </>)}
               </motion.div>
            </AnimatePresence>
         </div>
      </div>
   )
}
