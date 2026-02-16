import { StatCard } from "../../../components/shared/StatCard";
import type { DashboardSummary } from "../types";

interface Props {
    data?: DashboardSummary;
    loading: boolean;
}

export const KpiGrid: React.FC<Props> = ({ data, loading }) => {
    return (
        <div className="grid grid-cols-2 gap-3">
            <StatCard title="Total" value={data?.total} loading={loading} />
            <StatCard title="Pending" value={data?.pending} loading={loading} />
            <StatCard title="Assigned" value={data?.assigned} loading={loading} />
            <StatCard title="Completed" value={data?.completed} loading={loading} />
            <StatCard title="Cancelled" value={data?.cancelled} loading={loading} />
        </div>
    );
};
