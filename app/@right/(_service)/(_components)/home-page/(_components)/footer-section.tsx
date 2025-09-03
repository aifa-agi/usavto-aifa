// @/app/@right/(_service)/(_components)/home-page/(_components)/footer-section.tsx
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

export function FooterSection() {
  // Получаем текущий год динамически
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-9 px-4 xl:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-8">Контакты</h3>
            <div className="space-y-4">
              <div className="flex gap-5">
                <span className="w-18 flex-shrink-0">Почта:</span>
                <span>soft@sipsmos.ru</span>
              </div>
              <div className="flex gap-5">
                <span className="w-18 flex-shrink-0">Телефон:</span>
                <span>+7 495 1263948</span>
              </div>
              <div className="flex gap-5">
                <span className="w-18 flex-shrink-0">Адрес:</span>
                <div className="max-w-lg">
                  Москва, 4-я Магистральная улица дом 11с2, офис 217 пом. 3\2
                  <br />
                  Москва, Варшавское шоссе, 143
                  <br />
                  Москва, ул. Зеленодольская, 3к2, офис 525
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-8">Полезные материалы</h3>
            <div className="space-y-4">
              <Button
                variant="secondary"
                className="bg-white text-black hover:bg-gray-100 justify-start px-4 py-3 rounded-xl w-full transform transition-all duration-300 hover:scale-105"
              >
                Руководство пользователя
              </Button>
              <Button
                variant="secondary"
                className="bg-white text-black hover:bg-gray-100 justify-start px-4 py-3 rounded-xl w-full transform transition-all duration-300 hover:scale-105"
              >
                Описание функциональных характеристик
              </Button>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/20 my-8"></div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-base leading-relaxed">
              ООО "ПРОФАЙТИ" ИНН 9714052498 КПП 771401001 ОГРН 1247700441636
              123308, город Москва, 4-Я Магистральная ул, д. 11 стр. 2, помещ.
              3/2
            </p>
          </div>

          <div>
            <p className="text-base leading-relaxed mb-6">
              ООО "Профайти" оказывает услуги в области информационных
              технологий, а именно предоставление лицензий на собственные
              программы для ЭВМ.
            </p>
            <p className="text-base leading-relaxed">
              ООО "Профайти" является правообладателем ПО "USAUTO". ПО "USAUTO"
              включено в реестр российского ПО, реестровая запись № 26461 от
              12.02.{currentYear} года
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="w-56 h-16 relative">
            <Image
              src="/images/logo-small.png"
              alt="Логотип ООО ПРОФАЙТИ"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div>
          <div className="h-px bg-white/20 mb-4"></div>
          <p className="text-lg font-bold">ООО "ПРОФАЙТИ" © {currentYear}</p>
        </div>
      </div>
    </footer>
  );
}
