// @/app/@left/loading.tsx
import Image from "next/image";

// Принуждение к статической генерации (опционально)
export const dynamic = 'force-static';
export const revalidate = false;

export default function LoadingPage() {
  // Используем статически только темную иллюстрацию
  const currentIllustration = "/_static/illustrations/idea-launch.svg";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {/* Иллюстрация - только темная версия */}
      <Image
        src={currentIllustration}
        alt="Иллюстрация рабочего места"
        width={400}
        height={400}
        priority
        className="pointer-events-none mb-5 mt-6 dark:invert"
      />

      {/* Приветственный текст на русском языке */}
      <p className="text-foreground text-2xl font-semibold whitespace-pre-wrap mx-4 text-center">
        Добро пожаловать в USAUTO с Chat GPT
      </p>

      <p className="text-muted-foreground text-xl mt-4">
        Загрузка...
      </p>
    </div>
  );
}
