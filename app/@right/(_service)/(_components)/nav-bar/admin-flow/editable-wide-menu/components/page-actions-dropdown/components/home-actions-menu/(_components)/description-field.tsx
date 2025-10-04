// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_components)/description-field.tsx
"use client";

import { toast } from "sonner";
import { useDialogs } from "@/app/@right/(_service)/(_context)/dialogs";
import { AppConfigUpdateData } from "@/app/@right/(_service)/(_types)/api-response-types";
import { AppConfigFieldItem } from "../(_ui)/app-config-field-item";
import { handleFieldUpdate } from "../(_utils)/handle-field-update";

interface DescriptionFieldProps {
    config: AppConfigUpdateData | null;
    loading: boolean;
    error: boolean;
    reload: () => Promise<void>;
}

/**
 * Комментарии: Компонент для редактирования описания сайта
 * Использует textarea для многострочного ввода текста
 */
export function DescriptionField({
    config,
    loading,
    error,
    reload,
}: DescriptionFieldProps) {
    const dialogs = useDialogs();

    const handleEditDescription = () => {
        if (error || !config) {
            toast.error("Failed to load AppConfig");
            return;
        }

        dialogs.show({
            type: config.description ? "edit" : "create",
            inputType: "textarea",
            title: config.description ? "Edit Description" : "Add Description",
            description: config.description
                ? "Update the site description"
                : "Enter a description for SEO",
            value: config.description || "",
            placeholder: "Enter description...",
            confirmLabel: config.description
                ? "Update Description"
                : "Add Description",
            onConfirm: async (value) => {
                if (!value?.trim()) return;
                await handleFieldUpdate("description", value.trim(), config, reload);
            },
        });
    };

    return (
        <AppConfigFieldItem
            label="Description"
            fieldValue={config?.description}
            loading={loading}
            error={error}
            onEditClick={handleEditDescription}
        />
    );
}
