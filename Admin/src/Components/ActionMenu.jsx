import React, { useEffect, useRef, useState } from "react";
import ConfirmModal from "./ConfirmModal";

const ActionMenu = ({ product, onEdit, onToggle, onRemove }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: 'default',
    title: '',
    message: '',
    onConfirm: null
  });

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleButtonClick = (e) => {
    setOpen((v) => !v);
  };

  const showConfirmModal = (type, title, message, onConfirm) => {
    setConfirmModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm
    });
    setOpen(false);
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      type: 'default',
      title: '',
      message: '',
      onConfirm: null
    });
  };

  const handleDeactivate = () => {
    const message = product.isActive 
      ? "Deactivate this product?" 
      : "Reactivate this product?";
    showConfirmModal(
      'default',
      product.isActive ? 'Deactivate Product' : 'Activate Product',
      message,
      () => onToggle(product)
    );
  };

  const handleRemove = () => {
    showConfirmModal(
      'danger',
      'Remove Product',
      'Remove this product? This action cannot be undone.',
      () => onRemove(product._id)
    );
  };

  return (
    <>
      <div className="relative inline-block text-left" ref={ref}>
        <button
          onClick={handleButtonClick}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-myblack/10 bg-white text-myblack/50 hover:border-myblack/30 hover:text-myblack"
          title="Actions"
        >
          ⋮
        </button>
        {open && (
          <div className="absolute left-0 top-full mt-1 z-50 min-w-[150px] rounded-xl border border-myblack/10 bg-white py-1 shadow-md">
          <button
            onClick={() => {
              onEdit(product);
              setOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-myblack hover:bg-slate-50"
          >
            Edit
          </button>
          <button
            onClick={handleDeactivate}
            className="w-full px-4 py-2 text-left text-sm text-myblack hover:bg-slate-50"
          >
            {product.isActive ? "Deactivate" : "Activate"}
          </button>
          <div className="my-1 border-t border-myblack/5" />
          <button
            onClick={handleRemove}
            className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
          >
            Remove
          </button>
        </div>
        )}
      </div>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />
    </>
  );
};

export default ActionMenu;
