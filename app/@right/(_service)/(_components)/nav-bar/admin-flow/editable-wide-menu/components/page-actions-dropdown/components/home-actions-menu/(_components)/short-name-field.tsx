// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_components)/short-name-field.tsx
"use client";

import { toast } from "sonner";
import { useDialogs } from "@/app/@right/(_service)/(_context)/dialogs";
import { AppConfigUpdateData } from "@/app/@right/(_service)/(_types)/api-response-types";
import { handleFieldUpdate } from "../(_utils)/handle-field-update";
import { AppConfigFieldItem } from "../(_ui)/app-config-field-item";

interface ShortNameFieldProps {
    config: AppConfigUpdateData | null;
    loading: boolean;
    error: boolean;
    reload: () => Promise<void>;
}

/**
 * Комментарии: Компонент для редактирования короткого имени приложения
 * Используется в PWA manifest для отображения на главном экране
 */
export function ShortNameField({
    config,
    loading,
    error,
    reload,
}: ShortNameFieldProps) {
    const dialogs = useDialogs();

    const handleEditShortName = () => {
        if (error || !config) {
            toast.error("Failed to load AppConfig");
            return;
        }

        dialogs.show({
            type: config.short_name ? "edit" : "create",
            title: config.short_name ? "Edit Short Name" : "Add Short Name",
            description: config.short_name
                ? `Current value: "${config.short_name}"`
                : "Enter the abbreviated name for PWA",
            value: config.short_name || "",
            placeholder: "Enter short name...",
            confirmLabel: config.short_name ? "Update Short Name" : "Add Short Name",
            onConfirm: async (value) => {
                if (!value?.trim()) return;
                await handleFieldUpdate("short_name", value.trim(), config, reload);
            },
        });
    };

    return (
        <AppConfigFieldItem
            label="Short Name"
            fieldValue={config?.short_name}
            loading={loading}
            error={error}
            onEditClick={handleEditShortName}
        />
    );
}
