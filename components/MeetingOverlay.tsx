"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import type { MeetingWithDetails } from "@/lib/data/meetings";
import MeetingDetailContent from "./MeetingDetailContent";
import { pressable } from "@/lib/motion";

const EASE_STANDARD = [0.4, 0, 0.2, 1] as const;
const EASE_DECEL = [0.16, 1, 0.3, 1] as const;

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.14, ease: EASE_STANDARD } },
  exit: { opacity: 0, transition: { duration: 0.14, ease: EASE_STANDARD } },
};

const panelVariants: Variants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { duration: 0.19, ease: EASE_DECEL } },
  exit: { x: "100%", transition: { duration: 0.14, ease: EASE_STANDARD } },
};

const sheetVariants: Variants = {
  hidden: { y: "100%" },
  visible: { y: 0, transition: { duration: 0.19, ease: EASE_DECEL } },
  exit: { y: "100%", transition: { duration: 0.14, ease: EASE_STANDARD } },
};

export default function MeetingOverlay({
  meeting,
  onClose,
}: {
  meeting: MeetingWithDetails | null;
  onClose: () => void;
}) {
  const t = useTranslations("meetingDetail");

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

  return (
    <AnimatePresence>
      {meeting && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-ink/40"
            onClick={onClose}
            aria-hidden="true"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />

          {/* Desktop: right-side slide-over */}
          <motion.div
            className="fixed inset-y-0 right-0 hidden w-[480px] flex-col bg-white lg:flex"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex shrink-0 items-center justify-end px-4 py-3">
              <button
                type="button"
                aria-label={t("close")}
                onClick={onClose}
                className={`rounded text-ink-muted ${pressable}`}
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-8">
              <MeetingDetailContent meeting={meeting} staggerEntrance />
            </div>
          </motion.div>

          {/* Mobile / tablet: bottom sheet */}
          <motion.div
            className="fixed inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-2xl bg-white lg:hidden"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex shrink-0 flex-col items-center pt-3">
              <div
                className="h-1 w-10 rounded-full bg-border"
                aria-hidden="true"
              />
              <div className="flex w-full items-center justify-end px-4 pt-2">
                <button
                  type="button"
                  aria-label={t("close")}
                  onClick={onClose}
                  className={`rounded text-ink-muted ${pressable}`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-8">
              <MeetingDetailContent meeting={meeting} staggerEntrance />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
