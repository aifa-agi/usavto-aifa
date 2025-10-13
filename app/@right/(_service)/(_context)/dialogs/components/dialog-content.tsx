// @/app/@right/(_service)/(_context)/dialogs/components/dialog-content.tsx

"use client";

import React, { useEffect, useState } from "react";
import { DialogState, DialogType, InputType, PageImages } from "../types";
import { InputFields } from "./input-fields";
import {
  DialogContent as ShadcnDialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Dialog,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogContentProps {
  dialog: DialogState;
  input: string;
  setInput: (value: string) => void;
  onClose: () => void;
  onConfirm: (
    onConfirm?: (
      value?: string,
      keywords?: string[],
      images?: PageImages[]
    ) => void,
    type?: DialogType,
    inputType?: InputType,
    value?: string,
    keywords?: string[],
    images?: PageImages[]
  ) => void;
  keywords: {
    keywordsList: string[];
    handleAddKeyword: () => void;
    handleRemoveKeyword: (index: number) => void;
    handleKeywordChange: (index: number, value: string) => void;
  };
  images: {
    imagesList: PageImages[];
    validationError: string;
    handleAddImage: () => void;
    handleRemoveImage: (index: number) => void;
    handleImageChange: (
      index: number,
      field: "alt" | "href",
      value: string
    ) => void;
  };
}

export function DialogContent({
  dialog,
  input,
  setInput,
  onClose,
  onConfirm,
  keywords,
  images,
}: DialogContentProps) {
  // State for the container element
  const [container, setContainer] = useState<HTMLElement | null>(null);

  // Get the right-slot container on mount
  useEffect(() => {
    const el = document.getElementById("right-slot");
    if (el) {
      setContainer(el);
    }
  }, []);

  if (!dialog.open) return null;

  // Handle "Information Does Not Exist" button click
  const handleInfoDoesNotExist = () => {
    setInput("Information does not exist");
  };

  const handleConfirm = () => {
    let validImages = images.imagesList;

    if (dialog.inputType === "images") {
      validImages = images.imagesList.filter((image) => {
        // Check if both fields exist and are not empty
        const hasAlt = image.alt && image.alt.trim().length > 0;
        const hasHref = image.href && image.href.trim().length > 0;

        // Both fields must be filled
        return hasAlt && hasHref;
      });

      console.log("[dialog-content] All images:", images.imagesList);
      console.log("[dialog-content] Valid images:", validImages);
    }

    onConfirm(
      dialog.onConfirm,
      dialog.type,
      dialog.inputType,
      input,
      keywords.keywordsList,
      validImages // Pass only valid images
    );
  };

  const isFormValid = () => {
    if (dialog.type === "delete") return true;

    if (dialog.inputType === "keywords") {
      return keywords.keywordsList.some((keyword) => keyword.trim().length > 0);
    }

    if (dialog.inputType === "images") {
      // Check that at least one image is completely filled
      return images.imagesList.some(
        (image) => image.alt?.trim() && image.href?.trim()
      );
    }

    // Knowledge Base validation - input must have content
    if (dialog.inputType === "knowledge-base") {
      return input.trim().length > 0;
    }

    return input.trim().length > 0;
  };

  // Determine dialog width based on input type
  const getDialogWidth = () => {
    if (dialog.inputType === "images") return "sm:max-w-[600px]";
    if (dialog.inputType === "knowledge-base") return "sm:max-w-[600px]";
    return "sm:max-w-[425px]";
  };

  // Determine if we should show "Information Does Not Exist" button
  const showInfoButton =
    dialog.inputType === "knowledge-base" &&
    dialog.knowledgeBase?.showInfoButton !== false;

  return (
    <Dialog open onOpenChange={onClose}>
      <ShadcnDialogContent
        container={container}
        onInteractOutside={(e) => {
          e.preventDefault(); // Предотвращает закрытие при клике снаружи
        }}
        className={`${getDialogWidth()} ${dialog.type === "delete" ? "border-2 border-red-600" : ""
          }`}
      >
        <DialogHeader>
          <DialogTitle>{dialog.title}</DialogTitle>
          {dialog.description && (
            <DialogDescription>{dialog.description}</DialogDescription>
          )}
        </DialogHeader>

        {dialog.type !== "delete" && (
          <div
            className={`grid gap-4 py-2 ${dialog.inputType === "knowledge-base"
                ? "max-h-[500px] overflow-y-auto custom-scrollbar"
                : ""
              }`}
          >
            <InputFields
              dialog={dialog}
              input={input}
              setInput={setInput}
              keywords={keywords}
              images={images}
              onConfirm={handleConfirm}
              onInfoDoesNotExist={handleInfoDoesNotExist}
            />
            {dialog.inputType === "textarea" && (
              <p className="text-xs text-muted-foreground">
                Press Ctrl+Enter to save
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          {/* "Information Does Not Exist" button for Knowledge Base */}
          {showInfoButton && (
            <Button
              type="button"
              variant="ghost"
              disabled={dialog.confirmLoading}
              onClick={handleInfoDoesNotExist}
              className="mr-auto"
            >
              Information Does Not Exist
            </Button>
          )}

          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={dialog.confirmLoading}
              onClick={dialog.onCancel || onClose}
            >
              {dialog.cancelLabel || "Cancel"}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={dialog.type === "delete" ? "destructive" : "default"}
            disabled={dialog.confirmLoading || !isFormValid()}
            onClick={handleConfirm}
          >
            {dialog.confirmLabel ||
              (dialog.type === "delete"
                ? "Delete"
                : dialog.type === "edit"
                  ? "Save changes"
                  : "Create")}
          </Button>
        </DialogFooter>
      </ShadcnDialogContent>
    </Dialog>
  );
}
