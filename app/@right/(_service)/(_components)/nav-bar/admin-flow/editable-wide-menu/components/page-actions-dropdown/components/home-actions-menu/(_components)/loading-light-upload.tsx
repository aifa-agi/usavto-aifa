// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_components)/loading-light-upload.tsx
"use client";

import { RegularImageUpload } from "../(_ui)/regular-image-upload";


interface LoadingLightUploadProps {
    loading: boolean;
    onUploadSuccess: () => void;
}

/**
 * Комментарии: Компонент для загрузки иллюстрации экрана загрузки в светлой теме
 * Отображается при первой загрузке приложения или переходах между страницами
 */
export function LoadingLightUpload({
    loading,
    onUploadSuccess,
}: LoadingLightUploadProps) {
    return (
        <RegularImageUpload
            label="Loading (Light)"
            imageType="loading-light"
            loading={loading}
            onUploadSuccess={onUploadSuccess}
        />
    );
}
