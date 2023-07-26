import React from "react";

const Modal = ({
  open,
  setOpen,
  children,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 flex h-screen w-screen items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setOpen(false)}
          />
          <div className="z-40 w-96 bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={handleCloseModal}
              >
                Close
              </button>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
