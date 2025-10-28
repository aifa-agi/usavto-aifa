// @/app/@right/(_PRIVAT_ROUTES)/admin/layout.tsx

import { auth } from "@/app/@left/(_sub_domains)/(_AUTH)/(_service)/(_actions)/auth";
import { redirect } from "next/navigation";
import { UserType } from "@prisma/client";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log("AdminLayout session ", session)
  const allowed: UserType[] = [UserType.admin, UserType.architect];
  console.log("AdminLayout allowed", allowed)
  // if (!session || !allowed.includes(session.user.type)) {
  //   redirect("/login");
  // }

  return <>{children}</>;
}
