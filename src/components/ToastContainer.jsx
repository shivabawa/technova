import React from 'react';
import { useStore } from '../context/StoreContext';

export function ToastContainer() {
  const { toasts } = useStore();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toasts" id="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.exiting ? 'out' : ''}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 12l5 5L20 6" />
          </svg>
          <span>{t.msg}</span>
          {t.actionLabel && (
            <button
              type="button"
              onClick={() => {
                t.onAction?.();
              }}
            >
              {t.actionLabel}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
