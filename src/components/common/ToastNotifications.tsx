import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Check, Info, AlertCircle, X } from 'lucide-react';

export function ToastNotifications() {
  const { toasts, removeToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-stone-900 text-stone-50 border border-stone-800 shadow-xl rounded-lg p-3.5 flex items-start gap-3 transform transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
        >
          {toast.type === 'success' && (
            <div className="w-5 h-5 rounded-full bg-stone-800 flex items-center justify-center shrink-0 mt-0.5 text-stone-200">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="w-5 h-5 rounded-full bg-stone-800 flex items-center justify-center shrink-0 mt-0.5 text-stone-300">
              <Info className="w-3.5 h-3.5" />
            </div>
          )}
          {toast.type === 'warning' && (
            <div className="w-5 h-5 rounded-full bg-amber-900/60 flex items-center justify-center shrink-0 mt-0.5 text-amber-300">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold tracking-wide text-stone-100">
              {toast.title}
            </h4>
            <p className="text-xs text-stone-400 mt-0.5 line-clamp-2">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-stone-400 hover:text-stone-200 p-0.5 rounded transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
