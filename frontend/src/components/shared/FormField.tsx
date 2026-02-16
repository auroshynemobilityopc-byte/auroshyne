import React from "react";

interface FormFieldProps {
    label?: string;
    error?: string;
    helperText?: string;
    children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    error,
    helperText,
    children,
}) => {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm text-zinc-300">{label}</label>}
            {children}
            {error ? (
                <span className="text-xs text-red-500">{error}</span>
            ) : (
                helperText && <span className="text-xs text-zinc-500">{helperText}</span>
            )}
        </div>
    );
};
