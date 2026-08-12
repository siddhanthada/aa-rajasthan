"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { MeetingWithDetails } from "@/lib/data/meetings";
import MeetingDetailContent from "./MeetingDetailContent";

export default function MeetingOverlay({
  meeting,
  onClose,
}: {
  meeting: MeetingWithDetails | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!meeting) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [meeting, onClose]);

  if (!meeting) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Desktop: right-side slide-over */}
      <div className="fixed inset-y-0 right-0 hidden w-[480px] flex-col bg-white lg:flex">
        <div className="flex shrink-0 items-center justify-end px-4 py-3">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-ink-muted"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-8">
          <MeetingDetailContent meeting={meeting} />
        </div>
      </div>

      {/* Mobile / tablet: bottom sheet */}
      <div className="fixed inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-2xl bg-white lg:hidden">
        <div className="flex shrink-0 flex-col items-center pt-3">
          <div className="h-1 w-10 rounded-full bg-border" aria-hidden="true" />
          <div className="flex w-full items-center justify-end px-4 pt-2">
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="text-ink-muted"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-8">
          <MeetingDetailContent meeting={meeting} />
        </div>
      </div>
    </div>
  );
}
