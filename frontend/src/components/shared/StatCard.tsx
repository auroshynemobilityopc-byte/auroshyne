import React from "react";
import { Card } from "./Card";
import { Skeleton } from "./Skeleton";

interface StatCardProps {
    title: string;
    value?: string | number;
    icon?: React.ReactNode;
    loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    loading,
}) => {
    if (loading) {
        return (
            <Card>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-16" />
            </Card>
        );
    }

    return (
        <Card className="flex items-center justify-between">
            <div>
                <p className="text-sm text-zinc-400">{title}</p>
                <p className="text-xl font-semibold">{value}</p>
            </div>
            {icon}
        </Card>
    );
};
