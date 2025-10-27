'use client'
import { wait } from "@/utils/wait";
import { useState } from "react";
import Spinner from "../Spinner/Spinner";

type AwaitButtonProps = {
   className: string;
   onClick: Function;
   children: React.ReactNode;
   waitTime?: number;
   afterRunFunction?: Function;
   blackSpinner?: boolean;
}

export default function AwaitButton ({ children, onClick, className, waitTime = 0.4, afterRunFunction, blackSpinner }: AwaitButtonProps) {
   const [loadingState, setLoadingState] = useState(false);

   const clickBtn = async () => {
      setLoadingState(true);
      await wait(waitTime);
      onClick();
      if (afterRunFunction) afterRunFunction();
      setLoadingState(false);
      return;
   }
   return (
      <button className={className} onClick={clickBtn} disabled={loadingState}>
         {loadingState ? <>
            <Spinner black={blackSpinner} /> {children}
         </> : children}
      </button>
   )
}
