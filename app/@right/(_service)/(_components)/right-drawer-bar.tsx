// @/app/@right/(_service)/(_components)/right-drawer-bar.tsx
"use client";

import React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { GlobeIcon, MessageIcon } from "@/components/shared/icons";
import { useRightSidebar } from "@/contexts/right-sidebar-context";
import { useRouter } from "next/navigation";

export default function RightDrawerBar({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, openDrawer, closeDrawer } = useRightSidebar();
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (open) {
      openDrawer();
    } else {
      // Close drawer and remove hash from URL
      closeDrawer();

      // Remove hash from URL to prevent auto-reopen
      if (window.location.hash) {
        const urlWithoutHash = window.location.pathname + window.location.search;
        router.replace(urlWithoutHash);
      }
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button
            aria-label="AIFA content"
            className="fixed top-3 right-4 z-50 flex items-center justify-center md:hidden h-[34px]"
          >
            <GlobeIcon size={16} />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-full p-0 md:hidden [&>[data-dialog-close]]:hidden [&>button]:hidden [&>button[aria-label='Close']]:block"
        >
          <SheetHeader>
            <SheetTitle className="hidden">
              Build something with [https://aifa.dev](https://aifa.dev)
            </SheetTitle>
          </SheetHeader>

          <SheetClose asChild>
            <Button
              size="sm"
              className="absolute top-3 right-2 h-[34px]"
              aria-label="Close"
            >
              <MessageIcon size={16} />
            </Button>
          </SheetClose>

          <div className="overflow-hidden h-screen">{children}</div>
        </SheetContent>
      </Sheet>

      {/* Desktop version remains unchanged */}
      <div className="hidden md:flex border-l border-gray-300 min-w-[200px] md:w-[480px] 2xl:w-[600px] h-screen overflow-y-auto">
        {children}
      </div>
    </>
  );
}
