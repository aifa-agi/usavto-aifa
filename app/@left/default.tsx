// @/app/@left/default.tsx
import { Button } from "@/components/ui/button";
import { appConfig, getChatbotIllustration } from "@/config/appConfig";
import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-static';
export const revalidate = false;

/**
 * Comments in English: Default page with theme-aware chatbot illustration
 * ✅ ИСПРАВЛЕНИЕ: Uses explicit validation to prevent empty src errors during builds
 */
export default function DefaultPage() {
  // Get illustration paths
  const darkPath = getChatbotIllustration("dark");
  const lightPath = getChatbotIllustration("light");

  // ✅ ИСПРАВЛЕНИЕ: Validate paths before rendering
  const darkSrc = darkPath && typeof darkPath === 'string' && darkPath.length > 0 ? darkPath : null;
  const lightSrc = lightPath && typeof lightPath === 'string' && lightPath.length > 0 ? lightPath : null;

  return (
    <div className="flex flex-col min-h-svh items-center justify-center p-6">
      {/* App title */}
      <p className="text-foreground text-6xl font-semibold whitespace-pre-wrap m-2 text-center">
        {appConfig.short_name}
      </p>

      {/* Chatbot illustrations (theme-aware) */}
      <div className="flex-1 flex items-center justify-center w-full">
        {/* Dark theme illustration */}
        {darkSrc && (
          <Image
            src={darkSrc}
            alt={appConfig.description}
            width={400}
            height={400}
            priority
            className="rounded-lg object-cover dark:block hidden"
          />
        )}

        {/* Light theme illustration */}
        {lightSrc && (
          <Image
            src={lightSrc}
            alt={appConfig.description}
            width={400}
            height={400}
            priority
            className="rounded-lg object-cover dark:hidden block"
          />
        )}
      </div>

      {/* CTA Button */}
      <Link href="/" className="text-xl w-full mt-auto mb-2">
        <Button className="w-full">{appConfig.chatBrand}</Button>
      </Link>
    </div>
  );
}
