// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_components)/not-found-light-upload.tsx
"use client";


import { RegularImageUpload } from "../(_ui)/regular-image-upload";


interface NotFoundLightUploadProps {
    loading: boolean;
    onUploadSuccess: () => void;
}

/**
 * Комментарии: Компонент для загрузки иллюстрации страницы 404 в светлой теме
 * Отображается когда пользователь переходит на несуществующую страницу
 */
export function NotFoundLightUpload({
    loading,
    onUploadSuccess,
}: NotFoundLightUploadProps) {
    return (
        <RegularImageUpload
            label="Not Found (Light)"
            imageType="notFound-light"
            loading={loading}
            onUploadSuccess={onUploadSuccess}
        />
    );
}
