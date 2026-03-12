import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { Save, Settings2, ImagePlus, Loader2 } from "lucide-react";

import { useSettings, useUpdateSettings } from "../../../modules/settings/hooks";
import { useServices } from "../../../modules/services/hooks";
import { uploadGalleryImageApi } from "../../../modules/settings/api";
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

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState<UpdateSettingPayload>({
        slotsCount: {
            morning: 0,
            afternoon: 0,
            evening: 0,
        },
        bookingDays: 7,
        taxPercentage: 0,
        bulkDiscount: {
            twoVehicles: 5,
            threeOrMoreVehicles: 10,
        },
        videoLink: "",
        whatsappNumber: "",
        isBookingClosed: false,
        bookingClosedMessage: "Temporary bookings are closed and will be continued soon.",
        galleryImages: [],
        homeServices: [
            { serviceId: "", image: "", description: "" },
            { serviceId: "", image: "", description: "" },
            { serviceId: "", image: "", description: "" },
        ],
        emailSettings: {
            provider: "disabled",
            fromEmail: "",
            fromName: "",
            nodemailer: {
                host: "",
                port: 587,
                user: "",
                pass: "",
            },
            resend: {
                apiKey: "",
            },
        },
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
                bulkDiscount: {
                    twoVehicles: settingsData.data.bulkDiscount?.twoVehicles ?? 5,
                    threeOrMoreVehicles: settingsData.data.bulkDiscount?.threeOrMoreVehicles ?? 10,
                },
                videoLink: settingsData.data.videoLink || "",
                whatsappNumber: settingsData.data.whatsappNumber || "",
                isBookingClosed: settingsData.data.isBookingClosed || false,
                bookingClosedMessage: settingsData.data.bookingClosedMessage || "Temporary bookings are closed and will be continued soon.",
                galleryImages: settingsData.data.galleryImages || [],
                homeServices: paddedHs,
                emailSettings: {
                    provider: settingsData.data.emailSettings?.provider || "disabled",
                    fromEmail: settingsData.data.emailSettings?.fromEmail || "",
                    fromName: settingsData.data.emailSettings?.fromName || "",
                    nodemailer: {
                        host: settingsData.data.emailSettings?.nodemailer?.host || "",
                        port: settingsData.data.emailSettings?.nodemailer?.port || 587,
                        user: settingsData.data.emailSettings?.nodemailer?.user || "",
                        pass: "",
                    },
                    resend: {
                        apiKey: "",
                    },
                },
            });
        }
    }, [settingsData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: name === "videoLink" || name === "whatsappNumber" || name === "bookingClosedMessage" ? value : Number(value),
            }));
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            galleryImages: e.target.value.split('\n').filter(url => url.trim() !== "")
        }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        toast.loading("Uploading image...", { id: "upload-toast" });

        try {
            const res = await uploadGalleryImageApi(file);
            if (res.success && res.url) {
                setFormData((prev) => ({
                    ...prev,
                    galleryImages: [...(prev.galleryImages || []), res.url]
                }));
                toast.success("Image uploaded successfully!", { id: "upload-toast" });
            } else {
                toast.error("Upload failed.", { id: "upload-toast" });
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to upload image.", { id: "upload-toast" });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
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

    const handleBulkDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            bulkDiscount: {
                ...prev.bulkDiscount,
                [name]: Number(value),
            } as any,
        }));
    };

    const handleHomeServiceChange = (index: number, field: string, value: string) => {
        setFormData((prev) => {
            const updated = [...(prev.homeServices || [])];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, homeServices: updated };
        });
    };

    const handleEmailSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            emailSettings: {
                ...prev.emailSettings!,
                [name]: value,
            },
        }));
    };

    const handleNodemailerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            emailSettings: {
                ...prev.emailSettings!,
                nodemailer: {
                    ...prev.emailSettings!.nodemailer!,
                    [name]: name === "port" ? (value === "" ? "" : Number(value)) : value,
                },
            },
        }));
    };

    const handleResendChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            emailSettings: {
                ...prev.emailSettings!,
                resend: {
                    ...prev.emailSettings!.resend!,
                    [name]: value,
                },
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: any = {
                ...formData,
                homeServices: formData.homeServices?.filter(hs => hs.serviceId && hs.serviceId !== "")
            };

            // Do not send empty passwords (don't overwrite existing db credentials)
            if (payload.emailSettings?.nodemailer?.pass === "") {
                delete payload.emailSettings.nodemailer.pass;
            }
            if (payload.emailSettings?.resend?.apiKey === "") {
                delete payload.emailSettings.resend.apiKey;
            }

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
                    <FormField label="Bulk Discount - 2 Vehicles (%)">
                        <Input
                            type="number"
                            step="0.1"
                            name="twoVehicles"
                            value={formData.bulkDiscount?.twoVehicles ?? 5}
                            onChange={handleBulkDiscountChange}
                            min="0"
                            max="100"
                            required
                        />
                    </FormField>
                    <FormField label="Bulk Discount - 3+ Vehicles (%)">
                        <Input
                            type="number"
                            step="0.1"
                            name="threeOrMoreVehicles"
                            value={formData.bulkDiscount?.threeOrMoreVehicles ?? 10}
                            onChange={handleBulkDiscountChange}
                            min="0"
                            max="100"
                            required
                        />
                    </FormField>
                </div>
            </Card>

            <Card className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Media Links</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Home Page Video Link">
                        <Input
                            type="url"
                            name="videoLink"
                            value={formData.videoLink}
                            onChange={handleChange}
                            placeholder="https://youtube.com/..."
                        />
                    </FormField>
                    <FormField label="WhatsApp Number">
                        <Input
                            type="text"
                            name="whatsappNumber"
                            value={formData.whatsappNumber}
                            onChange={handleChange}
                            placeholder="+919876543210"
                        />
                    </FormField>
                </div>
            </Card>

            <Card className="p-6 border-red-500/30">
                <h2 className="text-lg font-semibold text-red-400 mb-4">Emergency Controls</h2>
                <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isBookingClosed"
                            checked={formData.isBookingClosed}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-white/20 bg-zinc-900 text-brand-blue focus:ring-brand-blue"
                        />
                        <div>
                            <span className="text-white font-medium block">Close New Bookings</span>
                            <span className="text-xs text-zinc-400">If checked, customers won't be able to access the booking page.</span>
                        </div>
                    </label>

                    {formData.isBookingClosed && (
                        <FormField label="Closing Message / Prompt">
                            <textarea
                                name="bookingClosedMessage"
                                value={formData.bookingClosedMessage}
                                onChange={handleChange}
                                placeholder="Message to display when customers try to book..."
                                rows={3}
                                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-brand-blue transition-colors"
                            />
                        </FormField>
                    )}
                </div>
            </Card>

            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Home Page Image Gallery</h2>
                        <p className="text-sm text-zinc-400">Enter image URLs manually or upload files (one URL per line).</p>
                    </div>
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImagePlus className="w-4 h-4 mr-2" />}
                            {isUploading ? "Uploading..." : "Upload Image"}
                        </Button>
                    </div>
                </div>

                <FormField label="Gallery Images">
                    <textarea
                        value={formData.galleryImages?.join('\n') || ''}
                        onChange={handleGalleryChange}
                        placeholder="https://example.com/img1.jpg&#10;https://example.com/img2.jpg"
                        rows={5}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 resize-y focus:outline-none focus:border-brand-blue transition-colors leading-relaxed"
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
            <Card className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Email Delivery Settings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <FormField label="Email Provider">
                        <select
                            name="provider"
                            value={formData.emailSettings?.provider || "disabled"}
                            onChange={handleEmailSettingChange}
                            className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue transition-colors"
                        >
                            <option value="disabled">Disabled</option>
                            <option value="nodemailer">Nodemailer (SMTP)</option>
                            <option value="resend">Resend</option>
                        </select>
                    </FormField>
                </div>

                {formData.emailSettings?.provider !== "disabled" && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <FormField label="From Name">
                                <Input
                                    type="text"
                                    name="fromName"
                                    value={formData.emailSettings?.fromName || ""}
                                    onChange={handleEmailSettingChange}
                                    placeholder="Company Name"
                                    required
                                />
                            </FormField>
                            <FormField label="From Email">
                                <Input
                                    type="email"
                                    name="fromEmail"
                                    value={formData.emailSettings?.fromEmail || ""}
                                    onChange={handleEmailSettingChange}
                                    placeholder="noreply@company.com"
                                    required
                                />
                            </FormField>
                        </div>

                        {formData.emailSettings?.provider === "nodemailer" && (
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                                <h3 className="text-brand-blue font-bold">SMTP Configuration</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField label="SMTP Host">
                                        <Input
                                            type="text"
                                            name="host"
                                            value={formData.emailSettings?.nodemailer?.host || ""}
                                            onChange={handleNodemailerChange}
                                            placeholder="smtp.gmail.com"
                                            required={formData.emailSettings?.provider === "nodemailer"}
                                        />
                                    </FormField>
                                    <FormField label="SMTP Port">
                                        <Input
                                            type="number"
                                            name="port"
                                            value={formData.emailSettings?.nodemailer?.port || ""}
                                            onChange={handleNodemailerChange}
                                            placeholder="587"
                                            required={formData.emailSettings?.provider === "nodemailer"}
                                        />
                                    </FormField>
                                    <FormField label="SMTP Username / Email">
                                        <Input
                                            type="text"
                                            name="user"
                                            value={formData.emailSettings?.nodemailer?.user || ""}
                                            onChange={handleNodemailerChange}
                                            placeholder="user@example.com"
                                            required={formData.emailSettings?.provider === "nodemailer"}
                                        />
                                    </FormField>
                                    <FormField label="SMTP Password">
                                        <Input
                                            type="password"
                                            name="pass"
                                            value={formData.emailSettings?.nodemailer?.pass || ""}
                                            onChange={handleNodemailerChange}
                                            placeholder="Leave blank to keep existing password"
                                        />
                                    </FormField>
                                </div>
                            </div>
                        )}

                        {formData.emailSettings?.provider === "resend" && (
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                                <h3 className="text-brand-blue font-bold">Resend Configuration</h3>
                                <div className="grid grid-cols-1">
                                    <FormField label="Resend API Key">
                                        <Input
                                            type="password"
                                            name="apiKey"
                                            value={formData.emailSettings?.resend?.apiKey || ""}
                                            onChange={handleResendChange}
                                            placeholder="Leave blank to keep existing API Key"
                                        />
                                    </FormField>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </Card>
        </form>
    );
};
