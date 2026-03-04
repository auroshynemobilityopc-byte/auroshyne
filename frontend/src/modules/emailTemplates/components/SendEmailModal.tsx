import { useState, useEffect } from "react";
import { useTemplates } from "../hooks";
import { Modal } from "../../../components/shared/Modal";
import { FormField } from "../../../components/shared/FormField";
import { Input } from "../../../components/shared/Input";
import { Button } from "../../../components/shared/Button";
import { api } from "../../../lib/apiClient/axios";
import toast from "react-hot-toast";

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

                <FormField label="Message Body (HTML)">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={8}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue"
                        placeholder="Type your email... Use placeholders like {{user.name}} if needed."
                    />
                </FormField>

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
