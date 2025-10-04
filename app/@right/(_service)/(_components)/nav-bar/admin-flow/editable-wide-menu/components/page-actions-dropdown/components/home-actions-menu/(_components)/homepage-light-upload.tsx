// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_components)/homepage-light-upload.tsx

"use client";

import { ImageUploadItem } from "../(_ui)/image-upload-item";


interface HomePageLightUploadProps {
    loading: boolean;
    onUploadSuccess: () => void;
}

/**
 * Комментарии: Компонент для загрузки иллюстрации hero-секции главной страницы в светлой теме
 * Отображается на главной странице сайта в hero-блоке
 */
export function HomePageLightUpload({
    loading,
    onUploadSuccess,
}: HomePageLightUploadProps) {
    return (
        <ImageUploadItem
            label="Home Page (Light)"
            imageType="homePage-light"
            loading={loading}
            onUploadSuccess={onUploadSuccess}
        />
    );
}
