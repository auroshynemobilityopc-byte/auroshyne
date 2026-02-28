import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSettingsApi } from "./api";
import { useOfflineCachedQuery } from "../../lib/useOfflineCachedQuery";
import type { SettingResponse, UpdateSettingPayload } from "./types";

export const useSettings = () => {
    return useOfflineCachedQuery<SettingResponse>(
        "/settings",
        "settings",
        "settings-all"
    );
};

export const useUpdateSettings = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateSettingPayload) => updateSettingsApi(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
    });
};
