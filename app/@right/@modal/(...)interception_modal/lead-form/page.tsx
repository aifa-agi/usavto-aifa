// @/app/@right/@modal/(.)interception_modal/lead-form/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { X, CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

type FormErrors = {
  name?: string[];
  phone?: string[];
  email?: string[];
};

type ApiResponse = {
  success: boolean;
  message?: string;
  errors?: FormErrors;
};

export default function LeadFormModal() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState<string>("");

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      router.back();
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
    };

    try {
      const response = await fetch('/api/lead-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        setIsSuccess(true);
        // Автоматически закрываем модальное окно через 3 секунды
        setTimeout(() => {
          router.back();
        }, 3000);
      } else {
        if (result.errors) {
          setErrors(result.errors);
        }
        if (result.message) {
          setMessage(result.message);
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      setMessage('Произошла ошибка при отправке. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Экран успеха
  if (isSuccess) {
    return (
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleOverlayClick}
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl relative w-full max-w-md p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Закрыть"
          >
            <X size={24} />
          </button>

          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Заявка отправлена!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Спасибо за интерес к US AUTO. Мы свяжемся с вами в ближайшее время.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Окно закроется автоматически через несколько секунд
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors z-10"
          aria-label="Закрыть"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Попробовать бесплатно
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Оставьте заявку и получите доступ к тестированию US AUTO
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Имя *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                          focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                          placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Введите ваше имя"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name[0]}
                </p>
              )}
            </div>

            {/* Phone field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Телефон *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                          focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                          placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="+7 (999) 123-45-67"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.phone[0]}
                </p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                          focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                          placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email[0]}
                </p>
              )}
            </div>

            {/* Error message */}
            {message && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {message}
                </p>
              </div>
            )}

            {/* Submit button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-800 hover:bg-blue-900 disabled:bg-blue-600 
                          text-white px-6 py-3 text-base font-medium
                          transition-all duration-200 hover:shadow-lg
                          disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Отправка...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Отправить заявку
                  </>
                )}
              </Button>
            </div>
          </form>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
            Нажимая &quot;Отправить заявку&quot;, вы соглашаетесь с обработкой персональных данных
          </p>
        </div>
      </div>
    </div>
  );
}
