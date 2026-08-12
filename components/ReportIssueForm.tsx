"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { hoverTransition, pressable } from "@/lib/motion";

type ReasonOption = { value: string; label: string };

function ReasonDropdown({
  ariaLabel,
  value,
  options,
  onChange,
}: {
  ariaLabel: string;
  value: string;
  options: ReasonOption[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 text-sm text-ink hover:border-indigo ${pressable}`}
      >
        <span className="truncate">{current.label}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-ink-muted motion-safe:transition-transform motion-safe:duration-[var(--duration-base)] motion-safe:ease-standard ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-20 mt-1 min-w-full overflow-hidden rounded-lg border border-border bg-white py-1 shadow-none"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`block w-full whitespace-nowrap px-2 py-2 text-left text-sm text-ink hover:bg-paper ${hoverTransition}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReportIssueForm({ meetingId }: { meetingId: string }) {
  const t = useTranslations("meetingDetail");
  const tReport = useTranslations("meetingDetail.report");

  const REASON_OPTIONS: ReasonOption[] = [
    { value: "", label: tReport("selectReason") },
    { value: "meeting_didnt_happen", label: tReport("reasonMeetingDidntHappen") },
    { value: "time_wrong", label: tReport("reasonTimeWrong") },
    { value: "venue_changed", label: tReport("reasonVenueChanged") },
    { value: "map_wrong", label: tReport("reasonMapWrong") },
    { value: "other", label: tReport("reasonOther") },
  ];

  const [expanded, setExpanded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      meetingId,
      reason,
      note,
      status: "open" as const,
      submittedAt: new Date().toISOString(),
    };
    // Phase 3: write `payload` to the correctionRequests collection once
    // Firestore is connected — no backend yet, so just confirm inline.
    void payload;
    setSubmitted(true);
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className={`text-sm font-medium text-indigo underline underline-offset-2 ${hoverTransition}`}
      >
        {t("reportIssue")}
      </button>
    );
  }

  if (submitted) {
    return (
      <p className="text-sm font-medium text-sandstone">
        {tReport("thanks")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-3">
      <ReasonDropdown
        ariaLabel={tReport("reasonAria")}
        value={reason}
        options={REASON_OPTIONS}
        onChange={setReason}
      />
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={tReport("notePlaceholder")}
        rows={3}
        className="rounded-lg border border-border bg-white p-3 text-sm text-ink placeholder:text-ink-muted"
      />
      <button
        type="submit"
        disabled={!reason}
        className={`w-fit rounded-lg bg-indigo px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 ${pressable}`}
      >
        {tReport("submit")}
      </button>
    </form>
  );
}
