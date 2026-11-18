import React from 'react';
import './Toast.css';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-item toast-${t.type || 'info'}`}>
          <div className="toast-icon">
            {t.type === 'success' && <span>&#x2714;</span>}
            {t.type === 'error' && <span>&#x26A0;</span>}
            {t.type === 'info' && <span>&#x2139;</span>}
          </div>
          <div className="toast-message">{t.message}</div>
          <button className="toast-close" onClick={() => onDismiss(t.id)}>
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
