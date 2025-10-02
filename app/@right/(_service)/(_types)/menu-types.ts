// @/app/(_service)/types/menu-types.ts

import { PageData } from "./page-types";

export interface MenuCategory {
  title: string;      
  href?: string;      
  order?: number;
  pages?: PageData[];
}