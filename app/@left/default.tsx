

// @/app/@left/default.tsx


import { Button } from "@/components/ui/button";
import { appConfig } from "@/config/appConfig";
import Image from "next/image";
import Link from "next/link";

export default function LoadingPage() {
  return (
    <div className="flex flex-col min-h-svh items-center justify-center p-6">
      <p className="text-foreground text-6xl font-semibold whitespace-pre-wrap m-2 text-center">
        {appConfig.short_name}
      </p>
      <div className="flex-1 flex items-center justify-center w-full">
        <Image
          src={appConfig.startChatIllustration}
          alt={appConfig.description}
          width={400}
          height={400}
          priority
          className="rounded-lg object-cover"
        />
      </div>

      <Link href="/" className="text-xl w-full mt-auto mb-2">
        <Button className="w-full">{appConfig.short_name} Chat GPT</Button>
      </Link>
    </div>
  );
}
