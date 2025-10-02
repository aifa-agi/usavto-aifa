// @/app/layout.tsx
// Comments in English:
// This is the final, correct version of the root layout.
// - It hardcodes the manifest path to "/manifest.webmanifest" to match the app/manifest.ts convention, fixing previous discrepancies.
// - It generates a comprehensive set of icons from appConfig, ensuring cross-platform compatibility.
// - It maintains the "single source of truth" principle, deriving all defaults from appConfig.

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


export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(appConfig.url),
    alternates: { canonical: "./" },
    title: {
      default: appConfig.name.trim(),
      template: `%s | ${appConfig.short_name.trim()}`,
    },
    description: appConfig.description,
    manifest: "/manifest.webmanifest",
    icons: [
      appConfig.icons?.faviconAny && {
        url: appConfig.icons.faviconAny,
        rel: "icon",
        sizes: "any",
      },
      appConfig.icons?.icon32 && {
        url: appConfig.icons.icon32,
        type: "image/png",
        sizes: "32x32",
      },
      appConfig.icons?.icon48 && {
        url: appConfig.icons.icon48,
        type: "image/png",
        sizes: "48x48",
      },
      appConfig.icons?.icon192 && {
        url: appConfig.icons.icon192,
        type: "image/png",
        sizes: "192x192",
      },
      appConfig.icons?.icon512 && {
        url: appConfig.icons.icon512,
        type: "image/png",
        sizes: "512x512",
      },
      appConfig.icons?.appleTouch && {
        url: appConfig.icons.appleTouch,
        rel: "apple-touch-icon",
      },
    ].filter(Boolean) as NonNullable<Metadata["icons"]>,
  };
}


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
                            <div className="relative flex flex-col h-screen">
                              <NavBar />
                              <main className="flex-1 overflow-y-auto hide-scrollbar">
                                {right}
                              </main>
                            </div>
                          </NavigationMenuProvider>
                          {/* --- END: CORRECTED BLOCK --- */}
                        </ResizablePanel>
                      </ResizablePanelGroup>
                    </div>


                    {/* === MOBILE LAYOUT === */}
                    <div className="w-full md:hidden relative">
                      {left}
                      <div className="border-l overflow-hidden border-secondary">
                        <RightDrawerBar>
                          <NavigationMenuProvider>
                            <div className="relative flex flex-col h-svh pb-6">
                              <NavBar />
                              <main className="flex-1 overflow-y-auto hide-scrollbar">
                                {right}
                              </main>
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
            <CookieBanner />
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

