'use client';
import './Modal.css';
import { X } from 'lucide-react';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

type ModalProps = {
   children: ReactNode;
   onClose: () => void;
};

export function Modal({ children, onClose }: ModalProps) {
   return createPortal(
      <motion.div
         className="modal"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{
            duration: 0.2,
            ease: 'easeOut',
         }}
         onClick={onClose}
      >
         <motion.div
            className="modal-box"
            initial={{
               y: 20,
               scale: 0.98,
            }}
            animate={{
               y: 0,
               scale: 1,
            }}
            exit={{
               y: 10,
               scale: 0.98,
            }}
            transition={{
               duration: 0.25,
               ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
         >
            <button
               type="button"
               className="modal-close"
               onClick={onClose}
               aria-label="Close modal"
            >
               <X size={20} />
            </button>

            {children}
         </motion.div>
      </motion.div>, document.body
   );
}
