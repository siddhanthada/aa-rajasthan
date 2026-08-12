"use client";

import { useEffect, useRef } from "react";
import {
  AnimatePresence,
  motion,
  useDragControls,
  type PanInfo,
  type Variants,
} from "framer-motion";
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
  const dragControls = useDragControls();
  const contentRef = useRef<HTMLDivElement>(null);

  function handleSheetDragEnd(
    _event: PointerEvent | MouseEvent | TouchEvent,
    info: PanInfo,
  ) {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  }

  // Let a swipe start anywhere on the sheet, not just the small grab
  // handle — but only take over from the content's own scroll once
  // it's already scrolled to the top, so a long meeting detail can
  // still be scrolled normally.
  function handleContentPointerDown(e: React.PointerEvent) {
    if (contentRef.current && contentRef.current.scrollTop > 0) return;
    dragControls.start(e);
  }

  useEffect(() => {
    if (!meeting) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);

    // Plain `overflow: hidden` on body doesn't reliably block touch
    // scrolling on mobile Safari/Chrome — the scroll gesture can still
    // chain through to the page behind the sheet. Pinning body to its
    // current scroll offset via `position: fixed` blocks it properly;
    // scroll position is restored on close.
    const scrollY = window.scrollY;
    const body = document.body;
    const previousStyle = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.position = previousStyle.position;
      body.style.top = previousStyle.top;
      body.style.left = previousStyle.left;
      body.style.right = previousStyle.right;
      body.style.width = previousStyle.width;
      window.scrollTo(0, scrollY);
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
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 400 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleSheetDragEnd}
          >
            <div
              className="flex shrink-0 touch-none flex-col items-center pt-3"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div
                className="h-1 w-10 rounded-full bg-border"
                aria-hidden="true"
              />
              <div className="flex w-full items-center justify-end px-4 pt-1">
                <button
                  type="button"
                  aria-label={t("close")}
                  onClick={onClose}
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`rounded text-ink-muted ${pressable}`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div
              ref={contentRef}
              onPointerDown={handleContentPointerDown}
              className="flex-1 overflow-y-auto overscroll-contain px-6 pb-8"
            >
              <MeetingDetailContent meeting={meeting} staggerEntrance />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
