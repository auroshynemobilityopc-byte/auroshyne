import { useState } from "react";
import { toast } from "react-hot-toast";
import { useUsers, useCreateUser, useUpdateUser, useMe } from "../hooks";
import { UserCard } from "../components/UserCard";
import { UserTable } from "../components/UserTable";
import { UserFormDrawer } from "../components/UserFormDrawer";
import { Button } from "../../../components/shared/Button";
import { Tabs } from "../../../components/shared/Tabs";
import { Pagination } from "../../../components/shared/Pagination";
import { SendEmailModal } from "../../emailTemplates/components/SendEmailModal";

// Discounts imports
import { useDiscounts, useCreateDiscount, useUpdateDiscount } from "../../discounts/hooks";
import { DiscountCard } from "../../discounts/components/DiscountCard";
import { DiscountTable } from "../../discounts/components/DiscountTable";
import { DiscountFormDrawer } from "../../discounts/components/DiscountFormDrawer";

const LIMIT = 10;

export const UsersPage = () => {
    const [activeTab, setActiveTab] = useState("CUSTOMERS");

    // ---------------- CUSTOMERS ----------------
    const [userPage, setUserPage] = useState(1);
    const { data: usersData } = useUsers({ limit: LIMIT, page: userPage });
    const users = usersData?.data.filter((u) => u.role === "CUSTOMER") ?? [];
    const userPagination = usersData?.pagination;

    const { data: me } = useMe();

    const userCreateMutation = useCreateUser();
    const userUpdateMutation = useUpdateUser();

    const [userOpen, setUserOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [emailUser, setEmailUser] = useState<any>(null);

    const handleCreateUser = (form: any) => {
        userCreateMutation.mutate(form, {
            onSuccess: () => {
                toast.success("✅ Customer created successfully");
                setUserOpen(false);
            },
            onError: () => toast.error("❌ Failed to create customer")
        });
    };

    const handleUpdateUser = (form: any) => {
        const payload = {
            name: form.name,
            email: form.email,
            mobile: form.mobile,
            role: form.role,
            isActive: selectedUser.isActive
        };
        userUpdateMutation.mutate(
            { id: selectedUser._id, data: payload },
            {
                onSuccess: () => {
                    toast.success("✏️ Customer updated successfully");
                    setUserOpen(false);
                },
                onError: () => toast.error("❌ Failed to update customer")
            }
        );
    };

    const handleToggleUser = (u: any) => {
        if (u._id === me?._id) return;
        userUpdateMutation.mutate({
            id: u._id,
            data: { isActive: !u.isActive },
        });
    };


    // ---------------- DISCOUNTS ----------------
    const [discountPage, setDiscountPage] = useState(1);
    const { data: discountsData } = useDiscounts({ limit: LIMIT, page: discountPage });
    const discounts = discountsData?.data ?? [];
    const discountPagination = discountsData?.pagination;

    const discountCreateMutation = useCreateDiscount();
    const discountUpdateMutation = useUpdateDiscount();

    const [discountOpen, setDiscountOpen] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState<any>(null);

    const handleCreateDiscount = (form: any) => {
        discountCreateMutation.mutate(form, {
            onSuccess: () => {
                toast.success("✅ Discount created successfully");
                setDiscountOpen(false);
            },
            onError: (err: any) => toast.error(err?.response?.data?.message || "❌ Failed to create discount")
        });
    };

    const handleUpdateDiscount = (form: any) => {
        discountUpdateMutation.mutate(
            { id: selectedDiscount._id, data: form },
            {
                onSuccess: () => {
                    toast.success("✏️ Discount updated successfully");
                    setDiscountOpen(false);
                },
                onError: (err: any) => toast.error(err?.response?.data?.message || "❌ Failed to update discount")
            }
        );
    };

    const handleToggleDiscount = (d: any) => {
        discountUpdateMutation.mutate({
            id: d._id,
            data: { isActive: !d.isActive },
        });
    };


    // ---------------- TABS ----------------
    const tabs = [
        { label: "Customers", value: "CUSTOMERS" },
        { label: "Discounts", value: "DISCOUNTS" }
    ];

    return (
        <div className="flex flex-col gap-4">

            <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} />

            {activeTab === "CUSTOMERS" && (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-end">
                        <Button onClick={() => { setSelectedUser(null); setUserOpen(true); }} className="w-full sm:w-auto">
                            + Add Customer
                        </Button>
                    </div>

                    {/* MOBILE */}
                    <div className="flex flex-col gap-3 lg:hidden">
                        {users.map((u) => (
                            <UserCard
                                key={u._id}
                                user={u}
                                onEdit={() => { setSelectedUser(u); setUserOpen(true); }}
                                onToggle={() => handleToggleUser(u)}
                                onSendEmail={() => setEmailUser(u)}
                                disableToggle={u._id === me?._id}
                            />
                        ))}
                    </div>

                    {/* DESKTOP */}
                    <UserTable
                        data={users}
                        onEdit={(u) => { setSelectedUser(u); setUserOpen(true); }}
                        onToggle={handleToggleUser}
                        onSendEmail={(u) => setEmailUser(u)}
                        currentUserId={me?._id}
                    />

                    {userPagination && (
                        <Pagination
                            page={userPagination.page}
                            pages={userPagination.pages}
                            total={userPagination.total}
                            limit={LIMIT}
                            onPageChange={setUserPage}
                        />
                    )}

                    <UserFormDrawer
                        open={userOpen}
                        onClose={() => setUserOpen(false)}
                        onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
                        defaultValues={selectedUser || undefined}
                        isEdit={!!selectedUser}
                    />
                </div>
            )}

            {activeTab === "DISCOUNTS" && (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-end">
                        <Button onClick={() => { setSelectedDiscount(null); setDiscountOpen(true); }} className="w-full sm:w-auto">
                            + Add Discount
                        </Button>
                    </div>

                    {/* MOBILE */}
                    <div className="flex flex-col gap-3 lg:hidden">
                        {discounts.map((d: any) => (
                            <DiscountCard
                                key={d._id}
                                discount={d}
                                onEdit={() => { setSelectedDiscount(d); setDiscountOpen(true); }}
                                onToggle={() => handleToggleDiscount(d)}
                            />
                        ))}
                    </div>

                    {/* DESKTOP */}
                    <DiscountTable
                        data={discounts}
                        onEdit={(d) => { setSelectedDiscount(d); setDiscountOpen(true); }}
                        onToggle={handleToggleDiscount}
                    />

                    {discountPagination && (
                        <Pagination
                            page={discountPagination.page}
                            pages={discountPagination.pages}
                            total={discountPagination.total}
                            limit={LIMIT}
                            onPageChange={setDiscountPage}
                        />
                    )}

                    <DiscountFormDrawer
                        open={discountOpen}
                        onClose={() => setDiscountOpen(false)}
                        onSubmit={selectedDiscount ? handleUpdateDiscount : handleCreateDiscount}
                        defaultValues={selectedDiscount || undefined}
                        isEdit={!!selectedDiscount}
                    />
                </div>
            )}
            {/* SEND EMAIL MODAL */}
            <SendEmailModal
                open={!!emailUser}
                onClose={() => setEmailUser(null)}
                userId={emailUser?._id}
                defaultToEmail={emailUser?.email}
            />
        </div>
    );
};
