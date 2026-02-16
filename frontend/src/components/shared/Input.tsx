import React, { forwardRef } from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ leftIcon, rightIcon, error, className, ...props }, ref) => {
        return (
            <div
                className={clsx(
                    "flex items-center gap-2 h-11 px-3 rounded-2xl border bg-zinc-900",
                    error ? "border-red-500" : "border-zinc-700"
                )}
            >
                {leftIcon}
                <input
                    ref={ref}
                    className={clsx(
                        "flex-1 bg-transparent outline-none text-sm placeholder:text-zinc-500",
                        className
                    )}
                    {...props}
                />
                {rightIcon}
            </div>
        );
    }
);

Input.displayName = "Input";
