import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

const Modal = ({ onClose, children }) => {
  const modalRoot = (typeof document !== 'undefined' && document.getElementById('modal-root')) || document.body;
  const handleKeyDown = useCallback((e) => {
    if (e.code === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  const handleBackdropClick = e => {
    if (e.currentTarget === e.target) onClose();
  };

  return createPortal(
    <div className="backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button type="button" className="close-btn" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
