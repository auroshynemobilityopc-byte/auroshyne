import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Phone, Mail, Save, CheckCircle } from "lucide-react";
import { useMyProfile, useUpdateProfile } from "../hooks";

export default function EditProfilePage() {
    const navigate = useNavigate();
    const { data: profileResult, isLoading } = useMyProfile();
    const user = profileResult?.data;

    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [saved, setSaved] = useState(false);

    // Seed from loaded profile
    useEffect(() => {
        if (!user) return;
        setName(user.name || "");
        setMobile(user.mobile || "");
        setEmail(user.email || "");
    }, [user]);

    const { mutate: update, isPending } = useUpdateProfile(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const payload: Record<string, string> = {};
        if (name.trim()) payload.name = name.trim();
        if (mobile.trim()) payload.mobile = mobile.trim();
        if (email.trim()) payload.email = email.trim();
        update(payload);
    };

    const initials = name ? name.substring(0, 2).toUpperCase() : "US";

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="pb-24 md:max-w-lg md:mx-auto w-full">
            {/* Top Bar */}
            <div className="flex items-center gap-4 px-4 pt-6 pb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-zinc-300" />
                </button>
                <h1 className="text-xl font-bold">Edit Profile</h1>
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center py-8 gap-3">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-blue to-brand-accent flex items-center justify-center text-3xl font-bold shadow-2xl shadow-brand-blue/30">
                        {initials}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-charcoal-800 border border-white/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-zinc-400" />
                    </div>
                </div>
                <p className="text-sm text-zinc-500">Your display name initials are auto-generated</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="px-4 space-y-4">

                {/* Name */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> Full Name
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20 transition-all"
                        />
                    </div>
                </div>

                {/* Mobile */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" /> Mobile Number
                    </label>
                    <div className="relative flex">
                        <span className="shrink-0 bg-charcoal-800 border border-r-0 border-white/10 rounded-l-xl px-4 py-3.5 text-sm text-zinc-400">+91</span>
                        <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            value={mobile}
                            onChange={e => setMobile(e.target.value.replace(/\D/g, ""))}
                            placeholder="10-digit mobile"
                            className="flex-1 bg-charcoal-800 border border-white/10 rounded-r-xl px-4 py-3.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20 transition-all min-w-0"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> Email Address
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20 transition-all"
                    />
                </div>

                {/* Save Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-accent disabled:opacity-50 text-white font-bold rounded-xl py-4 text-sm transition-all shadow-lg shadow-brand-blue/20 active:scale-[0.98]"
                    >
                        {saved ? (
                            <>
                                <CheckCircle className="w-5 h-5 text-green-300" />
                                Saved!
                            </>
                        ) : isPending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>

                {/* Info note */}
                <p className="text-center text-xs text-zinc-600 pt-2">
                    Changes apply to your account immediately.
                </p>
            </form>
        </div>
    );
}
