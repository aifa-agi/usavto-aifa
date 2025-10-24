// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/badges-actions-dropdown/badges-dropdown-content.tsx


"use client";


import React from "react";
import { BadgesDropdownContentProps } from "../types";
import { RoleItemRow } from "./role-item-row";
import { BadgeItemRow } from "./badge-item-row";
import { TypeItemRow } from "./type-item-row"; // Изменений в этом импорте нет
import { isRoleActive, isBadgeActive } from "../badges-utils";
import { useBadgesLogic } from "../hooks/use-badges-logic";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ALL_BADGES } from "@/config/pages-config/badges/badge-config";
import { ALL_ROLES } from "@/app/@right/(_service)/(_config)/user-roles";
import { ALL_PAGE_TYPES } from "@/app/@right/(_service)/(_types)/page-types";


export function BadgesDropdownContent({
  singlePage,
  categoryTitle,
  setCategories,
}: BadgesDropdownContentProps) {
  const {
    handleToggleRole,
    handleToggleBadge,
    handlePageTypeChange,
  } = useBadgesLogic({
    singlePage,
    categoryTitle,
    setCategories,
  });


  return (
    <DropdownMenuContent align="end" className="min-w-[190px]">
      {/* <DropdownMenuLabel>Roles</DropdownMenuLabel>
      <div className="max-h-[100px] overflow-y-auto custom-scrollbar">
        <DropdownMenuGroup>
          {ALL_ROLES.map((role) => (
            <RoleItemRow
              key={role}
              role={role}
              isActive={isRoleActive(singlePage, role)}
              onToggle={() => handleToggleRole(role)}
            />
          ))}
        </DropdownMenuGroup>
      </div> */}


      <DropdownMenuSeparator />


      <DropdownMenuLabel>Badge</DropdownMenuLabel>
      <div className="max-h-[100px] overflow-y-auto custom-scrollbar">
        <DropdownMenuGroup>
          {ALL_BADGES.map((badge) => (
            <BadgeItemRow
              key={badge}
              badge={badge}
              isActive={isBadgeActive(singlePage, badge)}
              onToggle={() => handleToggleBadge(badge)}
            />
          ))}
        </DropdownMenuGroup>
      </div>


      {/* <DropdownMenuSeparator />
      {categoryTitle !== "home" && (
        <>
          <DropdownMenuLabel>Page Type</DropdownMenuLabel>
          <div className="max-h-[100px] overflow-y-auto custom-scrollbar">
            <DropdownMenuGroup>
              {ALL_PAGE_TYPES.map((pageType) => (
                <TypeItemRow
                  key={pageType}
                  pageType={pageType}
                  isActive={singlePage.type === pageType}
                  onToggle={() => handlePageTypeChange(pageType)}
                />
              ))}
            </DropdownMenuGroup>
          </div>
        </>
      )} */}
    </DropdownMenuContent>
  );
}
