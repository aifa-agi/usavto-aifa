// @/app/(_service)/components/nav-bar/admin-flow/editable-wide-menu/page-section/update-actions-dropdown/update-utils.ts


import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { UserType } from "@prisma/client";

/**
 * Colors for status indicators
 */
export const badgeIndicatorColors = {
  active: "bg-green-500",
  inactive: "bg-muted-foreground",
};

/**
 * Check if role is active for the page
 */
export function isRoleActive(page: PageData, role: UserType): boolean {
  return Boolean(page.roles?.includes(role));
}



/**
 * Get indicator color class based on active state
 */
export function getIndicatorColorClass(isActive: boolean): string {
  return isActive ? badgeIndicatorColors.active : badgeIndicatorColors.inactive;
}
