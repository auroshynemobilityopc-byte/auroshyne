import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Drawer } from "../../../components/shared/Drawer";
import { FormField } from "../../../components/shared/FormField";
import { Input } from "../../../components/shared/Input";
import { Button } from "../../../components/shared/Button";
import type { CreateEmailTemplatePayload } from "../types";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    defaultValues?: any;
}

export const EmailTemplateFormDrawer = ({ open, onClose, onSubmit, defaultValues }: Props) => {
    const { register, handleSubmit, reset } = useForm<CreateEmailTemplatePayload>();
    const [showPlaceholders, setShowPlaceholders] = useState(false);
    const [activeCategory, setActiveCategory] = useState<"user" | "booking" | "discount" | null>(null);

    const userPlaceholders = ["{{user.name}}", "{{user.email}}", "{{user.mobile}}"];
    const bookingPlaceholders = ["{{booking.id}}", "{{booking.date}}", "{{booking.slot}}", "{{booking.status}}", "{{booking.totalAmount}}"];
    const discountPlaceholders = ["{{discount.code}}", "{{discount.value}}"];

    useEffect(() => {
        if (open) {
            reset(
                defaultValues || {
                    name: "",
                    subject: "",
                    body: "",
                }
            );
        }
    }, [open, defaultValues, reset]);

    const handleFormSubmit = (data: CreateEmailTemplatePayload) => {
        onSubmit(data);
    };

    return (
        <Drawer open={open} onClose={onClose}>
            <div className="h-full flex flex-col gap-6 w-full">
                <div className="text-xl font-bold text-white mb-2">
                    {defaultValues ? "Edit Template" : "Add Template"}
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4 flex-1">
                    <FormField label="Template Name (Internal)">
                        <Input
                            {...register("name", { required: true })}
                            placeholder="e.g., Booking Confirmation"
                        />
                    </FormField>

                    <FormField label="Email Subject">
                        <Input
                            {...register("subject", { required: true })}
                            placeholder="Your booking is confirmed!"
                        />
                    </FormField>

                    <FormField label="Email Body (HTML supported)">
                        <textarea
                            {...register("body", { required: true })}
                            placeholder="<p>Hello world!</p>"
                            rows={10}
                            className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue transition-colors resize-y"
                        />
                    </FormField>

                    <div className="space-y-4 py-2 border-t border-white/5 mt-2">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-zinc-400 font-medium">Placeholders Utility</p>
                            <Button
                                type="button"
                                variant="secondary"
                                className="!py-1 !px-2 text-xs"
                                fullWidth={false}
                                onClick={() => setShowPlaceholders(!showPlaceholders)}
                            >
                                {showPlaceholders ? "Hide Placeholders" : "Show Placeholders"}
                            </Button>
                        </div>

                        {showPlaceholders && (
                            <div className="space-y-3 bg-zinc-900/50 p-3 rounded-lg border border-white/5">
                                <div className="flex gap-2">
                                    <Button type="button" variant={activeCategory === "user" ? "primary" : "secondary"} fullWidth={false} className="!py-1.5 focus:outline-none !px-3 text-xs" onClick={() => setActiveCategory(activeCategory === "user" ? null : "user")}>User Placeholders</Button>
                                    <Button type="button" variant={activeCategory === "booking" ? "primary" : "secondary"} fullWidth={false} className="!py-1.5 focus:outline-none !px-3 text-xs" onClick={() => setActiveCategory(activeCategory === "booking" ? null : "booking")}>Booking Placeholders</Button>
                                    <Button type="button" variant={activeCategory === "discount" ? "primary" : "secondary"} fullWidth={false} className="!py-1.5 focus:outline-none !px-3 text-xs" onClick={() => setActiveCategory(activeCategory === "discount" ? null : "discount")}>Discount Placeholders</Button>
                                </div>

                                {activeCategory && (
                                    <div className="pt-2">
                                        <div className="flex flex-wrap gap-2 text-[11px] text-zinc-300">
                                            {(activeCategory === "user" ? userPlaceholders : activeCategory === "booking" ? bookingPlaceholders : discountPlaceholders).map((ph) => (
                                                <span key={ph} className="bg-zinc-800 px-2 py-1.5 rounded bg-black/40 border border-white/10 cursor-pointer hover:bg-zinc-700 hover:text-white transition-colors" onClick={() => navigator.clipboard.writeText(ph)}>{ph}</span>
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-zinc-500 italic mt-2">Click any chip to copy to clipboard</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-auto flex justify-end gap-3 pt-6 border-t border-white/10">
                        <Button type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {defaultValues ? "Update Template" : "Create Template"}
                        </Button>
                    </div>
                </form>
            </div>
        </Drawer>
    );
};
