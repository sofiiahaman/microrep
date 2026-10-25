import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { X } from 'lucide-react';

function Modal({ title, children, onClose, maxWidth = 'max-w-[560px]' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleOverlayMouseDown = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        className={`w-full ${maxWidth} rounded-2xl border border-slate-800 bg-[#0f1629] p-6 shadow-2xl shadow-black/60 sm:p-8`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <h2 className="text-xl font-bold tracking-tight text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div> {children}</div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
