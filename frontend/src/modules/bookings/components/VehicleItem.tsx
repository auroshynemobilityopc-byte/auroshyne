import { Card } from "../../../components/shared/Card";

export const VehicleItem = ({ v }: any) => {
    return (
        <Card className="flex flex-col gap-2">
            <div className="flex justify-between">
                <p className="font-medium">{v.number}</p>
                <p className="text-sm text-zinc-400">{v.type}</p>
            </div>

            <p className="text-sm">
                Service: {v.serviceId.name} • ₹ {v.serviceId.price}
            </p>

            {v.addons.length > 0 && (
                <div className="text-xs text-zinc-400">
                    Add-ons:
                    {v.addons.map((a: any) => (
                        <div key={a.name}>
                            {a.name} • ₹ {a.price}
                        </div>
                    ))}
                </div>
            )}

            <p className="font-semibold text-right">₹ {v.price}</p>
        </Card>
    );
};
