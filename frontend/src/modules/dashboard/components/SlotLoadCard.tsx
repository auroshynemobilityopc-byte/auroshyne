import { Card } from "../../../components/shared/Card";
import type { DashboardSummary } from "../types";

interface Props {
    data?: DashboardSummary;
    loading: boolean;
}

const slots = [
    { key: "MORNING", label: "Morning" },
    { key: "AFTERNOON", label: "Afternoon" },
    { key: "EVENING", label: "Evening" },
] as const;

export const SlotLoadCard: React.FC<Props> = ({ data, loading }) => {
    return (
        <Card>
            <p className="text-sm text-zinc-400 mb-3">Today Slot Load</p>

            <div className="flex flex-col gap-3">
                {slots.map((slot) => {
                    const count = data?.slotCounts?.[slot.key] ?? 0;
                    const percent = Math.min(count * 10, 100); // temp capacity scale

                    return (
                        <div key={slot.key}>
                            <div className="flex justify-between text-xs mb-1">
                                <span>{slot.label}</span>
                                <span>{count}</span>
                            </div>

                            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600"
                                    style={{ width: `${loading ? 0 : percent}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};
