import React from "react";
import clsx from "clsx";

interface Tab {
    label: React.ReactNode;
    value: string;
}

interface TabsProps {
    tabs: Tab[];
    value: string;
    onChange: (val: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
    tabs,
    value,
    onChange,
}) => {
    return (
        <div className="sticky top-0 z-10 bg-zinc-950 border-b border-zinc-800">
            <div className="flex w-full gap-2 px-2 pb-2">
                {tabs.map((tab) => {
                    const active = value === tab.value;

                    return (
                        <button
                            key={tab.value}
                            onClick={() => onChange(tab.value)}
                            className={clsx(
                                "flex-1 flex justify-center items-center px-2 py-2 rounded-lg text-xs transition-all duration-150 border",
                                active
                                    ? "bg-zinc-900 text-blue-400 border-blue-500/30"
                                    : "text-zinc-400 hover:bg-zinc-900/60 border-transparent"
                            )}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};