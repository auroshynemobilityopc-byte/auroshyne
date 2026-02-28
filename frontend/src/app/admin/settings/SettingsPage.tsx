import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Save, Settings2 } from "lucide-react";

import { useSettings, useUpdateSettings } from "../../../modules/settings/hooks";
import type { UpdateSettingPayload } from "../../../modules/settings/types";

import { Card } from "../../../components/shared/Card";
import { Input } from "../../../components/shared/Input";
import { Button } from "../../../components/shared/Button";
import { FormField } from "../../../components/shared/FormField";
import { Skeleton } from "../../../components/shared/Skeleton";

export const SettingsPage: React.FC = () => {
    const { data: settingsData, isLoading } = useSettings();
    const updateSettings = useUpdateSettings();

    const [formData, setFormData] = useState<UpdateSettingPayload>({
        slotsCount: {
            morning: 0,
            afternoon: 0,
            evening: 0,
        },
        bookingDays: 7,
        taxPercentage: 0,
        videoLink: "",
    });

    useEffect(() => {
        if (settingsData?.data) {
            setFormData({
                slotsCount: {
                    morning: settingsData.data.slotsCount?.morning || 0,
                    afternoon: settingsData.data.slotsCount?.afternoon || 0,
                    evening: settingsData.data.slotsCount?.evening || 0,
                },
                bookingDays: settingsData.data.bookingDays || 7,
                taxPercentage: settingsData.data.taxPercentage || 0,
                videoLink: settingsData.data.videoLink || "",
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateSettings.mutateAsync(formData);
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
        </form>
    );
};
