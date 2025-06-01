import React from "react";

export default function BottomDrawer({ selected, onClose, children }) {
  const isOpen = Boolean(selected);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#216a78] shadow-2xl px-6 py-5 max-h-[60vh] overflow-y-auto z-[999] rounded-t-3xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-y-0" : "translate-y-full"}
      `}
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl text-[#202254] font-semibold font-[AlfaSlabOne-Regular] truncate">
          {selected?.name}
        </h2>
        <button
          onClick={onClose}
          className="text-[#216a78] hover:text-red-600 text-lg font-medium transition"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      <div className="text-base text-[#202254] leading-relaxed">{children}</div>
    </div>
  );
}
