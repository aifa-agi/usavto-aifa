// @/app/(_service)/contexts/dialogs/hooks/use-dialog-state.ts

import { useState, useEffect } from "react";
import { DialogShowOptions, DialogState, DialogType, InputType, PageImages } from "../types";

export function useDialogState() {
  const [dialog, setDialog] = useState<DialogState>({ open: false });
  const [input, setInput] = useState("");

  useEffect(() => {
    if (dialog.open) {
      setInput(dialog.value ?? "");
    } else {
      setInput("");
    }
  }, [dialog.open, dialog.open ? dialog.value : undefined]);

  const show = (options: DialogShowOptions) => {
    setDialog({ 
      open: true, 
      inputType: "input",
      ...options 
    });
    setInput(options.value ?? "");
  };

  const close = () => setDialog({ open: false });

  const handleConfirm = (
    onConfirm?: (value?: string, keywords?: string[], images?: PageImages[]) => void,
    type?: DialogType,
    inputType?: InputType,
    value?: string,
    keywords?: string[],
    images?: PageImages[]
  ) => {
    if (onConfirm) {
      if (inputType === "keywords") {
        const cleanedKeywords = keywords?.filter(k => k.trim().length > 0) || [];
        onConfirm(undefined, cleanedKeywords);
      } else if (inputType === "images") {
        // ✅ ИСПРАВЛЕНО: AND вместо OR - оба поля должны быть заполнены
        const cleanedImages = images?.filter(img => {
          const hasAlt = img.alt?.trim() && img.alt.trim().length > 0;
          const hasHref = img.href?.trim() && img.href.trim().length > 0;
          return hasAlt && hasHref; // ✅ Оба поля обязательны
        }) || [];
        
        // ✅ ДОБАВЛЕНО: Логирование для отладки
        console.log("[use-dialog-state] All images:", images);
        console.log("[use-dialog-state] Cleaned images:", cleanedImages);
        
        onConfirm(undefined, undefined, cleanedImages);
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
    handleConfirm
  };
}
