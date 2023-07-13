import React, { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({
  open,
  setOpen,
  children,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50">
          <div
            className="absolute left-0 top-0 z-40 h-screen w-screen"
            onClick={() => setOpen(false)}
          />
          <div className="z-50 rounded-lg p-6 shadow-lg">
            <div className="">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
