export const InvoiceVehicleTable = ({ vehicles }: any) => {
    return (
        <div className="flex flex-col gap-3">
            {vehicles.map((v: any) => (
                <div
                    key={v.number}
                    className="bg-zinc-900 rounded-xl p-3 flex flex-col gap-2"
                >
                    <div className="flex justify-between">
                        <p className="font-medium">
                            {v.number} • {v.model}
                        </p>
                        <p className="text-sm text-zinc-400">{v.type}</p>
                    </div>

                    <p className="text-sm">
                        {v.service.name} • ₹ {v.service.price}
                    </p>

                    {v.addons.length > 0 && (
                        <div className="text-xs text-zinc-400">
                            {v.addons.map((a: any) => (
                                <div key={a.name}>
                                    {a.name} • ₹ {a.price}
                                </div>
                            ))}
                        </div>
                    )}

                    <p className="text-right font-semibold">
                        ₹ {v.price}
                    </p>
                </div>
            ))}
        </div>
    );
};
