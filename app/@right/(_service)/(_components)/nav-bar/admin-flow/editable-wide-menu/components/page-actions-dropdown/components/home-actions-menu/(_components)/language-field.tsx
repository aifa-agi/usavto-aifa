// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_components)/language-field.tsx
"use client";

import { toast } from "sonner";
import { AppConfigUpdateData } from "@/app/@right/(_service)/(_types)/api-response-types";
import { handleFieldUpdate } from "../(_utils)/handle-field-update";
import { LanguageSelector } from "../(_ui)/language-selector.tsxlanguage-selector";

interface LanguageFieldProps {
    config: AppConfigUpdateData | null;
    loading: boolean;
    error: boolean;
    reload: () => Promise<void>;
}

/**
 * Комментарии: Компонент для выбора языка приложения
 * Использует выпадающее подменю с галочкой для текущего выбора
 */
export function LanguageField({
    config,
    loading,
    error,
    reload,
}: LanguageFieldProps) {
    const handleSelectLanguage = async (langCode: string) => {
        if (!config) {
            toast.error("Failed to load AppConfig");
            return;
        }

        await handleFieldUpdate("lang", langCode, config, reload);
    };

    return (
        <LanguageSelector
            currentLang={config?.lang}
            loading={loading}
            error={error}
            onSelectLanguage={handleSelectLanguage}
        />
    );
}
