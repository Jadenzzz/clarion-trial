import { XIcon } from "lucide-react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEsc from "@/hooks/useEsc";

export default function Slideover({
  open,
  onClose,
  children,
  title,
  hide_header = false,
  small = false,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  small?: boolean;
  hide_header?: boolean;
}) {
  useEsc({onClose});
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={onClose}
          />

          {/* Slideover panel */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div
              className={`pointer-events-auto ${
                small ? "w-screen max-w-[40vw]" : "w-screen max-w-[60vw]"
              }`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex h-full flex-col bg-white shadow-xl">
                {!hide_header && (
                  <div className="flex items-center justify-start gap-4 border-b border-gray-200 px-6 py-4">
                    <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <div className="flex items-center">
                    {title && (
                      <h2 className="text-lg font-semibold text-gray-900">
                        {title}
                      </h2>
                    )}
                  </div>
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto">{children}</div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
