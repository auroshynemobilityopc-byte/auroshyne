import { Card } from "../../../components/shared/Card";
import { Skeleton } from "../../../components/shared/Skeleton";

interface Props {
    value?: number;
    loading: boolean;
}

export const RevenueCard: React.FC<Props> = ({ value, loading }) => {
    return (
        <Card>
            <p className="text-sm text-zinc-400">Today Revenue</p>

            {loading ? (
                <Skeleton className="h-6 w-24 mt-2" />
            ) : (
                <p className="text-2xl font-semibold mt-1">₹ {value}</p>
            )}
        </Card>
    );
};
