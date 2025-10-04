// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_components)/homepage-dark-upload.tsx
"use client";

import { ImageUploadItem } from "../(_ui)/image-upload-item";


interface HomePageDarkUploadProps {
    loading: boolean;
    onUploadSuccess: () => void;
}

/**
 * Комментарии: Компонент для загрузки иллюстрации hero-секции главной страницы в тёмной теме
 * Отображается на главной странице сайта в hero-блоке
 */
export function HomePageDarkUpload({
    loading,
    onUploadSuccess,
}: HomePageDarkUploadProps) {
    return (
        <ImageUploadItem
            label="Home Page (Dark)"
            imageType="homePage-dark"
            loading={loading}
            onUploadSuccess={onUploadSuccess}
        />
    );
}
