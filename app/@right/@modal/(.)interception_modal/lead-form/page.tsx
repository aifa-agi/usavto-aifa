// @/app/@right/@modal/(..)interception_modal/lead-form/page.tsx
"use client"
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

export default function LeadFormModal() {
  const router = useRouter();

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      router.back();
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl relative w-[90%] max-w-[600px] h-[300px] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Modal content */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            It is lead form modal
          </h2>
        </div>
      </div>
    </div>
  );
}
