// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_hooks)/use-regular-image-upload.ts

"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { RegularImageType } from "@/config/appConfig";
import { 
  ImageUploadResponse, 
  ImageUploadStatus,
  ImageUploadErrorCode 
} from "../(_types)/image-upload-types";

/**
 * Comments in English: Format file size for display
 * Formats bytes into human-readable string (B, KB, MB)
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UseRegularImageUploadReturn {
  uploading: boolean;
  handleFileSelect: (file: File) => Promise<void>;
}

/**
 * Comments in English: Hook for uploading regular images (all types except logo)
 * Client only sends file and shows toasts, all environment logic is on server
 * 
 * @param imageType - Type of image to upload (from RegularImageType)
 * @param onUploadSuccess - Callback function called after successful upload
 * @returns Object with uploading state and handleFileSelect function
 * 
 * @example
 * const { uploading, handleFileSelect } = useRegularImageUpload("ogImage", reload);
 */
export function useRegularImageUpload(
  imageType: RegularImageType,
  onUploadSuccess: () => void
): UseRegularImageUploadReturn {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (file: File): Promise<void> => {
    if (uploading) return;

    setUploading(true);

    const fileSize = formatFileSize(file.size);

    // Comments in English: Show loading toast without destination info
    const toastId = toast.loading(`Uploading ${file.name}...`, {
      description: `Size: ${fileSize}`,
    });

    // Comments in English: Log only client-side information
    console.log("=== Client: Image Upload Started ===", {
      fileName: file.name,
      fileSize: file.size,
      fileSizeFormatted: fileSize,
      fileType: file.type,
      imageType: imageType,
      timestamp: new Date().toISOString(),
    });

    try {
      // Comments in English: Prepare FormData with file and imageType
      const formData = new FormData();
      formData.append("file", file);
      formData.append("imageType", imageType);

      console.log("=== Client: Sending Request ===", {
        endpoint: "/api/app-config-upload",
        method: "POST",
        imageType: imageType,
      });

      // Comments in English: Send request to server
      const res = await fetch("/api/app-config-upload", {
        method: "POST",
        body: formData,
      });

      const result: ImageUploadResponse = await res.json();

      // Comments in English: Log server response
      console.log("=== Client: Upload Response ===", {
        status: res.status,
        ok: res.ok,
        result: result,
      });

      // Comments in English: Handle successful response
      if (res.ok && result.status === ImageUploadStatus.SUCCESS) {
        // Comments in English: Build description based on server response
        const extension = result.fileExtension || result.format || "unknown";
        const description = result.environment === "production"
          ? `Saved as .${extension} to filesystem and GitHub: ${result.uploadedPath || ""}`
          : `Saved as .${extension} to local filesystem: ${result.uploadedPath || ""}`;

        toast.success(`${imageType} uploaded successfully`, {
          id: toastId,
          description: description,
        });

        console.log("=== Client: Upload Success ===", {
          imageType: imageType,
          environment: result.environment,
          uploadedPath: result.uploadedPath,
          fileExtension: result.fileExtension,
          format: result.format,
        });

        // Comments in English: Call success callback
        onUploadSuccess();
      } else {
        // Comments in English: Handle error from server
        throw new Error(result.error || result.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("=== Client: Upload Error ===", {
        imageType: imageType,
        fileName: file.name,
        error: error.message || error,
        stack: error.stack,
      });

      // Comments in English: Show error toast
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
