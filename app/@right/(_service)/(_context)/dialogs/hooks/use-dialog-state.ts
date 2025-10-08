// @/app/@right/(_service)/(_context)/dialogs/hooks/use-dialog-state.ts

import { useState, useEffect } from "react";
import {
  DialogShowOptions,
  DialogState,
  DialogType,
  InputType,
  PageImages,
} from "../types";

export function useDialogState() {
  const [dialog, setDialog] = useState<DialogState>({ open: false });
  const [input, setInput] = useState("");

  useEffect(() => {
    if (dialog.open) {
      // NEW: Initialize input for Knowledge Base with existing value
      if (
        dialog.inputType === "knowledge-base" &&
        dialog.knowledgeBase?.initialValue
      ) {
        setInput(dialog.knowledgeBase.initialValue);
      } else {
        setInput(dialog.value ?? "");
      }
    } else {
      setInput("");
    }
  }, [dialog.open, dialog.open ? dialog.value : undefined]);

  const show = (options: DialogShowOptions) => {
    setDialog({
      open: true,
      inputType: "input",
      ...options,
    });

    // NEW: Initialize input value properly for Knowledge Base
    if (
      options.inputType === "knowledge-base" &&
      options.knowledgeBase?.initialValue
    ) {
      setInput(options.knowledgeBase.initialValue);
    } else {
      setInput(options.value ?? "");
    }
  };

  const close = () => setDialog({ open: false });

  const handleConfirm = (
    onConfirm?:
      | ((value?: string, keywords?: string[], images?: PageImages[]) => void)
      | undefined,
    type?: DialogType,
    inputType?: InputType,
    value?: string,
    keywords?: string[],
    images?: PageImages[]
  ) => {
    if (onConfirm) {
      if (inputType === "keywords") {
        const cleanedKeywords =
          keywords?.filter((k) => k.trim().length > 0) || [];
        onConfirm(undefined, cleanedKeywords);
      } else if (inputType === "images") {
        // Both fields must be filled (AND condition)
        const cleanedImages =
          images?.filter((img) => {
            const hasAlt = img.alt?.trim() && img.alt.trim().length > 0;
            const hasHref = img.href?.trim() && img.href.trim().length > 0;
            return hasAlt && hasHref; // Both fields required
          }) || [];

        // Debug logging
        console.log("[use-dialog-state] All images:", images);
        console.log("[use-dialog-state] Cleaned images:", cleanedImages);

        onConfirm(undefined, undefined, cleanedImages);
      } else if (inputType === "knowledge-base") {
        // NEW: Handle Knowledge Base confirmation
        const cleanedValue = value?.trim() || "";

        console.log(
          "[use-dialog-state] Knowledge Base value:",
          cleanedValue
        );

        onConfirm(cleanedValue);
      } else {
        const valueToSend = type === "delete" ? undefined : value?.trim();
        onConfirm(valueToSend);
      }
    }
    close();
    setInput("");
  };

  return {
    dialog,
    input,
    setInput,
    show,
    close,
    handleConfirm,
  };
}
