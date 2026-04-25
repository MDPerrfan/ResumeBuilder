import { XIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function AIGateModal({ open, onClose }) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto mt-8 w-full max-w-md" onClick={(event) => event.stopPropagation()}>
        <div className="relative rounded-2xl border border-white/40 bg-white/25 p-5 shadow-xl backdrop-blur-xl">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full p-1 text-slate-700 hover:bg-white/50"
            aria-label="Close"
          >
            <XIcon className="size-4" />
          </button>
          <h3 className="text-lg font-semibold text-slate-900">Sign in to use AI Features</h3>
          <p className="mt-2 text-sm text-slate-700">
            AI enhancements are available for signed-in users. Continue to sign up or sign in.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-black"
            >
              Go to Sign Up
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white/60 px-4 py-2 text-sm text-slate-700 hover:bg-white"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
