// @/app/(_service)/contexts/dialogs/components/image-preview.tsx

import React, { useState, useEffect, memo, useRef } from "react";
import { Image as ImageIcon, AlertCircle, Plus, Upload } from "lucide-react";
import { useImageUpload } from "../hooks/use-image-upload";
import { ProgressBar } from "./progress-bar";

interface ImagePreviewProps {
  href?: string;
  alt?: string;
  onImageUploaded?: (url: string) => void;
  disabled?: boolean;
}

// ✅ ДОБАВЛЕНО: Функция для получения GitHub Raw URL
function getGitHubRawUrl(relativePath: string): string | null {
  const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
  const GITHUB_BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH || "main";

  if (!GITHUB_REPO) {
    console.warn("[image-preview] NEXT_PUBLIC_GITHUB_REPO not configured");
    return null;
  }

  // Убираем leading slash если есть
  const cleanPath = relativePath.startsWith("/") ? relativePath.slice(1) : relativePath;

  return `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/public/${cleanPath}`;
}

export const ImagePreview = memo(({
  href,
  alt,
  onImageUploaded,
  disabled = false
}: ImagePreviewProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(href);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, isUploading, progress } = useImageUpload();

  // Reset image states when href changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setCurrentSrc(href);
    setFallbackAttempted(false);
  }, [href]);

  // Handle file selection and upload
  const handleFileChange = async (file: File) => {
    if (disabled || isUploading) return;

    const uploadedUrl = await uploadImage(file);
    if (uploadedUrl && onImageUploaded) {
      onImageUploaded(uploadedUrl);
    }
  };

  // Handle click to open file picker
  const handleClick = () => {
    if (!disabled && !isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ✅ ДОБАВЛЕНО: Обработка ошибки загрузки с fallback на GitHub
  const handleImageError = () => {
    console.log("[image-preview] Image load error for:", currentSrc);

    // Если ещё не пытались fallback и это относительный путь
    if (!fallbackAttempted && href && href.startsWith("/app-images/")) {
      const githubUrl = getGitHubRawUrl(href);

      if (githubUrl) {
        console.log("[image-preview] Attempting GitHub fallback:", githubUrl);
        setCurrentSrc(githubUrl);
        setFallbackAttempted(true);
        setImageError(false); // Сбрасываем ошибку для повторной попытки
        return;
      }
    }

    // Если fallback не сработал или уже был попытан
    console.error("[image-preview] All attempts failed for:", href);
    setImageError(true);
    setImageLoaded(false);
  };

  // Handle drag and drop functionality
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || isUploading) return;

    const file = e.dataTransfer?.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  // Empty state or loading state
  if (!href?.trim() || isUploading) {
    return (
      <div className="relative">
        <div
          className={`w-20 h-20 bg-muted rounded border-2 ${dragActive
              ? 'border-primary border-solid'
              : 'border-dashed border-muted-foreground/30'
            } flex items-center justify-center cursor-pointer transition-all hover:border-muted-foreground/50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isUploading ? (
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Plus className="w-4 h-4 text-muted-foreground/60 mb-1" />
              <Upload className="w-3 h-3 text-muted-foreground/60" />
            </div>
          )}
        </div>

        {isUploading && (
          <div className="absolute -bottom-8 left-0 right-0">
            <ProgressBar value={progress} />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            const file = event.currentTarget?.files?.[0];
            if (file) {
              handleFileChange(file);
            }
          }}
          disabled={disabled || isUploading}
        />
      </div>
    );
  }

  // State with existing image
  return (
    <div className="relative group">
      <div className="w-20 h-20 bg-muted rounded border-2 border-solid border-border overflow-hidden relative">
        {!imageError ? (
          <>
            <img
              src={currentSrc}
              alt={alt || "Preview"}
              className={`w-full h-full object-cover transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              onLoad={() => {
                console.log("[image-preview] Image loaded successfully:", currentSrc);
                setImageLoaded(true);
              }}
              onError={handleImageError}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* ✅ ДОБАВЛЕНО: Индикатор GitHub fallback */}
            {fallbackAttempted && imageLoaded && (
              <div className="absolute top-1 right-1 bg-blue-500 text-white text-[8px] px-1 py-0.5 rounded">
                GH
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-red-50">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
        )}

        {!disabled && (
          <div
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="text-white text-center">
              <Upload className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">Replace</span>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.currentTarget?.files?.[0];
          if (file) {
            handleFileChange(file);
          }
        }}
        disabled={disabled}
      />
    </div>
  );
});

ImagePreview.displayName = 'ImagePreview';
