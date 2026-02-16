import { useMe, useUpdateMe } from "../hooks";
import { Card } from "../../../components/shared/Card";
import { Input } from "../../../components/shared/Input";
import { Button } from "../../../components/shared/Button";
import { useForm } from "react-hook-form";
import { UserCircle, Mail, Shield } from "lucide-react";

export const ProfilePage = () => {
    const { data: me } = useMe();
    const updateMutation = useUpdateMe();

    const { register, handleSubmit } = useForm({
        values: me,
    });

    if (!me) return null;

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* LEFT — PROFILE CARD */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-sm shadow-black/20 flex flex-col items-center text-center">

                {/* AVATAR */}
                <div className="w-24 h-24 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
                    <UserCircle className="w-12 h-12 text-zinc-400" />
                </div>

                <h2 className="text-lg font-semibold text-zinc-100">
                    {me.name}
                </h2>

                <div className="flex items-center gap-2 mt-1 text-sm text-zinc-400">
                    <Mail className="w-4 h-4" />
                    {me.email}
                </div>

                {/* ROLE BADGE */}
                <span className="mt-3 px-2 py-1 text-xs rounded-full font-medium bg-sky-500/15 text-sky-400 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {me.role}
                </span>
            </div>

            {/* RIGHT — EDIT FORM */}
            <Card className="lg:col-span-2 bg-zinc-900 border border-zinc-800 shadow-sm shadow-black/20 p-6">
                <h3 className="text-sm font-semibold text-zinc-100 mb-4">
                    Edit Profile
                </h3>

                <form
                    onSubmit={handleSubmit((form) =>
                        updateMutation.mutate(form)
                    )}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    {/* NAME */}
                    <div className="flex flex-col gap-1 md:col-span-1">
                        <label className="text-xs text-zinc-400">Name</label>
                        <Input {...register("name")} />
                    </div>

                    {/* MOBILE */}
                    <div className="flex flex-col gap-1 md:col-span-1">
                        <label className="text-xs text-zinc-400">Mobile</label>
                        <Input {...register("mobile")} />
                    </div>

                    {/* EMAIL */}
                    <div className="flex flex-col gap-1 md:col-span-1">
                        <label className="text-xs text-zinc-400">Email</label>
                        <Input value={me.email} disabled />
                    </div>

                    {/* ROLE */}
                    <div className="flex flex-col gap-1 md:col-span-1">
                        <label className="text-xs text-zinc-400">Role</label>
                        <Input value={me.role} disabled />
                    </div>

                    {/* BUTTON */}
                    <div className="md:col-span-2 mt-2">
                        <Button
                            type="submit"
                            loading={updateMutation.isPending}
                            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white active:scale-[0.98] transition-all duration-150"
                        >
                            Update Profile
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
