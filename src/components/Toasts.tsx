import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { toastDismissed } from '../slices/uiSlice';

export function Toasts() {
  const toasts = useAppSelector((s) => s.ui.toasts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) =>
      setTimeout(() => dispatch(toastDismissed(t.id)), 4500),
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, dispatch]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => {
        const color =
          t.kind === 'success'
            ? 'border-green-300 bg-green-50 text-green-800'
            : t.kind === 'error'
              ? 'border-red-300 bg-red-50 text-red-800'
              : 'border-slate-300 bg-white text-slate-800';
        return (
          <div
            key={t.id}
            className={`card max-w-sm border px-4 py-3 text-sm shadow ${color}`}
            role="alert"
          >
            {t.message}
          </div>
        );
      })}
    </div>
  );
}
