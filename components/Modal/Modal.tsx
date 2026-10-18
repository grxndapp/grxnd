
'use client';
import './Modal.css';
import { X } from 'lucide-react';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ children, onClose }: ModalProps) {
   return (
      <motion.div
         className="modal"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 0.2, ease: "easeIn" }}
         onClick={onClose}
      >
         <motion.div
            className="modal-box"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
               duration: 0.2,
               ease: [0.22, 1, 0.36, 1]
            }}
            onClick={(e) => e.stopPropagation()}
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
      </motion.div>
   );
}
