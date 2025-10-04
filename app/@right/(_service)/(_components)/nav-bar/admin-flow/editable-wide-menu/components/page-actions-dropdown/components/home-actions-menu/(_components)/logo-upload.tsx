// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_components)/logo-upload.tsx
"use client";

import { ImageUploadItem } from "../(_ui)/image-upload-item";


interface LogoUploadProps {
    loading: boolean;
    onUploadSuccess: () => void;
}

/**
 * Комментарии: Компонент для загрузки логотипа
 * При загрузке автоматически генерируются все иконки (favicon, PWA icons, apple-touch)
 */
export function LogoUpload({ loading, onUploadSuccess }: LogoUploadProps) {
    return (
        <ImageUploadItem
            label="Upload Logo (+ Icons)"
            imageType="logo"
            loading={loading}
            onUploadSuccess={onUploadSuccess}
        />
    );
}
