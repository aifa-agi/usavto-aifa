// @/app/layout.tsx

import { Toaster } from "sonner";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import "./globals.scss";
import { SessionProvider } from "next-auth/react";
import RightDrawerBar from "./@right/(_service)/(_components)/right-drawer-bar";
import { OnlineStatusProvider } from "@/contexts/online-status-provider";
import { RightSidebarProvider } from "@/contexts/right-sidebar-context";
import { GoogleAnalytics } from "@next/third-parties/google";
import { LanguageProvider } from "@/contexts/language-context";
import { AppProvider } from "@/contexts/app-context";
import { DevIndicatorClient } from "@/lib/utils/dev-indicator-client";
import { appConfig } from "@/config/appConfig";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

export default async function RootLayout({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <html
      lang={appConfig.lang}
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <head />
      <body
        suppressHydrationWarning
        style={{ overscrollBehaviorX: "none" }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          <SessionProvider>
            <OnlineStatusProvider>
              <LanguageProvider>
                <RightSidebarProvider>
                  <AppProvider>
                    <div className="hidden md:block h-screen w-screen">
                      <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={40} minSize={35}>
                          <div className="overflow-hidden">{left}</div>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={60} minSize={35}>
                          <div className="relative overflow-hidden">{right}</div>
                        </ResizablePanel>
                      </ResizablePanelGroup>
                    </div>
                    <div className="w-full md:hidden relative">
                      {left}
                      <div className="border-l overflow-hidden border-secondary">
                        <RightDrawerBar>{right}</RightDrawerBar>
                      </div>
                    </div>
                    <DevIndicatorClient />
                  </AppProvider>
                </RightSidebarProvider>
              </LanguageProvider>
            </OnlineStatusProvider>
            {process.env.NODE_ENV === "production" && (
              <GoogleAnalytics
                gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!}
              />
            )}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
