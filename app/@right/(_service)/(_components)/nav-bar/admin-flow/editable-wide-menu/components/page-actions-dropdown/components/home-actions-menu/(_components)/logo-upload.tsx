// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_components)/logo-upload.tsx

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
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { TinyDot } from "../(_ui)/tiny-dot";
import { appConfig } from "@/config/appConfig";
import { useLogoUpload } from "../(_hooks)/use-logo-upload";

interface LogoUploadProps {
    loading: boolean;
    onUploadSuccess: () => void;
}

export function LogoUpload({ loading, onUploadSuccess }: LogoUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploading, handleFileSelect } = useLogoUpload(onUploadSuccess);

    const [previewOpen, setPreviewOpen] = useState(false);

    // Comments in English: Cache-busting timestamp to force image reload
    // Updated whenever the preview dialog opens or after successful upload
    const [cacheBuster, setCacheBuster] = useState<number>(Date.now());

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

    if (loading) {
        return (
            <DropdownMenuItem className="flex items-center cursor-default opacity-70">
                <TinyDot colorClass="bg-muted-foreground/40" />
                <span className="flex-1">Logo (+ icons)</span>
            </DropdownMenuItem>
        );
    }

    return (
        <>
            <DropdownMenuItem
                className="flex items-center cursor-pointer"
                disabled={uploading}
                onSelect={(e) => e.preventDefault()}
            >
                <TinyDot colorClass={uploading ? "bg-yellow-500" : "bg-blue-500"} />
                <span className="flex-1">Logo (+ icons)</span>

                <button
                    onClick={handlePreviewClick}
                    className="p-1 hover:bg-accent rounded-sm mr-1"
                    title="Preview logo and icons"
                    type="button"
                >
                    <Eye className="w-3 h-3" />
                </button>

                <button
                    onClick={handleClick}
                    className="p-1 hover:bg-accent rounded-sm"
                    title="Upload new logo"
                    type="button"
                >
                    <Upload className="w-3 h-3" />
                </button>
            </DropdownMenuItem>

            <input
                key="logo-file-input"
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                className="hidden"
                style={{ display: "none" }}
            />

            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Logo & Icons Preview</DialogTitle>
                        <DialogDescription>
                            Current logo and all generated icons
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="max-h-[70vh] pr-4">
                        <div className="space-y-6">
                            {/* Main Logo with Cache Busting */}
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Main Logo</h3>
                                <div className="relative w-full aspect-square max-w-md mx-auto bg-muted rounded-lg overflow-hidden flex items-center justify-center border-2 border-border">
                                    {/* ✅ ИСПРАВЛЕНИЕ: Добавлен cache-busting параметр */}
                                    <Image
                                        src={`${appConfig.logo}?t=${cacheBuster}`}
                                        alt="Logo"
                                        fill
                                        className="object-contain p-8"
                                        unoptimized={true}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2 text-center">
                                    <code className="bg-muted px-1 py-0.5 rounded">
                                        {appConfig.logo}
                                    </code>
                                </p>
                            </div>

                            {/* Generated Icons Grid */}
                            <div>
                                <h3 className="text-sm font-semibold mb-3">Generated Icons</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {/* Favicon - use native img tag for .ico */}
                                    {appConfig.icons.faviconAny && (
                                        <IconPreviewCard
                                            path={appConfig.icons.faviconAny}
                                            label="Favicon"
                                            size="32x32"
                                            isIco={true}
                                            cacheBuster={cacheBuster}
                                        />
                                    )}

                                    {/* Icon 32 */}
                                    {appConfig.icons.icon32 && (
                                        <IconPreviewCard
                                            path={appConfig.icons.icon32}
                                            label="Icon 32"
                                            size="32x32"
                                            cacheBuster={cacheBuster}
                                        />
                                    )}

                                    {/* Icon 48 */}
                                    {appConfig.icons.icon48 && (
                                        <IconPreviewCard
                                            path={appConfig.icons.icon48}
                                            label="Icon 48"
                                            size="48x48"
                                            cacheBuster={cacheBuster}
                                        />
                                    )}

                                    {/* Android Chrome 192 */}
                                    {appConfig.icons.icon192 && (
                                        <IconPreviewCard
                                            path={appConfig.icons.icon192}
                                            label="Android 192"
                                            size="192x192"
                                            cacheBuster={cacheBuster}
                                        />
                                    )}

                                    {/* Android Chrome 512 */}
                                    {appConfig.icons.icon512 && (
                                        <IconPreviewCard
                                            path={appConfig.icons.icon512}
                                            label="Android 512"
                                            size="512x512"
                                            cacheBuster={cacheBuster}
                                        />
                                    )}

                                    {/* Apple Touch Icon */}
                                    {appConfig.icons.appleTouch && (
                                        <IconPreviewCard
                                            path={appConfig.icons.appleTouch}
                                            label="Apple Touch"
                                            size="180x180"
                                            cacheBuster={cacheBuster}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
}

/**
 * Comments in English: Individual icon preview card component
 * Uses native img tag for .ico files, Next.js Image for others
 * Now includes cache-busting parameter for all images
 */
interface IconPreviewCardProps {
    path: string;
    label: string;
    size: string;
    isIco?: boolean;
    cacheBuster: number;
}

function IconPreviewCard({
    path,
    label,
    size,
    isIco = false,
    cacheBuster,
}: IconPreviewCardProps) {
    // Comments in English: Add cache-busting parameter to image URL
    const imageUrl = `${path}?t=${cacheBuster}`;

    return (
        <div className="space-y-2">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center border border-border">
                {/* ✅ ИСПРАВЛЕНИЕ: Добавлен cache-busting для всех иконок */}
                {isIco ? (
                    <img
                        src={imageUrl}
                        alt={label}
                        className="w-full h-full object-contain p-2"
                    />
                ) : (
                    <Image
                        src={imageUrl}
                        alt={label}
                        fill
                        className="object-contain p-2"
                        unoptimized={true}
                    />
                )}
            </div>
            <div className="text-center">
                <p className="text-xs font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{size}</p>
                <code className="text-[10px] bg-muted px-1 py-0.5 rounded block truncate mt-1">
                    {path}
                </code>
            </div>
        </div>
    );
}
