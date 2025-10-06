// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_hooks)/use-logo-upload.ts

"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ImageUploadWithIconsResponse,
  ImageUploadStatus,
} from "../(_types)/image-upload-types";

/**
 * Comments in English: Format file size for user-friendly display
 * Converts bytes into human-readable format (B, KB, MB)
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UseLogoUploadReturn {
  uploading: boolean;
  handleFileSelect: (file: File) => Promise<void>;
}

/**
 * Comments in English: Custom hook for uploading logo with automatic icon generation
 * Handles file upload, progress tracking, and user feedback via toasts
 * 
 * Features:
 * - Sequential icon generation (prevents race conditions)
 * - Comprehensive error handling
 * - Detailed progress feedback
 * - Automatic config reload on success
 * 
 * @param onUploadSuccess - Callback function executed after successful upload
 * @returns Object with uploading state and file selection handler
 * 
 * @example
 * const { uploading, handleFileSelect } = useLogoUpload(reloadConfig);
 */
export function useLogoUpload(
  onUploadSuccess: () => void
): UseLogoUploadReturn {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (file: File): Promise<void> => {
    // Prevent multiple simultaneous uploads
    if (uploading) {
      console.warn("[useLogoUpload] Upload already in progress, ignoring request");
      return;
    }

    setUploading(true);

    const fileSize = formatFileSize(file.size);
    const startTime = Date.now();

    // Show initial loading toast with file info
    const toastId = toast.loading("Uploading logo and generating icons...", {
      description: `File: ${file.name} (${fileSize})`,
    });

    console.log("=== Client: Logo Upload Started ===", {
      fileName: file.name,
      fileSize: file.size,
      fileSizeFormatted: fileSize,
      fileType: file.type,
      timestamp: new Date().toISOString(),
    });

    try {
      // Prepare form data with logo file
      const formData = new FormData();
      formData.append("file", file);

      console.log("=== Client: Sending Request ===", {
        endpoint: "/api/app-config-upload-with-icons",
        method: "POST",
        formDataKeys: Array.from(formData.keys()),
      });

      // Send request to server
      const res = await fetch("/api/app-config-upload-with-icons", {
        method: "POST",
        body: formData,
      });

      console.log("=== Client: Response Received ===", {
        status: res.status,
        ok: res.ok,
        statusText: res.statusText,
      });

      const result: ImageUploadWithIconsResponse = await res.json();

      console.log("=== Client: Logo Upload Response ===", {
        status: res.status,
        ok: res.ok,
        resultStatus: result.status,
        environment: result.environment,
        result: result,
      });

      // Handle successful upload
      if (res.ok && result.status === ImageUploadStatus.SUCCESS) {
        const uploadTime = Date.now() - startTime;

        // Count generated icons
        const iconCount = result.generatedIcons
          ? Object.keys(result.generatedIcons).length
          : 0;

        // Build detailed success message
        const iconsList = result.generatedIcons
          ? Object.entries(result.generatedIcons)
              .map(([key, path]) => `${key}: ${path}`)
              .join("\n")
          : "No icons generated";

        const description =
          result.environment === "production"
            ? `✓ Logo saved: ${result.uploadedPath}\n✓ ${iconCount} icons generated\n✓ Synced to GitHub\n⏱ Time: ${uploadTime}ms`
            : `✓ Logo saved: ${result.uploadedPath}\n✓ ${iconCount} icons generated (favicon.ico in public root)\n⏱ Time: ${uploadTime}ms`;

        toast.success("Logo and icons generated successfully", {
          id: toastId,
          description: description,
          duration: 5000,
        });

        console.log("=== Client: Logo Upload Success ===", {
          environment: result.environment,
          uploadedPath: result.uploadedPath,
          logoFormat: result.format,
          generatedIcons: result.generatedIcons,
          iconCount: iconCount,
          uploadTime: uploadTime,
        });

        // Call success callback to reload config
        onUploadSuccess();
      } 
      // Handle partial success (saved locally but GitHub failed)
      else if (res.ok && result.status === ImageUploadStatus.PARTIAL_SUCCESS) {
        const uploadTime = Date.now() - startTime;
        const iconCount = result.generatedIcons
          ? Object.keys(result.generatedIcons).length
          : 0;

        toast.warning("Logo uploaded with warnings", {
          id: toastId,
          description: `✓ Logo and ${iconCount} icons saved locally\n⚠ GitHub sync failed: ${result.error || "Unknown error"}\n⏱ Time: ${uploadTime}ms`,
          duration: 6000,
        });

        console.warn("=== Client: Partial Success ===", {
          uploadedPath: result.uploadedPath,
          iconCount: iconCount,
          githubError: result.error,
        });

        // Still call success callback as local save succeeded
        onUploadSuccess();
      } 
      // Handle validation errors
      else if (result.status === ImageUploadStatus.VALIDATION_ERROR) {
        throw new Error(
          `Validation error: ${result.error || result.message || "Invalid file"}`
        );
      } 
      // Handle other errors
      else {
        throw new Error(
          result.error || result.message || "Upload failed with unknown error"
        );
      }
    } catch (error: any) {
      const uploadTime = Date.now() - startTime;

      console.error("=== Client: Logo Upload Error ===", {
        fileName: file.name,
        fileSize: file.size,
        error: error.message || error,
        stack: error.stack,
        uploadTime: uploadTime,
      });

      // Show detailed error toast
      toast.error("Failed to upload logo and generate icons", {
        id: toastId,
        description: error.message || "Unknown error occurred during upload",
        duration: 6000,
      });
    } finally {
      setUploading(false);

      console.log("=== Client: Logo Upload Finished ===", {
        fileName: file.name,
        totalTime: Date.now() - startTime,
      });
    }
  };

  return {
    uploading,
    handleFileSelect,
  };
}
