// @/aapp/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_ui)
import { cn } from "@/lib/utils";


interface TinyDotProps {
  colorClass: string;
}

export function TinyDot({ colorClass }: TinyDotProps) {
  return (
    <span
      className={cn("inline-block rounded-full mr-3", colorClass)}
      style={{ width: "4px", height: "4px", minWidth: "4px", minHeight: "4px" }}
    />
  );
}
