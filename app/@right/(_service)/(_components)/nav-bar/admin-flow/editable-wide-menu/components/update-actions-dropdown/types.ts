import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

/**
 * Props for the main update actions dropdown component.
 */
export interface UpdateActionsDropdownProps {
  singlePage: PageData;
  categoryTitle: string;
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
}

/**
 * Props for the update trigger button.
 */
export interface UpdateTriggerButtonProps {
  // No special state needed - always active for admin functions
}

/**
 * Props for the update dropdown content.
 */
export interface UpdateDropdownContentProps {
  singlePage: PageData;
  categoryTitle: string;
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
}
