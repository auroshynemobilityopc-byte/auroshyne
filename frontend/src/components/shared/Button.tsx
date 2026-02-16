import React from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    loading?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700",
    ghost: "bg-transparent hover:bg-zinc-800 text-zinc-200",
    danger: "bg-red-600 hover:bg-red-500 text-white",
};

export const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    loading,
    fullWidth = true,
    leftIcon,
    rightIcon,
    className,
    children,
    disabled,
    ...props
}) => {
    return (
        <button
            disabled={disabled || loading}
            className={clsx(
                "h-11 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium transition",
                "disabled:opacity-50 disabled:pointer-events-none",
                variantStyles[variant],
                fullWidth && "w-full",
                className
            )}
            {...props}
        >
            {loading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
            {!loading && leftIcon}
            {!loading && children}
            {!loading && rightIcon}
        </button>
    );
};
