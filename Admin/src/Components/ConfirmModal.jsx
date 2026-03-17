import React from "react";

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "default"
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    default: {
      confirmBg: "bg-blue-600 hover:bg-blue-700",
      confirmText: "text-white"
    },
    danger: {
      confirmBg: "bg-rose-600 hover:bg-rose-700", 
      confirmText: "text-white"
    }
  };

  const styles = typeStyles[type] || typeStyles.default;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-myblack mb-2">
          {title}
        </h3>
        <p className="text-myblack/70 mb-6">
          {message}
        </p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="rounded-full px-5 py-2 text-sm font-medium text-myblack/70 hover:text-myblack hover:bg-slate-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${styles.confirmBg} ${styles.confirmText} transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
