// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_components)/chat-brand-field.tsx
"use client";

import { toast } from "sonner";
import { useDialogs } from "@/app/@right/(_service)/(_context)/dialogs";
import { AppConfigUpdateData } from "@/app/@right/(_service)/(_types)/api-response-types";
import { handleFieldUpdate } from "../(_utils)/handle-field-update";
import { AppConfigFieldItem } from "../(_ui)/app-config-field-item";

interface ChatBrandFieldProps {
    config: AppConfigUpdateData | null;
    loading: boolean;
    error: boolean;
    reload: () => Promise<void>;
}

/**
 * Комментарии: Компонент для редактирования названия AI чат-бота
 * Отображается в интерфейсе чата как название ассистента
 */
export function ChatBrandField({
    config,
    loading,
    error,
    reload,
}: ChatBrandFieldProps) {
    const dialogs = useDialogs();

    const handleEditChatBrand = () => {
        if (error || !config) {
            toast.error("Failed to load AppConfig");
            return;
        }

        dialogs.show({
            type: config.chatBrand ? "edit" : "create",
            title: config.chatBrand ? "Edit Chat Brand" : "Add Chat Brand",
            description: config.chatBrand
                ? `Current value: "${config.chatBrand}"`
                : "Set the AI chat brand name",
            value: config.chatBrand || "",
            placeholder: "Enter chat brand...",
            confirmLabel: config.chatBrand ? "Update Chat Brand" : "Add Chat Brand",
            onConfirm: async (value) => {
                if (!value?.trim()) return;
                await handleFieldUpdate("chatBrand", value.trim(), config, reload);
            },
        });
    };

    return (
        <AppConfigFieldItem
            label="Chat Brand"
            fieldValue={config?.chatBrand}
            loading={loading}
            error={error}
            onEditClick={handleEditChatBrand}
        />
    );
}
