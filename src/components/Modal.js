'use client';

import { useEffect, useRef } from 'react';

export default function Modal({ isOpen, onClose, title, children, footer }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && e.target === modalRef.current) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('click', handleClickOutside);

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className={`modal-overlay ${isOpen ? 'active' : ''}`}
      style={{ display: 'flex' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal">
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button className="close-modal" onClick={onClose} aria-label="Close modal">×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.85); /* darker overlay */
          z-index: 1000;
          align-items: center;
          justify-content: center;
          transition: background 0.3s;
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal {
          background: #18181b; /* dark modal */
          border-radius: 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.45);
          max-width: 420px;
          width: 90vw;
          padding: 0;
          animation: popIn 0.25s cubic-bezier(.4,2,.6,1);
          display: flex;
          flex-direction: column;
        }
        @keyframes popIn {
          from { transform: translateY(40px) scale(0.96); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.2rem 1.5rem 1rem 1.5rem;
          border-bottom: 1px solid #27272a;
          background: #23232a;
          border-radius: 18px 18px 0 0;
        }
        .modal-header h2 {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 700;
          color: #fafafa;
          letter-spacing: 0.01em;
        }
        .close-modal {
          background: none;
          border: none;
          font-size: 1.7rem;
          color: #a1a1aa;
          cursor: pointer;
          border-radius: 50%;
          width: 2.2rem;
          height: 2.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, color 0.15s;
        }
        .close-modal:hover, .close-modal:focus {
          background: #27272a;
          color: #fbbf24;
          outline: none;
        }
        .modal-body {
          padding: 1.5rem;
          background: #18181b;
        }
        .modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #27272a;
          background: #23232a;
          border-radius: 0 0 18px 18px;
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        /* Form field styles for children */
        .modal-body input,
        .modal-body textarea,
        .modal-body select {
          width: 100%;
          padding: 0.8rem 1.1rem;
          margin-bottom: 1.1rem;
          border: 1.5px solid #27272a; /* neutral border */
          border-radius: 10px;
          font-size: 1rem;
          background: #23232a;
          color: #fafafa;
          transition: border 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .modal-body input:focus,
        .modal-body textarea:focus,
        .modal-body select:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px #6366f155;
          outline: none;
          background: #18181b;
        }
        /* Only show red border if input-error class is present */
        .modal-body input.input-error,
        .modal-body textarea.input-error,
        .modal-body select.input-error {
          border-color: #ef4444 !important; /* red-500 */
          box-shadow: 0 0 0 2px #ef444455 !important;
        }
        .modal-body label {
          font-weight: 500;
          color: #e5e5e5;
          margin-bottom: 0.4rem;
          display: block;
        }
        /* Placeholder color for dark mode */
        .modal-body input::placeholder,
        .modal-body textarea::placeholder {
          color: #a1a1aa;
          opacity: 1;
        }
        /* Button styles for footer (if you use buttons) */
        .modal-footer button {
          background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.6rem 1.3rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px #6366f133;
        }
        .modal-footer button:hover, .modal-footer button:focus {
          background: linear-gradient(90deg, #818cf8 0%, #6366f1 100%);
          box-shadow: 0 4px 16px #6366f144;
          outline: none;
        }
        /* Responsive */
        @media (max-width: 600px) {
          .modal {
            max-width: 98vw;
            padding: 0;
          }
          .modal-header, .modal-body, .modal-footer {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </div>
  );
}