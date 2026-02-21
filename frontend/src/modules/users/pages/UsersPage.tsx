import { useState } from "react";
import { toast } from "react-hot-toast";
import { useUsers, useCreateUser, useUpdateUser, useMe } from "../hooks";
import { UserCard } from "../components/UserCard";
import { UserTable } from "../components/UserTable";
import { UserFormDrawer } from "../components/UserFormDrawer";
import { Button } from "../../../components/shared/Button";

export const UsersPage = () => {
    const { data } = useUsers({ limit: 20 });
    const users = data?.data.filter((u) => u.role === "CUSTOMER") ?? [];

    const { data: me } = useMe();

    const createMutation = useCreateUser();
    const updateMutation = useUpdateUser();

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const handleCreate = (form: any) => {
        createMutation.mutate(form, {
            onSuccess: () => {
                toast.success("✅ Customer created successfully");
                setOpen(false);
                setTimeout(() => window.location.reload(), 500);
            },
            onError: () => toast.error("❌ Something went wrong. Please try again.")
        });
    };

    const handleEdit = (u: any) => {
        setSelected(u);
        setOpen(true);
    };

    const handleUpdate = (form: any) => {
        const payload = {
            name: form.name,
            email: form.email,
            mobile: form.mobile,
            role: form.role,
            isActive: selected.isActive
        };
        updateMutation.mutate(
            { id: selected._id, data: payload },
            {
                onSuccess: () => {
                    toast.success("✏️ Customer updated successfully");
                    setOpen(false);
                    setTimeout(() => window.location.reload(), 500);
                },
                onError: () => toast.error("❌ Something went wrong. Please try again.")
            }
        );
    };

    const handleToggle = (u: any) => {
        if (u._id === me?._id) return;

        updateMutation.mutate({
            id: u._id,
            data: { isActive: !u.isActive },
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <Button onClick={() => { setSelected(null); setOpen(true); }}>
                Add User
            </Button>

            {/* MOBILE */}
            <div className="flex flex-col gap-3 lg:hidden">
                {users.map((u) => (
                    <UserCard
                        key={u._id}
                        user={u}
                        onEdit={() => handleEdit(u)}
                        onToggle={() => handleToggle(u)}
                        disableToggle={u._id === me?._id}
                    />
                ))}
            </div>

            {/* DESKTOP */}
            <UserTable
                data={users}
                onEdit={handleEdit}
                onToggle={handleToggle}
                currentUserId={me?._id}
            />

            <UserFormDrawer
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={selected ? handleUpdate : handleCreate}
                defaultValues={selected || undefined}
                isEdit={!!selected}
            />
        </div>
    );
};
