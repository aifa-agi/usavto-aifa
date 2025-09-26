"use client";

import React from "react";


import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UpdateActionsDropdownProps } from "../types";
import { useUpdateLogic } from "../hooks/use-update-logic";

/**
 * Dropdown menu content with all badge, role, and type management options
 */
export function UpdateDropdownContent({
  singlePage,
  categoryTitle,
  setCategories,
}: UpdateActionsDropdownProps) {
  const {
    handleRename,
    handleDelete,
  } = useUpdateLogic({
    singlePage,
    categoryTitle,
    setCategories,
  });

  return (
    <DropdownMenuContent align="end" className="min-w-[190px]">
      <DropdownMenuItem onClick={handleRename}>
        <span>Rename</span>
      </DropdownMenuItem>

      <DropdownMenuSeparator />


      <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
