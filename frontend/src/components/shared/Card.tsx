import React from "react";
import clsx from "clsx";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: "sm" | "md" | "lg";
    clickable?: boolean;
    onClick?: () => void;
}

const paddingMap = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
};

export const Card: React.FC<CardProps> = ({
    children,
    className,
    padding = "md",
    clickable,
    onClick,
}) => {
    return (
        <div
            className={clsx(
                "bg-zinc-900 border border-zinc-800 rounded-2xl",
                paddingMap[padding],
                clickable && "cursor-pointer active:scale-[0.99]",
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
