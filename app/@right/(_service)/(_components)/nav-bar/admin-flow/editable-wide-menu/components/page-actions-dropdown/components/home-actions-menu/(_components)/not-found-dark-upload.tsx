// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_components)/not-found-dark-upload.tsx
"use client";

import { ImageUploadItem } from "../(_ui)/image-upload-item";

interface NotFoundDarkUploadProps {
    loading: boolean;
    onUploadSuccess: () => void;
}

/**
 * Комментарии: Компонент для загрузки иллюстрации страницы 404 в тёмной теме
 * Отображается когда пользователь переходит на несуществующую страницу
 */
export function NotFoundDarkUpload({
    loading,
    onUploadSuccess,
}: NotFoundDarkUploadProps) {
    return (
        <ImageUploadItem
            label="Not Found (Dark)"
            imageType="notFound-dark"
            loading={loading}
            onUploadSuccess={onUploadSuccess}
        />
    );
}
