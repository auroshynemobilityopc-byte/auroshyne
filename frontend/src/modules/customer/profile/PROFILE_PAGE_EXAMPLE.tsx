/**
 * Example: Updated Profile Page with Offline Support
 * 
 * Shows how to add offline support to profile page including:
 * 1. Offline-first profile loading
 * 2. Disabled edit buttons when offline
 * 3. Offline alert display
 * 4. Cached address and vehicle display
 */

import { Edit2, Plus, Trash2, AlertCircle } from "lucide-react";
import { useMyProfileOffline, useUpdateProfileOffline, useDeleteAddressOffline } from "../profile/hooksOffline";
import { useSavedDataOffline, useDeleteVehicleOffline } from "../profile/hooksOffline";
import { OfflineAlert, OfflineButton } from "../shared/components/OfflineButton";
import { useOffline } from "../../../lib/OfflineContext";

export default function ProfilePageWithOffline() {
    // Use offline-first hooks
    const { data: profile, isLoading: profileLoading } = useMyProfileOffline();
    const { data: savedData } = useSavedDataOffline();
    const { isOffline, lastSyncedAt } = useOffline();

    // Mutations - automatically disabled when offline
    const { mutate: deleteAddress, isPending: isDeletingAddress } = useDeleteAddressOffline();
    const { mutate: deleteVehicle, isPending: isDeletingVehicle } = useDeleteVehicleOffline();
    const { isPending: isAddingAddress } = useUpdateProfileOffline();
    const { isPending: isAddingVehicle } = useUpdateProfileOffline();

    const formatSyncTime = (timestamp: number | null) => {
        if (!timestamp) return "Never synced";
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (profileLoading) {
        return <div className="p-6 mt-12 text-center">Loading profile...</div>;
    }

    return (
        <div className="p-6 pb-24 md:max-w-4xl md:mx-auto w-full">
            {/* Offline Alert */}
            <OfflineAlert />

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold">My Profile</h1>
                    {lastSyncedAt && (
                        <span className="text-xs text-zinc-400">
                            Last synced: {formatSyncTime(lastSyncedAt)}
                        </span>
                    )}
                </div>
                {isOffline && (
                    <p className="text-sm text-amber-400/70 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Showing cached profile data
                    </p>
                )}
            </div>

            {/* Profile Information Section */}
            <div className="bg-charcoal-800 rounded-2xl p-6 mb-6 border border-white/5">
                <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-bold">Personal Information</h2>
                    <OfflineButton
                        onClick={() => {/* Open edit modal */ }}
                        className="px-3 py-1 bg-brand-blue/20 hover:bg-brand-blue/30 text-brand-blue rounded text-sm flex items-center gap-2"
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit
                    </OfflineButton>
                </div>

                {profile ? (
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-zinc-400">Full Name</label>
                            <p className="text-white font-medium">{profile.name}</p>
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400">Email</label>
                            <p className="text-white font-medium">{profile.email}</p>
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400">Phone</label>
                            <p className="text-white font-medium">{profile.phone}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-zinc-400">No profile data available</p>
                )}
            </div>

            {/* Saved Addresses Section */}
            <div className="bg-charcoal-800 rounded-2xl p-6 mb-6 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Saved Addresses</h2>
                    <OfflineButton
                        onClick={() => {/* Open add address modal */ }}
                        disabled={isAddingAddress}
                        className="px-3 py-1 bg-brand-blue/20 hover:bg-brand-blue/30 text-brand-blue rounded text-sm flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Address
                    </OfflineButton>
                </div>

                {savedData?.addresses && savedData.addresses.length > 0 ? (
                    <div className="space-y-3">
                        {savedData.addresses.map((addr: any) => (
                            <div
                                key={addr._id}
                                className="bg-zinc-900 rounded-lg p-4 flex items-start justify-between border border-zinc-700"
                            >
                                <div>
                                    <p className="text-white font-medium">{addr.house}</p>
                                    <p className="text-sm text-zinc-400">{addr.street}</p>
                                </div>
                                <OfflineButton
                                    onClick={() => deleteAddress(addr._id)}
                                    disabled={isDeletingAddress}
                                    className="text-red-400 hover:text-red-300 p-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </OfflineButton>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-zinc-400">No saved addresses</p>
                )}
            </div>

            {/* Saved Vehicles Section */}
            <div className="bg-charcoal-800 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Saved Vehicles</h2>
                    <OfflineButton
                        onClick={() => {/* Open add vehicle modal */ }}
                        disabled={isAddingVehicle}
                        className="px-3 py-1 bg-brand-blue/20 hover:bg-brand-blue/30 text-brand-blue rounded text-sm flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Vehicle
                    </OfflineButton>
                </div>

                {savedData?.vehicles && savedData.vehicles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {savedData.vehicles.map((vehicle: any) => (
                            <div
                                key={vehicle._id}
                                className="bg-zinc-900 rounded-lg p-4 border border-zinc-700 flex items-center justify-between"
                            >
                                <div>
                                    <p className="text-white font-mono font-bold">{vehicle.number}</p>
                                    <p className="text-xs text-zinc-400 capitalize">{vehicle.type}</p>
                                </div>
                                <OfflineButton
                                    onClick={() => deleteVehicle(vehicle._id)}
                                    disabled={isDeletingVehicle}
                                    className="text-red-400 hover:text-red-300 p-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </OfflineButton>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-zinc-400">No saved vehicles</p>
                )}
            </div>

            {/* Offline Notice */}
            {isOffline && (
                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm text-amber-200">
                    <p className="font-semibold mb-1">📱 Offline Limitations</p>
                    <ul className="text-xs space-y-1 text-amber-200/80">
                        <li>✓ View profile information (cached)</li>
                        <li>✓ View saved addresses (cached)</li>
                        <li>✓ View saved vehicles (cached)</li>
                        <li>✗ Edit profile (requires internet)</li>
                        <li>✗ Add/delete addresses (requires internet)</li>
                        <li>✗ Add/delete vehicles (requires internet)</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

/**
 * MIGRATION GUIDE: How to update your existing ProfilePage
 * 
 * In src/modules/customer/profile/pages/ProfilePage.tsx:
 * 
 * 1. Update imports:
 *    OLD: import { useMyProfile, useUpdateProfile } from "../hooks";
 *    NEW: import { useMyProfileOffline, useUpdateProfileOffline, useAddAddressOffline, ... } from "../hooksOffline";
 *         import { OfflineAlert, OfflineButton } from "../../shared/components/OfflineButton";
 *         import { useOffline } from "../../../../lib/OfflineContext";
 * 
 * 2. Replace hook calls:
 *    OLD: const { data: profile } = useMyProfile();
 *         const { mutate: updateProfile } = useUpdateProfile();
 *    NEW: const { data: profile } = useMyProfileOffline();
 *         const { mutate: updateProfile } = useUpdateProfileOffline();
 *         const { isOffline, lastSyncedAt } = useOffline();
 * 
 * 3. Add offline alert:
 *    <OfflineAlert />
 * 
 * 4. Wrap all action buttons with OfflineButton:
 *    OLD: <button onClick={handleEdit}>Edit</button>
 *    NEW: <OfflineButton onClick={handleEdit}>Edit</OfflineButton>
 * 
 * 5. Update icon import (if not already there):
 *    import { Edit2, Plus, Trash2 } from "lucide-react";
 */
