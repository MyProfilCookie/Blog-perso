import { useState } from 'react';

export interface Toast {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (options: Toast) => {
    // Simple console log for now, you can expand this later
    console.log('Toast:', options.title, options.description);

    // Add toast to array for potential UI display
    setToasts((prev) => [...prev, options]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000);
  };

  return { toast, toasts };
}
