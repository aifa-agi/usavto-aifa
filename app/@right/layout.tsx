// @/app/@right/layout.tsx
import { UserType } from "@prisma/client";
import React from "react";
import { auth } from "../@left/(_sub_domains)/(_AUTH)/(_service)/(_actions)/auth";

interface RightLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default async function RightLayout({
  children,
  modal,
}: RightLayoutProps) {
  const session = await auth();
  console.log("Right Layout session ", session)
  const allowed: UserType[] = [UserType.admin, UserType.architect];

  return (
    <>
      {children}


      {modal}

    </>
  );
}
