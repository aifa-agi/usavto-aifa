// @/app/@right/default.tsx
//THIS IS ROOT PAGE, USING AS HOME PAGE, CAN NOT HAVE LAYOUT!
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/construct-metadata";
import HomePage from "../(_service)/(_components)/home-page/home-page";

export const metadata: Metadata = constructMetadata();

export default function Home() {
  return (

    <HomePage />

  );
}
