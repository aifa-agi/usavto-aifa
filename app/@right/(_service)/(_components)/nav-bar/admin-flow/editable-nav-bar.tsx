// app/(_service)/components/nav-bar/admin-flow/editable-nav-bar.tsx
"use client";

import { AdminNavigationMenuProvider } from "../../../(_context)/admin-nav-bar-provider";
/**
 * EditableNavBar wrapped with AdminNavigationMenuProvider.
 * This ensures admin UI reads from /api/menu/read and persists via GitHub-aware route.
 */

import { ModalProvider } from "../../../(_context)/modal-context";
import EditableNavBarContent from "./editable-nav-bar-content";

export default function EditableNavBar() {
    return (
        <ModalProvider>
            <AdminNavigationMenuProvider>
                <EditableNavBarContent />
            </AdminNavigationMenuProvider>
        </ModalProvider>
    );
}
