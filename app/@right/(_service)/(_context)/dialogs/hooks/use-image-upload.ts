// @/app/(_service)/contexts/dialogs/hooks/use-image-upload.ts
// Comments in English: Upload images to filesystem (dev) or GitHub (production)

import { useState } from "react";
import { toast } from "sonner";

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file: File): Promise<string | null> => {
    // Validate file type - only images are allowed
    if (file.type.split("/")[0] !== "image") {
      toast.error("We only accept image files");
      return null;
    }

    // Validate file size - maximum 50MB
    if (file.size / 1024 / 1024 > 50) {
      toast.error("File size too big (max 50MB)");
      return null;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // Create FormData for direct upload
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress (since fetch doesn't provide real progress)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Upload to our custom API endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();

      // Set progress to 100% when complete
      setProgress(100);

      // ✅ УЛУЧШЕНО: Более детальные сообщения в зависимости от environment
      if (result.environment === "production") {
        toast.success("Image uploaded to GitHub successfully!", {
          description:
            "⚠️ Image will be visible after next deployment. Current users will see the previous image until redeployment completes.",
          duration: 7000,
        });
      } else {
        toast.success("Image uploaded to local filesystem!", {
          description: "✓ Image is immediately available in development mode.",
          duration: 4000,
        });
      }

      console.log("[useImageUpload] Upload successful:", {
        url: result.url,
        environment: result.environment,
        pathname: result.pathname,
        size: result.size,
      });

      return result.url;
    } catch (error) {
      console.error("[useImageUpload] Upload error:", error);

      if (error instanceof Error) {
        toast.error("Upload failed", {
          description: error.message,
          duration: 5000,
        });
      } else {
        toast.error("Upload failed", {
          description: "Unknown error occurred during upload",
          duration: 5000,
        });
      }
      return null;
    } finally {
      setIsUploading(false);
      // Keep progress at 100% for a moment before resetting
      setTimeout(() => {
        setProgress(0);
      }, 500);
    }
  };

  return {
    uploadImage,
    isUploading,
    progress,
  };
}
