import React from "react";

interface Action {
    label: string;
    onClick: () => void;
    destructive?: boolean;
}

interface ActionSheetProps {
    open: boolean;
    onClose: () => void;
    actions: Action[];
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
    open,
    onClose,
    actions,
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end">
            <div className="bg-zinc-900 w-full rounded-t-2xl p-2 pb-[env(safe-area-inset-bottom)]">
                {actions.map((action, i) => (
                    <button
                        key={i}
                        onClick={action.onClick}
                        className={`w-full h-12 text-left px-4 rounded-xl ${action.destructive ? "text-red-500" : "text-zinc-200"
                            } hover:bg-zinc-800`}
                    >
                        {action.label}
                    </button>
                ))}
                <button
                    onClick={onClose}
                    className="w-full h-12 mt-2 text-zinc-400"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
