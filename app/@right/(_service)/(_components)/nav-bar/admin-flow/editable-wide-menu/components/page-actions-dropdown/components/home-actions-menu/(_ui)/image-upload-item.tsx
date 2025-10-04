// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_ui)/image-upload-item.tsx

"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TinyDot } from "./tiny-dot";
import { ImageType } from "../(_types)/image-upload-types";
import { useImageUpload } from "../(_hooks)/use-image-upload";

interface ImageUploadItemProps {
    label: string;
    imageType: ImageType
    loading: boolean;
    onUploadSuccess: () => void;
}

/**
 * Комментарии: Компонент для загрузки изображения через file picker
 * При клике открывает диалог выбора файла, затем загружает на сервер
 */
export function ImageUploadItem({
    label,
    imageType,
    loading,
    onUploadSuccess,
}: ImageUploadItemProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploading, handleFileSelect } = useImageUpload(
        imageType,
        onUploadSuccess
    );

    // Комментарии: Открываем диалог выбора файла при клике на элемент меню
    const handleClick = () => {
        if (uploading) return;
        fileInputRef.current?.click();
    };

    // Комментарии: Обрабатываем выбранный файл
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        await handleFileSelect(file);

        // Комментарии: Сбрасываем input для возможности загрузить тот же файл повторно
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Комментарии: Определяем допустимые форматы файлов в зависимости от типа изображения
    const acceptedFormats =
        imageType === "logo" || imageType === "ogImage"
            ? "image/png,image/jpeg,image/jpg"
            : "image/svg+xml,image/png";

    // Комментарии: Состояние загрузки конфигурации - некликабельно
    if (loading) {
        return (
            <DropdownMenuItem className="flex items-center cursor-default opacity-70">
                <TinyDot colorClass="bg-muted-foreground/40" />
                <span className="flex-1">{label}</span>
            </DropdownMenuItem>
        );
    }

    return (
        <>
            <DropdownMenuItem
                onClick={handleClick}
                className="flex items-center cursor-pointer"
                disabled={uploading}
            >
                <TinyDot colorClass={uploading ? "bg-yellow-500" : "bg-blue-500"} />
                <span className="flex-1">{label}</span>
                <Upload className="w-3 h-3 ml-2" />
            </DropdownMenuItem>

            {/* Комментарии: Скрытый input для выбора файла */}
            <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats}
                onChange={handleFileChange}
                className="hidden"
            />
        </>
    );
}
