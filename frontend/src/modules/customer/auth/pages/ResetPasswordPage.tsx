import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useResetPassword } from "../hooks";

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    
    const mutation = useResetPassword();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        mutation.mutate({ token, newPassword: password }, {
            onSuccess: () => {
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        });
    };

    if (!token) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-950 text-white px-6">
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-sm text-center">
                    <h2 className="text-red-400 font-bold text-lg mb-2">Invalid Link</h2>
                    <p className="text-sm text-red-400/80 mb-4">
                        This password reset link is invalid or has expired.
                    </p>
                    <button onClick={() => navigate("/forgot-password")} className="text-sm font-medium text-white bg-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors">
                        Request New Link
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-zinc-950 text-white px-6 justify-center">
            <div className="max-w-sm mx-auto w-full pb-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Create New Password</h1>
                    <p className="text-zinc-400 text-sm">
                        Please enter your new password below.
                    </p>
                </div>

                {mutation.isSuccess ? (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                        <h3 className="font-semibold text-emerald-400 mb-1">Success!</h3>
                        <p className="text-xs text-emerald-400/80">
                            Your password has been reset. Redirecting to login...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="text-xs font-medium text-zinc-400 mb-1.5 block ml-1">New Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-zinc-400 mb-1.5 block ml-1">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={mutation.isPending || !password || !confirmPassword}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3.5 rounded-2xl transition-colors mt-2 shadow-lg shadow-indigo-500/20"
                        >
                            {mutation.isPending ? "Saving..." : "Update Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
