import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import {
    Save,
    Settings2,
    ImagePlus,
    Loader2,
    CalendarClock,
    BadgePercent,
    Home,
    Phone,
    Mail,
    ShieldAlert,
    X,
} from "lucide-react";

import { useSettings, useUpdateSettings } from "../../../modules/settings/hooks";
import { useServices } from "../../../modules/services/hooks";
import { useTemplates } from "../../../modules/emailTemplates/hooks";
import { uploadGalleryImageApi } from "../../../modules/settings/api";
import type { UpdateSettingPayload } from "../../../modules/settings/types";

import { Card } from "../../../components/shared/Card";
import { Input } from "../../../components/shared/Input";
import { Button } from "../../../components/shared/Button";
import { FormField } from "../../../components/shared/FormField";
import { Skeleton } from "../../../components/shared/Skeleton";

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
    { id: "booking", label: "Booking", Icon: CalendarClock },
    { id: "pricing", label: "Pricing", Icon: BadgePercent },
    { id: "homepage", label: "Home Page", Icon: Home },
    { id: "contact", label: "Contact", Icon: Phone },
    { id: "email", label: "Email", Icon: Mail },
] as const;

type TabId = typeof TABS[number]["id"];

// ─── Component ────────────────────────────────────────────────────────────────
export const SettingsPage: React.FC = () => {
    const { data: settingsData, isLoading } = useSettings();
    const updateSettings = useUpdateSettings();

    const { data: servicesRes } = useServices();
    const servicesList = servicesRes?.data || [];

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<TabId>("booking");

    // Email Templates for triggers
    const { data: templatesRes } = useTemplates();
    const templates = templatesRes || [];

    const [formData, setFormData] = useState<UpdateSettingPayload>({
        slotsCount: { morning: 0, afternoon: 0, evening: 0 },
        bookingDays: 7,
        taxPercentage: 0,
        bulkDiscount: { twoVehicles: 5, threeOrMoreVehicles: 10 },
        videoLink: "",
        whatsappNumber: "",
        showWhatsapp: true,
        isBookingClosed: false,
        bookingClosedMessage: "Temporary bookings are closed and will be continued soon.",
        restrictToCity: false,
        allowedCity: "Visakhapatnam",
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
            nodemailer: { host: "", port: 587, user: "", pass: "" },
            resend: { apiKey: "" },
        },
        autoEmails: {
            newBooking: { enabled: false, templateId: null },
            newRegistration: { enabled: false, templateId: null },
            bookingCompleted: { enabled: false, templateId: null },
        },
    });

    useEffect(() => {
        if (settingsData?.data) {
            const hs = settingsData.data.homeServices || [];
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
                showWhatsapp: settingsData.data.showWhatsapp !== false,
                isBookingClosed: settingsData.data.isBookingClosed || false,
                bookingClosedMessage:
                    settingsData.data.bookingClosedMessage ||
                    "Temporary bookings are closed and will be continued soon.",
                restrictToCity: settingsData.data.restrictToCity || false,
                allowedCity: settingsData.data.allowedCity || "Visakhapatnam",
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
                    resend: { apiKey: "" },
                },
                autoEmails: {
                    newBooking: {
                        enabled: settingsData.data.autoEmails?.newBooking?.enabled ?? false,
                        templateId: settingsData.data.autoEmails?.newBooking?.templateId || null,
                    },
                    newRegistration: {
                        enabled: settingsData.data.autoEmails?.newRegistration?.enabled ?? false,
                        templateId: settingsData.data.autoEmails?.newRegistration?.templateId || null,
                    },
                    bookingCompleted: {
                        enabled: settingsData.data.autoEmails?.bookingCompleted?.enabled ?? false,
                        templateId: settingsData.data.autoEmails?.bookingCompleted?.templateId || null,
                    },
                },
            });
        }
    }, [settingsData]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const { checked } = e.target as HTMLInputElement;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]:
                    name === "videoLink" || name === "whatsappNumber" || name === "bookingClosedMessage" || name === "allowedCity"
                        ? value
                        : Number(value),
            }));
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            galleryImages: e.target.value.split("\n").filter((url) => url.trim() !== ""),
        }));
    };

    const handleAutoEmailChange = (trigger: keyof NonNullable<UpdateSettingPayload["autoEmails"]>, field: "enabled" | "templateId", value: any) => {
        setFormData(prev => ({
            ...prev,
            autoEmails: {
                ...prev.autoEmails,
                [trigger]: {
                    ...prev.autoEmails?.[trigger],
                    [field]: value
                }
            }
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
                    galleryImages: [...(prev.galleryImages || []), res.url],
                }));
                toast.success("Image uploaded successfully!", { id: "upload-toast" });
            } else {
                toast.error("Upload failed.", { id: "upload-toast" });
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to upload image.", {
                id: "upload-toast",
            });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleSlotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            slotsCount: { ...prev.slotsCount, [name]: Number(value) },
        }));
    };

    const handleBulkDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            bulkDiscount: { ...prev.bulkDiscount, [name]: Number(value) } as any,
        }));
    };

    const handleHomeServiceChange = (index: number, field: string, value: string) => {
        setFormData((prev) => {
            const updated = [...(prev.homeServices || [])];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, homeServices: updated };
        });
    };

    const handleEmailSettingChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            emailSettings: { ...prev.emailSettings!, [name]: value },
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
                resend: { ...prev.emailSettings!.resend!, [name]: value },
            },
        }));
    };

    // ── Save (full payload, same as before) ───────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: any = {
                ...formData,
                homeServices: formData.homeServices?.filter(
                    (hs) => hs.serviceId && hs.serviceId !== ""
                ),
            };
            if (payload.emailSettings?.nodemailer?.pass === "") {
                delete payload.emailSettings.nodemailer.pass;
            }
            if (payload.emailSettings?.resend?.apiKey === "") {
                delete payload.emailSettings.resend.apiKey;
            }
            await updateSettings.mutateAsync(payload);
            toast.success("Settings saved!");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update settings");
        }
    };

    // ─── Loading skeleton ─────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
        );
    }

    // ─── JSX ──────────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col gap-6 max-w-3xl">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Settings2 className="w-6 h-6 text-indigo-400" />
                    Global Settings
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                    Manage system-wide configuration. Select a category below to edit its settings.
                </p>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 flex-wrap">
                {TABS.map(({ id, label, Icon }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setActiveTab(id)}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center
                            ${activeTab === id
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                                : "text-zinc-400 hover:text-white hover:bg-white/10"
                            }
                        `}
                    >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {label}
                    </button>
                ))}
            </div>

            {/* Tab panels — each wraps its own form with a Save button */}

            {/* ── BOOKING TAB ─────────────────────────────────────────────── */}
            {activeTab === "booking" && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                        <h2 className="text-lg font-semibold text-white mb-4">Advance Booking Window</h2>
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
                        </div>
                    </Card>
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Location Restrictions</h2>
                        <div className="flex flex-col gap-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="restrictToCity"
                                    checked={formData.restrictToCity}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-white/20 bg-zinc-900 text-brand-blue focus:ring-brand-blue"
                                />
                                <div>
                                    <span className="text-white font-medium block">Restrict Bookings to Specific City</span>
                                    <span className="text-xs text-zinc-400">
                                        Only allow bookings within the specified city/region.
                                    </span>
                                </div>
                            </label>

                            {formData.restrictToCity && (
                                <FormField label="Allowed City Name">
                                    <Input
                                        type="text"
                                        name="allowedCity"
                                        value={formData.allowedCity}
                                        onChange={handleChange}
                                        placeholder="e.g. Visakhapatnam"
                                        required
                                    />
                                </FormField>
                            )}
                        </div>
                    </Card>

                    <Card className="p-6 border-red-500/30">
                        <h2 className="text-lg font-semibold text-red-400 mb-1 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5" />
                            Emergency Controls
                        </h2>
                        <p className="text-xs text-zinc-500 mb-4">Use with caution — this affects all customers.</p>
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
                                    <span className="text-xs text-zinc-400">
                                        If checked, customers won't be able to access the booking page.
                                    </span>
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

                    <div className="flex justify-end">
                        <Button type="submit" loading={updateSettings.isPending}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Booking Settings
                        </Button>
                    </div>
                </form>
            )}

            {/* ── PRICING TAB ─────────────────────────────────────────────── */}
            {activeTab === "pricing" && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Tax</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <h2 className="text-lg font-semibold text-white mb-4">Bulk Discounts</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label="2 Vehicles Discount (%)">
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
                            <FormField label="3+ Vehicles Discount (%)">
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

                    <div className="flex justify-end">
                        <Button type="submit" loading={updateSettings.isPending}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Pricing Settings
                        </Button>
                    </div>
                </form>
            )}

            {/* ── HOME PAGE TAB ────────────────────────────────────────────── */}
            {activeTab === "homepage" && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Home Page Video</h2>
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
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-semibold text-white">Image Gallery</h2>
                                <p className="text-sm text-zinc-400">
                                    Enter image URLs manually or upload files (one URL per line).
                                </p>
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
                                    {isUploading ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <ImagePlus className="w-4 h-4 mr-2" />
                                    )}
                                    {isUploading ? "Uploading..." : "Upload Image"}
                                </Button>
                            </div>
                        </div>
                        {/* ── Image thumbnail grid ── */}
                        {(formData.galleryImages?.length ?? 0) > 0 && (
                            <div className="mb-4">
                                <p className="text-xs text-zinc-400 mb-2 font-medium uppercase tracking-wider">
                                    {formData.galleryImages?.length} image{formData.galleryImages?.length !== 1 ? "s" : ""}
                                </p>
                                {/* scrollable wrapper — shows 2 rows, scrolls vertically for more */}
                                <div
                                    className="overflow-y-auto rounded-xl border border-white/10 bg-zinc-900/50 p-2"
                                    style={{ maxHeight: "17rem" }}
                                >
                                    <div className="grid grid-cols-4 gap-2">
                                        {formData.galleryImages?.map((url, idx) => (
                                            <div
                                                key={idx}
                                                className="group relative aspect-square rounded-lg overflow-hidden border border-white/10"
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Gallery ${idx + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src =
                                                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%2318181b' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='%2371717a'%3ENo img%3C/text%3E%3C/svg%3E";
                                                    }}
                                                />
                                                {/* dark overlay on hover */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200" />
                                                {/* X delete button */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            galleryImages: (prev.galleryImages || []).filter(
                                                                (_, i) => i !== idx
                                                            ),
                                                        }))
                                                    }
                                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-600 hover:bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                                                    title="Remove image"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                                {/* image index badge */}
                                                <span className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                                                    #{idx + 1}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Manual URL textarea ── */}
                        <FormField label="Image URLs (one per line)">
                            <textarea
                                value={formData.galleryImages?.join("\n") || ""}
                                onChange={handleGalleryChange}
                                placeholder={"https://example.com/img1.jpg\nhttps://example.com/img2.jpg"}
                                rows={3}
                                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 resize-y focus:outline-none focus:border-brand-blue transition-colors leading-relaxed"
                            />
                        </FormField>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-white mb-1">Featured Home Services</h2>
                        <p className="text-sm text-zinc-400 mb-6">
                            Select 3 services to feature on the home screen along with custom descriptions and images.
                        </p>
                        <div className="space-y-8">
                            {formData.homeServices?.map((hs, index) => (
                                <div
                                    key={index}
                                    className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4"
                                >
                                    <h3 className="text-brand-blue font-bold">
                                        Featured Service {index + 1}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField label="Select Service">
                                            <select
                                                value={hs.serviceId}
                                                onChange={(e) =>
                                                    handleHomeServiceChange(index, "serviceId", e.target.value)
                                                }
                                                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue transition-colors"
                                            >
                                                <option value="" disabled>
                                                    -- Select a Service --
                                                </option>
                                                {servicesList.map((srv: any) => (
                                                    <option key={srv._id} value={srv._id}>
                                                        {srv.name} (₹{srv.price})
                                                    </option>
                                                ))}
                                            </select>
                                        </FormField>
                                        <FormField label="Custom Image URL">
                                            <Input
                                                type="url"
                                                value={hs.image}
                                                onChange={(e) =>
                                                    handleHomeServiceChange(index, "image", e.target.value)
                                                }
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </FormField>
                                    </div>
                                    <FormField label="Custom Description">
                                        <textarea
                                            value={hs.description}
                                            onChange={(e) =>
                                                handleHomeServiceChange(index, "description", e.target.value)
                                            }
                                            placeholder="Short description for the home page..."
                                            rows={2}
                                            className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-brand-blue transition-colors"
                                        />
                                    </FormField>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" loading={updateSettings.isPending}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Home Page Settings
                        </Button>
                    </div>
                </form>
            )}

            {/* ── CONTACT TAB ─────────────────────────────────────────────── */}
            {activeTab === "contact" && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-white mb-1">WhatsApp</h2>
                        <p className="text-sm text-zinc-400 mb-5">
                            Control the WhatsApp floating chat button shown to customers.
                        </p>

                        {/* ── Visibility Toggle ── */}
                        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl mb-5">
                            <div>
                                <p className="text-white font-medium">Show WhatsApp Button</p>
                                <p className="text-xs text-zinc-400 mt-0.5">
                                    {formData.showWhatsapp
                                        ? "Button is visible to customers"
                                        : "Button is hidden from customers"}
                                </p>
                            </div>
                            {/* Pill toggle */}
                            <button
                                type="button"
                                role="switch"
                                aria-checked={formData.showWhatsapp}
                                onClick={() =>
                                    setFormData((prev) => ({ ...prev, showWhatsapp: !prev.showWhatsapp }))
                                }
                                className={`
                                    relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
                                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900
                                    ${formData.showWhatsapp ? "bg-[#25D366]" : "bg-zinc-700"}
                                `}
                            >
                                <span
                                    className={`
                                        pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0
                                        transition-transform duration-200 ease-in-out
                                        ${formData.showWhatsapp ? "translate-x-7" : "translate-x-0"}
                                    `}
                                />
                            </button>
                        </div>

                        {/* ── Number input (dimmed when hidden) ── */}
                        <div className={`transition-opacity duration-200 ${formData.showWhatsapp ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField label="WhatsApp Number">
                                    <Input
                                        type="text"
                                        name="whatsappNumber"
                                        value={formData.whatsappNumber}
                                        onChange={handleChange}
                                        placeholder="+919876543210"
                                        disabled={!formData.showWhatsapp}
                                    />
                                </FormField>
                            </div>
                            <p className="text-xs text-zinc-500 mt-3">
                                Include country code (e.g. +91 for India). Used for the WhatsApp floating button on the customer site.
                            </p>
                        </div>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" loading={updateSettings.isPending}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Contact Settings
                        </Button>
                    </div>
                </form>
            )}

            {/* ── EMAIL TAB ───────────────────────────────────────────────── */}
            {activeTab === "email" && (
                <div className="flex flex-col gap-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* ─── Delivery Settings ─── */}
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

                        {/* ─── Trigger Controls ─── */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Auto Email Triggers</h2>
                            <p className="text-sm text-zinc-400 mb-6">Select which emails should be sent automatically and which template to use.</p>

                            <div className="space-y-6">
                                {[
                                    { id: 'newBooking', label: 'New Booking', desc: 'Sent when a customer successfully creates a booking.' },
                                    { id: 'newRegistration', label: 'User Registration', desc: 'Sent when a new user registers on the platform.' },
                                    { id: 'bookingCompleted', label: 'Booking Completed', desc: 'Sent when an admin marks a booking as completed.' }
                                ].map((trigger) => (
                                    <div key={trigger.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-semibold text-white">{trigger.label}</h3>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAutoEmailChange(trigger.id as any, 'enabled', !formData.autoEmails?.[trigger.id as keyof typeof formData.autoEmails]?.enabled)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.autoEmails?.[trigger.id as keyof typeof formData.autoEmails]?.enabled ? "bg-brand-blue" : "bg-zinc-700"
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.autoEmails?.[trigger.id as keyof typeof formData.autoEmails]?.enabled ? "translate-x-6" : "translate-x-1"
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                            <p className="text-xs text-zinc-500">{trigger.desc}</p>
                                        </div>

                                        <div className="w-full sm:w-64">
                                            <select
                                                value={formData.autoEmails?.[trigger.id as keyof typeof formData.autoEmails]?.templateId || ""}
                                                onChange={(e) => handleAutoEmailChange(trigger.id as any, 'templateId', e.target.value || null)}
                                                disabled={!formData.autoEmails?.[trigger.id as keyof typeof formData.autoEmails]?.enabled}
                                                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <option value="">Select a template...</option>
                                                {templates.map(t => (
                                                    <option key={t._id} value={t._id}>{t.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <div className="flex justify-end">
                            <Button type="submit" loading={updateSettings.isPending}>
                                <Save className="w-4 h-4 mr-2" />
                                Save Email Settings
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};
