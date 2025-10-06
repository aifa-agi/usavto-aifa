// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_components)/error500-dark-upload.tsx
"use client";


import { RegularImageUpload } from "../(_ui)/regular-image-upload";


interface Error500DarkUploadProps {
    loading: boolean;
    onUploadSuccess: () => void;
}

/**
 * Комментарии: Компонент для загрузки иллюстрации страницы 500 в тёмной теме
 * Отображается при внутренних ошибках сервера
 */
export function Error500DarkUpload({
    loading,
    onUploadSuccess,
}: Error500DarkUploadProps) {
    return (
        <RegularImageUpload
            label="Error 500 (Dark)"
            imageType="error500-dark"
            loading={loading}
            onUploadSuccess={onUploadSuccess}
        />
    );
}
