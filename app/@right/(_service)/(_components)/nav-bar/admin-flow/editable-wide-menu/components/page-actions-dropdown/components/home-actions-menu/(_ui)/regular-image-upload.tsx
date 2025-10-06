// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_ui)/regular-image-upload.tsx

"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, Eye } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { TinyDot } from "./tiny-dot";
import type { RegularImageType } from "@/config/appConfig";
import { appConfig } from "@/config/appConfig";
import { useRegularImageUpload } from "../(_hooks)/use-regular-image-upload";

interface RegularImageUploadProps {
    label: string;
    imageType: RegularImageType;
    loading: boolean;
    onUploadSuccess: () => void;
}

export function RegularImageUpload({
    label,
    imageType,
    loading,
    onUploadSuccess,
}: RegularImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploading, handleFileSelect } = useRegularImageUpload(
        imageType,
        onUploadSuccess
    );

    const [previewOpen, setPreviewOpen] = useState(false);

    // Comments in English: Cache-busting timestamp to force image reload
    // Updated when preview opens or after successful upload
    const [cacheBuster, setCacheBuster] = useState<number>(Date.now());

    // Comments in English: Get current image data from appConfig
    const currentImagePath =
        appConfig.images[imageType]?.path ||
        `/app-config-images/${imageType}.svg`;
    const currentImageFormat = appConfig.images[imageType]?.format || "svg";
    const isSvg = currentImagePath.toLowerCase().endsWith(".svg");

    // Comments in English: Update cache buster when preview opens
    // This ensures we always show the latest uploaded image
    useEffect(() => {
        if (previewOpen) {
            setCacheBuster(Date.now());
        }
    }, [previewOpen]);

    const handleClick = (e: React.MouseEvent) => {
        if (uploading || loading) return;
        e.preventDefault();
        e.stopPropagation();
        setTimeout(() => {
            fileInputRef.current?.click();
        }, 0);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        await handleFileSelect(file);

        // Comments in English: Update cache buster after successful upload
        // This forces the preview to reload with the new image
        setCacheBuster(Date.now());

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handlePreviewClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setPreviewOpen(true);
    };

    const acceptedFormats =
        imageType === "ogImage"
            ? "image/png,image/jpeg,image/jpg,image/webp"
            : "image/svg+xml,image/png,image/webp";

    if (loading) {
        return (
            <DropdownMenuItem className="flex items-center cursor-default opacity-70">
                <TinyDot colorClass="bg-muted-foreground/40" />
                <span className="flex-1">{label}</span>
            </DropdownMenuItem>
        );
    }

    // Comments in English: Build image URL with cache-busting parameter
    const imageUrlWithCacheBuster = `${currentImagePath}?t=${cacheBuster}`;

    return (
        <>
            <DropdownMenuItem
                className="flex items-center cursor-pointer"
                disabled={uploading}
                onSelect={(e) => e.preventDefault()}
            >
                <TinyDot colorClass={uploading ? "bg-yellow-500" : "bg-blue-500"} />
                <span className="flex-1">{label}</span>

                <button
                    onClick={handlePreviewClick}
                    className="p-1 hover:bg-accent rounded-sm mr-1"
                    title="Preview current image"
                    type="button"
                >
                    <Eye className="w-3 h-3" />
                </button>

                <button
                    onClick={handleClick}
                    className="p-1 hover:bg-accent rounded-sm"
                    title="Upload new image"
                    type="button"
                >
                    <Upload className="w-3 h-3" />
                </button>
            </DropdownMenuItem>

            <input
                key={`${imageType}-file-input`}
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats}
                onChange={handleFileChange}
                className="hidden"
                style={{ display: "none" }}
            />

            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{label} Preview</DialogTitle>
                        <DialogDescription>
                            Current image: {currentImageFormat.toUpperCase()} format
                        </DialogDescription>
                    </DialogHeader>

                    <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                        {/* ✅ ИСПРАВЛЕНИЕ: Добавлен cache-busting для всех изображений */}
                        {isSvg ? (
                            <img
                                src={imageUrlWithCacheBuster}
                                alt={label}
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : (
                            <Image
                                src={imageUrlWithCacheBuster}
                                alt={label}
                                fill
                                className="object-contain"
                                unoptimized={true}
                            />
                        )}
                    </div>

                    <div className="text-sm text-muted-foreground">
                        <p>
                            Path:{" "}
                            <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                {currentImagePath}
                            </code>
                        </p>
                        <p>
                            Format:{" "}
                            <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                {currentImageFormat}
                            </code>
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
