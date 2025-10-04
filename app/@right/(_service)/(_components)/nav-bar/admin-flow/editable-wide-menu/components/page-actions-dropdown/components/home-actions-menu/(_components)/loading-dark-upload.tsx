// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_components)/loading-dark-upload.tsx
"use client";

import { ImageUploadItem } from "../(_ui)/image-upload-item";


interface LoadingDarkUploadProps {
    loading: boolean;
    onUploadSuccess: () => void;
}

/**
 * Комментарии: Компонент для загрузки иллюстрации экрана загрузки в тёмной теме
 * Отображается при первой загрузке приложения или переходах между страницами
 */
export function LoadingDarkUpload({
    loading,
    onUploadSuccess,
}: LoadingDarkUploadProps) {
    return (
        <ImageUploadItem
            label="Loading (Dark)"
            imageType="loading-dark"
            loading={loading}
            onUploadSuccess={onUploadSuccess}
        />
    );
}
