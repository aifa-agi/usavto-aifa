// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_components)/chatbot-dark-upload.tsx
"use client";


import { RegularImageUpload } from "../(_ui)/regular-image-upload";


interface ChatbotDarkUploadProps {
    loading: boolean;
    onUploadSuccess: () => void;
}

/**
 * Комментарии: Компонент для загрузки иллюстрации AI чат-бота в тёмной теме
 * Отображается на странице чата перед началом диалога
 */
export function ChatbotDarkUpload({
    loading,
    onUploadSuccess,
}: ChatbotDarkUploadProps) {
    return (
        <RegularImageUpload
            label="Chatbot (Dark)"
            imageType="chatbot-dark"
            loading={loading}
            onUploadSuccess={onUploadSuccess}
        />
    );
}
