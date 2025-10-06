// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_components)/error500-light-upload.tsx
"use client";

import { RegularImageUpload } from "../(_ui)/regular-image-upload";


interface Error500LightUploadProps {
    loading: boolean;
    onUploadSuccess: () => void;
}

/**
 * Комментарии: Компонент для загрузки иллюстрации страницы 500 в светлой теме
 * Отображается при внутренних ошибках сервера
 */
export function Error500LightUpload({
    loading,
    onUploadSuccess,
}: Error500LightUploadProps) {
    return (
        <RegularImageUpload
            label="Error 500 (Light)"
            imageType="error500-light"
            loading={loading}
            onUploadSuccess={onUploadSuccess}
        />
    );
}
