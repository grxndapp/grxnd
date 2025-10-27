'use client'
import { X } from 'lucide-react';
import './Modal.css'
import { ReactNode } from 'react'

type ModalProps = {
   children: ReactNode;
   onCloseAction: Function;
}

export function Modal ({ children, onCloseAction }: ModalProps) {
   return (
      <div className="modal">
         <div className='modal-box'>
            <div className="close">
               <button className='grey' onClick={() => onCloseAction()}><X color='#000' /></button>
            </div>
            {children}
         </div>
      </div>
   )
}
