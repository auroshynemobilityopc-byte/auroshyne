import { useState } from "react";
import { toast } from "react-hot-toast";
import { Mail, Plus, Edit2, Trash2, Eye, X as CloseIcon } from "lucide-react";
import { useTemplates, useCreateTemplate, useUpdateTemplate, useDeleteTemplate } from "../../../modules/emailTemplates/hooks";
import { EmailTemplateFormDrawer } from "../../../modules/emailTemplates/components/EmailTemplateFormDrawer";
import { Button } from "../../../components/shared/Button";
import type { EmailTemplate } from "../../../modules/emailTemplates/types";

export const EmailTemplatesPage = () => {
    const { data, isLoading } = useTemplates();
    const templates = data ?? [];

    const createMutation = useCreateTemplate();
    const updateMutation = useUpdateTemplate();
    const deleteMutation = useDeleteTemplate();

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

    const handleCreate = (form: any) => {
        createMutation.mutate(form, {
            onSuccess: () => {
                toast.success("Template created successfully");
                setOpen(false);
            },
            onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to create template")
        });
    };

    const handleEdit = (t: any) => {
        setSelected(t);
        setOpen(true);
    };

    const handleUpdate = (form: any) => {
        updateMutation.mutate(
            { id: selected._id, data: form },
            {
                onSuccess: () => {
                    toast.success("Template updated successfully");
                    setOpen(false);
                },
                onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update template")
            }
        );
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this template?")) {
            deleteMutation.mutate(id, {
                onSuccess: () => toast.success("Template deleted"),
                onError: () => toast.error("Failed to delete template")
            });
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* PAGE HEADER */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm shadow-black/20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-sm font-semibold text-zinc-100">
                        Email Templates
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => {
                            setSelected(null);
                            setOpen(true);
                        }}
                        className="h-9 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Template
                    </Button>
                </div>
            </div>

            {/* LIST */}
            {isLoading ? (
                <div className="text-zinc-500 text-sm">Loading templates...</div>
            ) : templates.length === 0 ? (
                <div className="text-zinc-500 text-sm text-center py-10 bg-zinc-900 border border-zinc-800 rounded-2xl">
                    No templates found. Create one!
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {templates.map((t: EmailTemplate) => (
                        <div key={t._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm shadow-black/20 flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-white truncate">{t.name}</h3>
                                    <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">{t._id}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button 
                                        onClick={() => setPreviewTemplate(t)} 
                                        className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-indigo-400" 
                                        title="Preview"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleEdit(t)} 
                                        className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(t._id)} 
                                        className="p-2 bg-zinc-800 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-zinc-800 flex flex-col gap-1 text-sm">
                                <span className="text-zinc-500 truncate">Subject: <span className="text-zinc-300">{t.subject}</span></span>
                                <span className="text-zinc-500">Status: <span className={t.isActive ? "text-green-400" : "text-red-400"}>{t.isActive ? 'Active' : 'Inactive'}</span></span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* DRAWER */}
            <EmailTemplateFormDrawer
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={selected ? handleUpdate : handleCreate}
                defaultValues={selected || undefined}
            />

            {/* PREVIEW MODAL */}
            {previewTemplate && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-indigo-400" />
                                    Preview: {previewTemplate.name}
                                </h3>
                                <p className="text-sm text-zinc-400 mt-1">Subject: {previewTemplate.subject}</p>
                            </div>
                            <button 
                                onClick={() => setPreviewTemplate(null)}
                                className="p-2 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors"
                            >
                                <CloseIcon className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-hidden p-6 bg-white">
                            {/* IFRAME FOR ISOLATED CSS */}
                            <iframe 
                                title="Mail Preview"
                                className="w-full h-full border-none"
                                srcDoc={`
                                    <html>
                                        <head>
                                            <style>
                                                body { font-family: sans-serif; padding: 20px; line-height: 1.6; color: #333; margin: 0; }
                                                img { max-width: 100%; height: auto; }
                                            </style>
                                        </head>
                                        <body>
                                            ${previewTemplate.body}
                                        </body>
                                    </html>
                                `}
                            />
                        </div>

                        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-end">
                            <Button onClick={() => setPreviewTemplate(null)} className="rounded-xl px-6">
                                Close Preview
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
