"use client";

import React, { forwardRef } from "react";
import { Pencil } from "lucide-react";
// Используем корректный тип для пропсов кнопки
import { UpdateTriggerButtonProps } from "../types";
import { cn } from "@/lib/utils";

export const UpdateTriggerButton = forwardRef<
  HTMLButtonElement,
  // Заменяем UpdateActionsDropdownProps на UpdateTriggerButtonProps
  UpdateTriggerButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded transition hover:bg-accent/60",
        className
      )}
      tabIndex={-1}
      {...props}
    >
      <Pencil className="w-4 h-4 text-primary/80" />
    </button>
  );
});

// Исправлена опечатка в displayName
UpdateTriggerButton.displayName = "UpdateTriggerButton";
