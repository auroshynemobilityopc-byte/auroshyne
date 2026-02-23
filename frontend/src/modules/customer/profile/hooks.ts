import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyProfile, logoutCustomer, updateMyProfile, getSavedData, addAddress, deleteAddress, addVehicle, deleteVehicle } from "./api";
import { clearCustomerToken } from "../../../app/customer/customerStorage";
import toast from "react-hot-toast";

export const useMyProfile = () => {
    return useQuery({
        queryKey: ["customerProfile"],
        queryFn: getMyProfile,
    });
};

export const useLogout = () => {
    return useMutation({
        mutationFn: logoutCustomer,
        onSuccess: () => {
            clearCustomerToken();
            toast.success("Logged out successfully");
            window.location.href = "/login";
        },
        onError: () => {
            clearCustomerToken();
            window.location.href = "/login";
        }
    });
};

export const useUpdateProfile = (onSuccess?: () => void) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateMyProfile,
        onSuccess: () => {
            toast.success("Profile updated!");
            qc.invalidateQueries({ queryKey: ["customerProfile"] });
            onSuccess?.();
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to update profile");
        },
    });
};

export const useSavedData = () =>
    useQuery({ queryKey: ["savedData"], queryFn: getSavedData });

export const useAddAddress = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: addAddress,
        onSuccess: () => { toast.success("Address saved!"); qc.invalidateQueries({ queryKey: ["savedData"] }); },
        onError: (e: any) => toast.error(e?.response?.data?.message || "Failed"),
    });
};

export const useDeleteAddress = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteAddress,
        onSuccess: () => { toast.success("Address removed."); qc.invalidateQueries({ queryKey: ["savedData"] }); },
        onError: (e: any) => toast.error(e?.response?.data?.message || "Failed"),
    });
};

export const useAddVehicle = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: addVehicle,
        onSuccess: () => { toast.success("Vehicle saved!"); qc.invalidateQueries({ queryKey: ["savedData"] }); },
        onError: (e: any) => toast.error(e?.response?.data?.message || "Failed"),
    });
};

export const useDeleteVehicle = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteVehicle,
        onSuccess: () => { toast.success("Vehicle removed."); qc.invalidateQueries({ queryKey: ["savedData"] }); },
        onError: (e: any) => toast.error(e?.response?.data?.message || "Failed"),
    });
};
