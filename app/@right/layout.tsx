// @/app/@right/layout.tsx
import React from "react";
import { NavigationMenuProvider } from "./(_service)/(_context)/nav-bar-provider";
import { NavBar } from "./(_service)/(_components)/nav-bar/nav-bar";

interface RightLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RightLayout({
  children,
  modal,
}: RightLayoutProps) {
  return (
    <>
      <NavigationMenuProvider>
        <div className="relative flex flex-col h-svh pb-6">
          <NavBar />

          <main className="flex-1 overflow-y-auto hide-scrollbar">
            {children}
          </main>

          {/* Модальное окно поверх всего правого слота */}
          {modal}
        </div>
      </NavigationMenuProvider>
    </>
  );
}
