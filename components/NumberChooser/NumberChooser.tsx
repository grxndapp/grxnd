'use client'
import "./NumberChooser.css"
import { Minus, Plus } from "lucide-react"
import { useState } from "react"

type NumberChooserProps = {
   onChooseNum: (num: number) => void; 
}

export default function NumberChooser ({ onChooseNum }: NumberChooserProps) {
   const minNum = 3;
   const maxNum = 10;
   const [num, setNum] = useState(3);

   const processNum = (change: number) => {
      const newNum = num + change;
      setNum(newNum > maxNum ? maxNum : (newNum < minNum ? 3 : newNum));
      onChooseNum(newNum > maxNum ? maxNum : (newNum < minNum ? 3 : newNum));
   }

   return (
      <div className="box full">
         <div className="number-chooser">
            <div className="box fit h-full dfb align-center justify-center">
               <button className="num-chooser-btn" onClick={() => processNum(-1)}><Minus size={20} /></button>
            </div>

            <div className="text-s bold-600 full dfb align-center justify-center text-center">
               {num}
            </div>
            
            <div className="box fit h-full dfb align-center justify-center">
               <button className="num-chooser-btn" onClick={() => processNum(1)}><Plus size={20} /></button>
            </div>
         </div>
      </div>
   )
}
