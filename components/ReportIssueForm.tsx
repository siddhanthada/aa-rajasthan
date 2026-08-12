"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import FilterDropdown, { type DropdownOption } from "./FilterDropdown";
import { hoverTransition, pressable } from "@/lib/motion";

export default function ReportIssueForm({ meetingId }: { meetingId: string }) {
  const t = useTranslations("meetingDetail");
  const tReport = useTranslations("meetingDetail.report");

  const REASON_OPTIONS: DropdownOption[] = [
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
      <FilterDropdown
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
