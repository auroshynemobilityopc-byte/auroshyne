import React from "react";
import clsx from "clsx";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end lg:items-center justify-center">
            <div
                className={clsx(
                    "bg-zinc-900 w-full lg:max-w-md rounded-t-2xl lg:rounded-2xl p-4"
                )}
            >
                {children}
                <button
                    onClick={onClose}
                    className="mt-4 text-sm text-zinc-400"
                >
                    Close
                </button>
            </div>
        </div>
    );
};
