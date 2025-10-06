// app/(_service)/components/nav-bar/admin-flow/page-actions-dropdown/components/home-actions-menu/components/chatbot-light-upload.tsx
// Комментарии на русском: Компонент для загрузки иллюстрации чат-бота (светлая тема)

"use client";


import { RegularImageUpload } from "../(_ui)/regular-image-upload";


interface ChatbotLightUploadProps {
    loading: boolean;
    onUploadSuccess: () => void;
}

/**
 * Комментарии: Компонент для загрузки иллюстрации AI чат-бота в светлой теме
 * Отображается на странице чата перед началом диалога
 */
export function ChatbotLightUpload({
    loading,
    onUploadSuccess,
}: ChatbotLightUploadProps) {
    return (
        <RegularImageUpload
            label="Chatbot (Light)"
            imageType="chatbot-light"
            loading={loading}
            onUploadSuccess={onUploadSuccess}
        />
    );
}
