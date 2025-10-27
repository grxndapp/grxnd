'use client'
import { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ModalConfig = {
	children: React.ReactNode;
	onClose?: () => void;
};

type ModalContextType = {
	showModal: (config: ModalConfig) => void;
	close: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
	const ctx = useContext(ModalContext);
	if (!ctx) throw new Error("ModalProvider is missing");
	return ctx;
};

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  	const [modal, setModal] = useState<ModalConfig | null>(null);

	const showModal = (config: ModalConfig) => { setModal(config); }

	const close = () => { setModal(null); }

	return (
		<ModalContext.Provider value={{ showModal, close }}>
			{children}
         <AnimatePresence>
            {(modal !== null) && (
               <motion.div
                  className="modal-container"
                  initial={{ opacity: 0, z: -2 }}
                  animate={{ opacity: 1, z: 20 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeIn' }}
               >
                  <div className="modal-box">{modal.children}</div>
               </motion.div>
            )}
         </AnimatePresence>
		</ModalContext.Provider>
	);
};