import React from "react";

export default function InlineNotice({ notice, onClose }) {
  if (!notice?.message) return null;

  const styles =
    notice.type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-green-200 bg-green-50 text-green-700";

  return (
    <div className={`fixed top-4 left-1/2 z-40 -translate-x-1/2 rounded-lg border px-4 py-2 text-sm shadow ${styles}`}>
      <div className="flex items-center gap-3">
        <span>{notice.message}</span>
        <button onClick={onClose} className="font-medium opacity-80 hover:opacity-100">
          Close
        </button>
      </div>
    </div>
  );
}
