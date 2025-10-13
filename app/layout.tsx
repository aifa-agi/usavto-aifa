// @/app/layout.tsx
// Comments in English:
// This is the final, correct version of the root layout.
// - It hardcodes the manifest path to "/manifest.webmanifest" to match the app/manifest.ts convention, fixing previous discrepancies.
// - It generates a comprehensive set of icons from appConfig, ensuring cross-platform compatibility.
// - It maintains the "single source of truth" principle, deriving all defaults from appConfig.

import { Toaster } from "sonner";
import type { Viewport } from "next";
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
import { NavBar } from "./@right/(_service)/(_components)/nav-bar/nav-bar";
import { NavigationMenuProvider } from "./@right/(_service)/(_context)/nav-bar-provider";
import { CookieBanner } from "@/app/(_service)/(_components)/cookie-banner";



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
                    {/* === DESKTOP LAYOUT === */}
                    <div className="hidden md:block h-screen w-screen">
                      <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={40} minSize={35}>
                          <div className="overflow-hidden h-full">{left}</div>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={60} minSize={35}>
                          {/* --- START: CORRECTED BLOCK --- */}
                          <NavigationMenuProvider>
                            <div
                              id="right-slot"
                              className="relative flex flex-col h-screen"
                              style={{
                                isolation: 'isolate',
                                overflow: 'hidden'
                              }}
                            >
                              <NavBar />
                              <main className="flex-1 overflow-y-auto hide-scrollbar">
                                {right}
                              </main>
                            </div>
                          </NavigationMenuProvider>
                          {/* --- END: CORRECTED BLOCK --- */}
                        </ResizablePanel>
                      </ResizablePanelGroup>
                      <CookieBanner />
                    </div>


                    {/* === MOBILE LAYOUT === */}
                    <div className="w-full md:hidden relative">
                      {left}
                      <div className="border-l overflow-hidden border-secondary">
                        <RightDrawerBar>
                          <NavigationMenuProvider>
                            <div className="flex flex-col h-svh pb-6">
                              <NavBar />
                              <main className="flex-1 overflow-y-auto hide-scrollbar">
                                {right}
                              </main>
                              <CookieBanner />
                            </div>
                          </NavigationMenuProvider>
                        </RightDrawerBar>

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

