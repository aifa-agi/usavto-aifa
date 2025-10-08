// @/app/@right/(_service)/(_context)/dialogs/components/input-fields.tsx

"use client";

import React, { useState } from "react";
import { DialogState, PageImages } from "../types";
import { ImagesInput } from "./images-input";
import { KeywordsInput } from "./keywords-input";
import { KnowledgeBaseInput } from "./knowledge-base-input";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface InputFieldsProps {
  dialog: DialogState & { open: true };
  input: string;
  setInput: (value: string) => void;
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
  onConfirm: () => void;
  onInfoDoesNotExist?: () => void; // NEW: Callback for "Information Does Not Exist"
}

export function InputFields({
  dialog,
  input,
  setInput,
  keywords,
  images,
  onConfirm,
  onInfoDoesNotExist,
}: InputFieldsProps) {
  // NEW: Component for Knowledge Base input
  if (dialog.inputType === "knowledge-base" && dialog.knowledgeBase) {
    return (
      <KnowledgeBaseInput
        knowledgeType={dialog.knowledgeBase.knowledgeType}
        pageData={dialog.knowledgeBase.pageData}
        initialValue={dialog.knowledgeBase.initialValue}
        value={input}
        onChange={setInput}
        isLoading={dialog.confirmLoading ?? false}
        onInfoDoesNotExist={() => {
          if (onInfoDoesNotExist) {
            onInfoDoesNotExist();
          }
        }}
      />
    );
  }

  // Component for images
  if (dialog.inputType === "images") {
    return (
      <ImagesInput images={images} isLoading={dialog.confirmLoading ?? false} />
    );
  }

  // Component for keywords
  if (dialog.inputType === "keywords") {
    return (
      <KeywordsInput
        keywords={keywords}
        isLoading={dialog.confirmLoading ?? false}
      />
    );
  }

  // Common properties for regular input fields
  const commonProps = {
    autoFocus: true,
    value: input,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setInput(e.currentTarget.value),
    placeholder:
      dialog.placeholder ||
      (dialog.type === "create" ? "Enter new value..." : "Edit value..."),
    disabled: dialog.confirmLoading ?? false,
  };

  // Multiline textarea
  if (dialog.inputType === "textarea") {
    return (
      <Textarea
        {...commonProps}
        className="min-h-[100px] resize-none"
        onKeyDown={(e) => {
          // Save on Ctrl+Enter
          if (
            e.key === "Enter" &&
            e.ctrlKey &&
            input.trim() &&
            !(dialog.confirmLoading ?? false)
          ) {
            onConfirm();
          }
        }}
      />
    );
  }

  // Default single-line input
  return (
    <Input
      {...commonProps}
      onKeyDown={(e) => {
        // Save on Enter
        if (
          e.key === "Enter" &&
          input.trim() &&
          !(dialog.confirmLoading ?? false)
        ) {
          onConfirm();
        }
      }}
    />
  );
}
