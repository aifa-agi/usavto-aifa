// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_components)/og-image-upload.tsx

"use client";


import { RegularImageUpload } from "../(_ui)/regular-image-upload";


interface OgImageUploadProps {
    loading: boolean;
    onUploadSuccess: () => void;
}

/**
 * Комментарии: Компонент для загрузки OG изображения
 * Используется для превью сайта в социальных сетях и мессенджерах
 * Рекомендуемый размер: 1200x630px
 */
export function OgImageUpload({ loading, onUploadSuccess }: OgImageUploadProps) {
    return (
        <RegularImageUpload
            label="Upload OG Image"
            imageType="ogImage"
            loading={loading}
            onUploadSuccess={onUploadSuccess}
        />
    );
}
