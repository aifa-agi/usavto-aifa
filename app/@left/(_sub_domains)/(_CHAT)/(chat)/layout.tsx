// @/app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/layout.tsx

import { AppSidebar } from "@/app/@left/(_sub_domains)/(_CHAT)/(chat)/(_service)/(_components)/app-sidebar";
import { validateTranslations } from "./(_service)/(_libs)/validate-translations";
import { RoleStatus } from "./(_service)/(_components)/role-status";
import { auth } from "@/app/@left/(_sub_domains)/(_AUTH)/(_service)/(_actions)/auth";
import {
  SidebarInset,
  SidebarProvider,
} from "./(_service)/(_components)/sidebar";



export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Validate translations
  validateTranslations();

  // Get user session
  const session = await auth();

  return (
    <>


      {/* Sidebar - always open by default */}
      <SidebarProvider defaultOpen={false}>
        <AppSidebar user={session?.user} />
        <SidebarInset>
          {children}
          <RoleStatus />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
