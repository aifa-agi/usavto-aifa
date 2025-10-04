// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_hooks)/use-image-upload.ts
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ImageType } from "../(_types)/image-upload-types";

/**
 * Комментарии: Определяет окружение (development или production)
 */
function getEnvironment(): "development" | "production" {
  return process.env.NODE_ENV === "production" ? "production" : "development";
}

/**
 * Комментарии: Определяет endpoint для загрузки в зависимости от типа изображения
 */
function getUploadEndpoint(imageType: ImageType): string {
  return imageType === "logo"
    ? "/api/app-config-upload-with-icons"
    : "/api/app-config-upload";
}

/**
 * Комментарии: Форматирует размер файла для отображения
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UseImageUploadReturn {
  uploading: boolean;
  handleFileSelect: (file: File) => Promise<void>;
}

/**
 * Комментарии: Хук для управления процессом загрузки изображения
 * @param imageType - Тип загружаемого изображения
 * @param onUploadSuccess - Коллбэк при успешной загрузке
 */
export function useImageUpload(
  imageType: ImageType,
  onUploadSuccess: () => void
): UseImageUploadReturn {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (file: File): Promise<void> => {
    if (uploading) return;

    setUploading(true);

    const environment = getEnvironment();
    const endpoint = getUploadEndpoint(imageType);
    const fileSize = formatFileSize(file.size);

    // Комментарии: Показываем toast с loader и информацией о загрузке
    const uploadDestination =
      environment === "production"
        ? "filesystem + GitHub"
        : "filesystem (local)";

    const toastId = toast.loading(`Uploading ${file.name}...`, {
      description: `Size: ${fileSize} | Destination: ${uploadDestination}`,
    });

    // Комментарии: Логируем начало загрузки
    console.log("=== Image Upload Started ===", {
      fileName: file.name,
      fileSize: file.size,
      fileSizeFormatted: fileSize,
      fileType: file.type,
      imageType: imageType,
      endpoint: endpoint,
      environment: environment,
      destination: uploadDestination,
      timestamp: new Date().toISOString(),
    });

    try {
      // Комментарии: Подготавливаем FormData с файлом и типом изображения
      const formData = new FormData();
      formData.append("file", file);
      formData.append("imageType", imageType);

      console.log("=== Sending Request ===", {
        endpoint: endpoint,
        method: "POST",
      });

      // Комментарии: Отправляем запрос на сервер
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      // Комментарии: Логируем ответ сервера
      console.log("=== Upload Response ===", {
        status: res.status,
        ok: res.ok,
        result: result,
      });

      // Комментарии: Обновляем toast в зависимости от результата
      if (res.ok && result.status === "SUCCESS") {
        const successMessage =
          imageType === "logo"
            ? "Logo and icons generated successfully"
            : `${imageType} uploaded successfully`;

        toast.success(successMessage, {
          id: toastId,
          description: result.uploadedPath
            ? `Saved to: ${result.uploadedPath}`
            : undefined,
        });

        console.log("=== Upload Success ===", {
          imageType: imageType,
          uploadedPath: result.uploadedPath,
          generatedIcons: result.generatedIcons,
        });

        // Комментарии: Вызываем коллбэк успешной загрузки
        onUploadSuccess();
      } else {
        throw new Error(result.error || result.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("=== Upload Error ===", {
        imageType: imageType,
        fileName: file.name,
        error: error.message || error,
        stack: error.stack,
      });

      toast.error("Failed to upload image", {
        id: toastId,
        description: error.message || "Unknown error occurred",
      });
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    handleFileSelect,
  };
}
