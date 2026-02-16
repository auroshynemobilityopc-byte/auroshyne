import { useDashboardSummary } from "../hooks";
import { KpiGrid } from "../components/KpiGrid";
import { RevenueCard } from "../components/RevenueCard";
import { SlotLoadCard } from "../components/SlotLoadCard";
import { Button } from "../../../components/shared/Button";

export const DashboardPage = () => {
    const { data, isLoading, refetch, isFetching } = useDashboardSummary();

    return (
        <div className="p-3 pb-24 lg:p-6 flex flex-col gap-4 bg-zinc-950 min-h-screen text-zinc-100">

            {/* KPI GRID */}
            <div className="flex flex-col gap-4">
                <KpiGrid data={data} loading={isLoading} />
            </div>

            {/* REVENUE CARD WRAPPER */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 shadow-sm shadow-black/20 transition-all duration-150">
                <RevenueCard value={data?.todayRevenue} loading={isLoading} />
            </div>

            {/* SLOT LOAD CARD WRAPPER */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 shadow-sm shadow-black/20 transition-all duration-150">
                <SlotLoadCard data={data} loading={isLoading} />
            </div>

            {/* REFRESH BUTTON (THUMB FRIENDLY) */}
            <div className="mt-2">
                <Button
                    variant="secondary"
                    onClick={() => refetch()}
                    loading={isFetching}
                    className="w-full h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 active:scale-[0.98] transition-all duration-150"
                >
                    Refresh
                </Button>
            </div>
        </div>
    );
};
