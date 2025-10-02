// @/app/@right/layout.tsx
import React from "react";

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
      {children}


      {/* {modal} */}

    </>
  );
}
