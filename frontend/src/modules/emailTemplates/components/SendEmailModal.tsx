import { useState, useEffect, useRef } from "react";
import { useTemplates } from "../hooks";
import { Modal } from "../../../components/shared/Modal";
import { FormField } from "../../../components/shared/FormField";
import { Input } from "../../../components/shared/Input";
import { Button } from "../../../components/shared/Button";
import { api } from "../../../lib/apiClient/axios";
import toast from "react-hot-toast";
import { ImagePlus, Loader2 } from "lucide-react";
import { uploadGalleryImageApi } from "../../settings/api";

interface Props {
    open: boolean;
    onClose: () => void;
    userId?: string;
    bookingId?: string;
    defaultToEmail?: string;
}

export const SendEmailModal = ({ open, onClose, userId, bookingId, defaultToEmail }: Props) => {
    const { data: templates } = useTemplates();
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectedTemplateId && templates) {
            const tmpl = templates.find((t) => t._id === selectedTemplateId);
            if (tmpl) {
                setSubject(tmpl.subject);
                setContent(tmpl.body);
            }
        }
    }, [selectedTemplateId, templates]);

    useEffect(() => {
        if (open) {
            setSelectedTemplateId("");
            setSubject("");
            setContent("");
        }
    }, [open]);

    const handleSend = async () => {
        if (!selectedTemplateId && !content) {
            toast.error("Please provide email content or select a template");
            return;
        }

        try {
            setLoading(true);

            // Build payload only with present non-empty values to avoid Joi type errors
            const payload: Record<string, any> = {
                subject: subject || undefined,
                content: content || undefined,
                templateId: selectedTemplateId || undefined,
            };
            if (defaultToEmail) payload.to = defaultToEmail;
            if (typeof userId === "string" && userId) payload.userId = userId;
            if (typeof bookingId === "string" && bookingId) payload.bookingId = bookingId;

            await api.post("/mail/send-parsed", payload);
            toast.success("Email sent successfully");
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to send email");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        toast.loading("Uploading image...", { id: "upload-email-img" });

        try {
            const res = await uploadGalleryImageApi(file);
            if (res.success && res.url) {
                const imgTag = `<br/><img src="${res.url}" alt="Attachment" style="max-width: 100%; border-radius: 8px;" /><br/>`;
                setContent((prev) => prev + imgTag);
                toast.success("Image added to email!", { id: "upload-email-img" });
            } else {
                toast.error("Upload failed.", { id: "upload-email-img" });
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to upload image.", { id: "upload-email-img" });
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="text-xl font-bold text-white mb-4">Send Email</div>
            <div className="flex flex-col gap-4">
                <FormField label="Template (Optional)">
                    <select
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue"
                        value={selectedTemplateId}
                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                    >
                        <option value="">-- Custom Email --</option>
                        {templates?.map((t) => (
                            <option key={t._id} value={t._id}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                </FormField>

                <FormField label="Subject">
                    <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Email subject"
                    />
                </FormField>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-white">Message Body (HTML)</label>
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingImage}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white transition-colors border border-white/10"
                            >
                                {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImagePlus className="w-3.5 h-3.5" />}
                                {uploadingImage ? "Uploading..." : "Insert Image"}
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={8}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue"
                        placeholder="Type your email... Use placeholders like {{user.name}} if needed."
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-2">
                    <Button variant="secondary" onClick={onClose} fullWidth={false}>
                        Cancel
                    </Button>
                    <Button onClick={handleSend} loading={loading} fullWidth={false}>
                        Send Email
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
