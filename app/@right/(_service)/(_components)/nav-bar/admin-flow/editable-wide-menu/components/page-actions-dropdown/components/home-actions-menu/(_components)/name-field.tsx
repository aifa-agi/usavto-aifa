// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_components)/name-field.tsx
"use client";

import { toast } from "sonner";

import { useDialogs } from "@/app/@right/(_service)/(_context)/dialogs";
import { AppConfigUpdateData } from "@/app/@right/(_service)/(_types)/api-response-types";
import { handleFieldUpdate } from "../(_utils)/handle-field-update";
import { AppConfigFieldItem } from "../(_ui)/app-config-field-item";

interface NameFieldProps {
    config: AppConfigUpdateData | null;
    loading: boolean;
    error: boolean;
    reload: () => Promise<void>;
}

/**
 * Комментарии: Компонент для редактирования полного имени сайта
 * Открывает диалог при клике для ввода нового значения
 */
export function NameField({ config, loading, error, reload }: NameFieldProps) {
    const dialogs = useDialogs();

    const handleEditName = () => {
        if (error || !config) {
            toast.error("Failed to load AppConfig");
            return;
        }

        dialogs.show({
            type: config.name ? "edit" : "create",
            title: config.name ? "Edit Site Name" : "Add Site Name",
            description: config.name
                ? `Current value: "${config.name}"`
                : "Enter the full name of your application",
            value: config.name || "",
            placeholder: "Enter site name...",
            confirmLabel: config.name ? "Update Name" : "Add Name",
            onConfirm: async (value) => {
                if (!value?.trim()) return;
                await handleFieldUpdate("name", value.trim(), config, reload);
            },
        });
    };

    return (
        <AppConfigFieldItem
            label="Site Name"
            fieldValue={config?.name}
            loading={loading}
            error={error}
            onEditClick={handleEditName}
        />
    );
}
