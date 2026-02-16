import React from "react";
import clsx from "clsx";

interface Tab {
    label: string;
    value: string;
}

interface TabsProps {
    tabs: Tab[];
    value: string;
    onChange: (val: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, value, onChange }) => {
    return (
        <div className="sticky top-0 z-10 bg-zinc-950 border-b border-zinc-800 overflow-x-auto">
            <div className="flex">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => onChange(tab.value)}
                        className={clsx(
                            "px-4 h-11 text-sm whitespace-nowrap",
                            value === tab.value
                                ? "text-blue-400 border-b-2 border-blue-400"
                                : "text-zinc-400"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
