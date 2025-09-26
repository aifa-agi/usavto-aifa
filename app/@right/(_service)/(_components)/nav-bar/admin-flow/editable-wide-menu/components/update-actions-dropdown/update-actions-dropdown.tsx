// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/badges-actions-dropdown/components/badges-actions-dropdown.tsx

"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpdateActionsDropdownProps } from "./types";
import { UpdateTriggerButton } from "./components/update-trigger-button";
import { UpdateDropdownContent } from "./components/update-dropdown-content";



export function UpdateActionsDropdown({
  singlePage,
  categoryTitle,
  setCategories,
}: UpdateActionsDropdownProps) {
  // Hide dropdown if category is "home"
  if (categoryTitle.toLowerCase() === "home") {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UpdateTriggerButton />
      </DropdownMenuTrigger>

      <UpdateDropdownContent
        singlePage={singlePage}
        categoryTitle={categoryTitle}
        setCategories={setCategories}
      />
    </DropdownMenu>
  );
}
