import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Save, Settings2 } from "lucide-react";

import { useSettings, useUpdateSettings } from "../../../modules/settings/hooks";
import { useServices } from "../../../modules/services/hooks";
import type { UpdateSettingPayload } from "../../../modules/settings/types";

import { Card } from "../../../components/shared/Card";
import { Input } from "../../../components/shared/Input";
import { Button } from "../../../components/shared/Button";
import { FormField } from "../../../components/shared/FormField";
import { Skeleton } from "../../../components/shared/Skeleton";

export const SettingsPage: React.FC = () => {
    const { data: settingsData, isLoading } = useSettings();
    const updateSettings = useUpdateSettings();

    // Fetch services to allow selection
    const { data: servicesRes } = useServices();
    const servicesList = servicesRes?.data || [];

    const [formData, setFormData] = useState<UpdateSettingPayload>({
        slotsCount: {
            morning: 0,
            afternoon: 0,
            evening: 0,
        },
        bookingDays: 7,
        taxPercentage: 0,
        videoLink: "",
        homeServices: [
            { serviceId: "", image: "", description: "" },
            { serviceId: "", image: "", description: "" },
            { serviceId: "", image: "", description: "" },
        ],
    });

    useEffect(() => {
        if (settingsData?.data) {
            const hs = settingsData.data.homeServices || [];
            // default 3 empty slots if not fully populated
            const paddedHs = Array.from({ length: 3 }).map((_, i) => ({
                serviceId: hs[i]?.serviceId?._id || hs[i]?.serviceId || "",
                image: hs[i]?.image || "",
                description: hs[i]?.description || "",
            }));

            setFormData({
                slotsCount: {
                    morning: settingsData.data.slotsCount?.morning || 0,
                    afternoon: settingsData.data.slotsCount?.afternoon || 0,
                    evening: settingsData.data.slotsCount?.evening || 0,
                },
                bookingDays: settingsData.data.bookingDays || 7,
                taxPercentage: settingsData.data.taxPercentage || 0,
                videoLink: settingsData.data.videoLink || "",
                homeServices: paddedHs,
            });
        }
    }, [settingsData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "videoLink" ? value : Number(value),
        }));
    };

    const handleSlotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            slotsCount: {
                ...prev.slotsCount,
                [name]: Number(value),
            },
        }));
    };

    const handleHomeServiceChange = (index: number, field: string, value: string) => {
        setFormData((prev) => {
            const updated = [...(prev.homeServices || [])];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, homeServices: updated };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                homeServices: formData.homeServices?.filter(hs => hs.serviceId && hs.serviceId !== "")
            };
            await updateSettings.mutateAsync(payload);
            toast.success("Settings updated successfully");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update settings");
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                <Skeleton className="h-40 w-full rounded-2xl" />
                <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Settings2 className="w-6 h-6 text-indigo-400" />
                        Global Settings
                    </h1>
                    <p className="text-sm text-zinc-400 mt-1">
                        Manage system-wide configuration and constraints.
                    </p>
                </div>
                <Button
                    type="submit"
                    loading={updateSettings.isPending}
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
            </div>

            <Card className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Slot Settings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField label="Morning Slots">
                        <Input
                            type="number"
                            name="morning"
                            value={formData.slotsCount?.morning}
                            onChange={handleSlotChange}
                            min="0"
                            required
                        />
                    </FormField>
                    <FormField label="Afternoon Slots">
                        <Input
                            type="number"
                            name="afternoon"
                            value={formData.slotsCount?.afternoon}
                            onChange={handleSlotChange}
                            min="0"
                            required
                        />
                    </FormField>
                    <FormField label="Evening Slots">
                        <Input
                            type="number"
                            name="evening"
                            value={formData.slotsCount?.evening}
                            onChange={handleSlotChange}
                            min="0"
                            required
                        />
                    </FormField>
                </div>
            </Card>

            <Card className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Booking & Pricing</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Advance Booking Days">
                        <Input
                            type="number"
                            name="bookingDays"
                            value={formData.bookingDays}
                            onChange={handleChange}
                            min="1"
                            max="60"
                            required
                        />
                    </FormField>
                    <FormField label="Tax Percentage (%)">
                        <Input
                            type="number"
                            step="0.01"
                            name="taxPercentage"
                            value={formData.taxPercentage}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </FormField>
                </div>
            </Card>

            <Card className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Media Links</h2>
                <FormField label="Home Page Video Link">
                    <Input
                        type="url"
                        name="videoLink"
                        value={formData.videoLink}
                        onChange={handleChange}
                        placeholder="https://youtube.com/..."
                    />
                </FormField>
            </Card>
            <Card className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Featured Home Services</h2>
                <p className="text-sm text-zinc-400 mb-6">Select 3 services to feature on the home screen along with custom descriptions and images.</p>

                <div className="space-y-8">
                    {formData.homeServices?.map((hs, index) => (
                        <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                            <h3 className="text-brand-blue font-bold">Featured Service {index + 1}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField label="Select Service">
                                    <select
                                        value={hs.serviceId}
                                        onChange={(e) => handleHomeServiceChange(index, "serviceId", e.target.value)}
                                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue transition-colors"
                                    >
                                        <option value="" disabled>-- Select a Service --</option>
                                        {servicesList.map((srv: any) => (
                                            <option key={srv._id} value={srv._id}>{srv.name} (₹{srv.price})</option>
                                        ))}
                                    </select>
                                </FormField>
                                <FormField label="Custom Image URL">
                                    <Input
                                        type="url"
                                        value={hs.image}
                                        onChange={(e) => handleHomeServiceChange(index, "image", e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </FormField>
                            </div>
                            <FormField label="Custom Description">
                                <textarea
                                    value={hs.description}
                                    onChange={(e) => handleHomeServiceChange(index, "description", e.target.value)}
                                    placeholder="Short description for the home page..."
                                    rows={2}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-brand-blue transition-colors"
                                />
                            </FormField>
                        </div>
                    ))}
                </div>
            </Card>
        </form>
    );
};
