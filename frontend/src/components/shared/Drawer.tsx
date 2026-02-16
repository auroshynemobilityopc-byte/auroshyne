import React from "react";
import clsx from "clsx";

interface DrawerProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ open, onClose, children }) => {
    return (
        <div
            className={clsx(
                "fixed inset-0 z-50 transition",
                open ? "visible" : "invisible"
            )}
        >
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            <div
                className={clsx(
                    "absolute bottom-0 w-full bg-zinc-900 rounded-t-2xl p-4",
                    "lg:top-0 lg:right-0 lg:h-full lg:w-96 lg:rounded-none"
                )}
            >
                {children}
            </div>
        </div>
    );
};
