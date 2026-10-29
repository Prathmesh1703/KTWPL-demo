import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] overflow-y-auto p-4 sm:p-6 lg:p-8 flex min-h-screen items-center justify-center animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* Soft Ambient Frosted Backdrop (Adaptive: Soft Luminous in Light Mode, Deep Slate in Dark Mode) */}
      <div
        className="fixed inset-0 modal-backdrop transition-opacity cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Box with Frosted Liquid Glass & Soothing Architectural Curves */}
      <div
        className={`relative w-full ${maxWidth} rounded-2xl modal-glass-card z-10 overflow-hidden m-auto animate-in zoom-in-95 duration-200`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-subtle">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-ink-primary tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-ink-muted mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink-primary hover:bg-elevated transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(85vh-5rem)] overflow-y-auto text-ink-primary">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
