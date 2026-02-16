import React from "react";
import clsx from "clsx";

type Variant = "default" | "success" | "warning" | "danger" | "info";

const styles: Record<Variant, string> = {
    default: "bg-zinc-800 text-zinc-300",
    success: "bg-green-600/20 text-green-400",
    warning: "bg-yellow-600/20 text-yellow-400",
    danger: "bg-red-600/20 text-red-400",
    info: "bg-blue-600/20 text-blue-400",
};

interface BadgeProps {
    children: React.ReactNode;
    variant?: Variant;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = "default",
    className,
}) => {
    return (
        <span
            className={clsx(
                "px-2 py-1 text-xs rounded-full font-medium",
                styles[variant],
                className
            )}
        >
            {children}
        </span>
    );
};
