import { User as UserIcon, Phone, LogOut, ChevronRight, Bell, Shield, HelpCircle, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMyProfile, useLogout } from "../hooks";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { data: profileResult, isLoading, isError } = useMyProfile();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();

    const user = profileResult?.data;

    if (isLoading) return <div className="p-6 text-center mt-12">Loading profile...</div>;
    if (isError) return (
        <div className="p-6 pb-24 flex flex-col items-center justify-center mt-12 gap-3">
            <WifiOff className="w-10 h-10 text-zinc-500" />
            <p className="text-zinc-400 text-sm text-center">
                You're offline and no cached profile was found.<br />
                Connect to the internet and open this page once to enable offline access.
            </p>
        </div>
    );

    return (
        <div className="pb-24 md:max-w-3xl md:mx-auto w-full">
            {/* Header */}
            <div className="bg-charcoal-800 p-6 pt-10 pb-8 rounded-b-3xl border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-brand-blue flex items-center justify-center text-3xl font-bold shadow-xl shadow-brand-blue/20">
                        {user?.name ? user.name.substring(0, 2).toUpperCase() : "US"}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
                        <p className="text-text-grey">{user?.mobile || user?.email || '-'} </p>
                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 text-[10px] text-brand-blue font-medium uppercase tracking-wider">
                            {user?.isPremium ? 'Gold Member' : 'Standard Member'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="p-6 space-y-6">
                <section>
                    <h2 className="text-sm font-bold text-text-grey uppercase tracking-wider mb-3 px-2">Account</h2>
                    <div className="bg-charcoal-800 rounded-2xl overflow-hidden border border-white/5">
                        {[
                            { icon: UserIcon, label: "Edit Profile", onClick: () => navigate("/edit-profile") },
                            { icon: MapPin, label: "Saved Addresses", onClick: () => navigate("/saved") },
                            { icon: Bell, label: "Notifications", onClick: () => { } },
                        ].map((item, i) => (
                            <button key={i} onClick={item.onClick} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5 text-text-grey" />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-text-grey" />
                            </button>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-bold text-text-grey uppercase tracking-wider mb-3 px-2">Support</h2>
                    <div className="bg-charcoal-800 rounded-2xl overflow-hidden border border-white/5">
                        {[
                            { icon: Phone, label: "Contact Us" },
                            { icon: HelpCircle, label: "FAQ" },
                            { icon: Shield, label: "Privacy Policy" },
                        ].map((item, i) => (
                            <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5 text-text-grey" />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-text-grey" />
                            </button>
                        ))}
                    </div>
                </section>

                <button
                    onClick={() => logout()}
                    disabled={isLoggingOut}
                    className="w-full p-4 rounded-xl bg-red-500/10 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                    <LogOut className="w-5 h-5" />
                    {isLoggingOut ? "Logging Out..." : "Log Out"}
                </button>

                <div className="text-center text-xs text-text-grey pt-4">
                    <p>Version 1.0.0</p>
                    <p>Made with ❤️ by Auro-Shyne</p>
                </div>
            </div>
        </div>
    );
}

// Helper for icon
function MapPin(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    )
}
