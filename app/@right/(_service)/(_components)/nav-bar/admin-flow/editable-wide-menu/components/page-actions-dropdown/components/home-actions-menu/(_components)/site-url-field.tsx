// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_components)/site-url-field.tsx
"use client";

import { toast } from "sonner";
import { useDialogs } from "@/app/@right/(_service)/(_context)/dialogs";
import { AppConfigUpdateData } from "@/app/@right/(_service)/(_types)/api-response-types";
import { handleFieldUpdate } from "../(_utils)/handle-field-update";
import { AppConfigFieldItem } from "../(_ui)/app-config-field-item";

interface SiteUrlFieldProps {
    config: AppConfigUpdateData | null;
    loading: boolean;
    error: boolean;
    reload: () => Promise<void>;
}

/**
 * Комментарии: Компонент для редактирования базового URL сайта
 * Используется для формирования канонических ссылок и Open Graph
 */
export function SiteUrlField({
    config,
    loading,
    error,
    reload,
}: SiteUrlFieldProps) {
    const dialogs = useDialogs();

    const handleEditSiteUrl = () => {
        if (error || !config) {
            toast.error("Failed to load AppConfig");
            return;
        }

        dialogs.show({
            type: config.siteUrl ? "edit" : "create",
            title: config.siteUrl ? "Edit Site URL" : "Add Site URL",
            description: config.siteUrl
                ? `Current value: "${config.siteUrl}"`
                : "Update the base URL (e.g., https://example.com)",
            value: config.siteUrl || "",
            placeholder: "Enter site URL...",
            confirmLabel: config.siteUrl ? "Update URL" : "Add URL",
            onConfirm: async (value) => {
                if (!value?.trim()) return;
                await handleFieldUpdate("siteUrl", value.trim(), config, reload);
            },
        });
    };

    return (
        <AppConfigFieldItem
            label="Site URL"
            fieldValue={config?.siteUrl}
            loading={loading}
            error={error}
            onEditClick={handleEditSiteUrl}
        />
    );
}
