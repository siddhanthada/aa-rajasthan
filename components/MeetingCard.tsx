import { Clock, MapPin, Check, AlertTriangle, ChevronRight } from "lucide-react";
import type { MeetingWithDetails } from "@/lib/data/meetings";
import {
  formatDays,
  formatFormat,
  formatLanguage,
  formatTimeRange,
  formatDate,
} from "@/lib/format";

function verificationLabel(meeting: MeetingWithDetails): string {
  if (meeting.verificationStatus === "verified" && meeting.lastVerifiedAt) {
    return `Verified ${formatDate(meeting.lastVerifiedAt)}`;
  }
  if (meeting.verificationStatus === "needs_review") {
    return "Needs review";
  }
  return "Unverified";
}

export function MeetingTags({ meeting }: { meeting: MeetingWithDetails }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span
        className={`rounded-lg px-2 py-0.5 text-xs font-medium text-white ${
          meeting.access === "open" ? "bg-terracotta" : "bg-ink-muted"
        }`}
      >
        {meeting.access === "open" ? "Open" : "Closed"}
      </span>
      <span className="rounded-lg bg-indigo/15 px-2 py-0.5 text-xs font-medium text-indigo">
        {formatFormat(meeting.format)}
      </span>
      {meeting.languages.map((lang) => (
        <span
          key={lang}
          className="rounded-lg bg-sandstone/15 px-2 py-0.5 text-xs font-medium text-sandstone"
        >
          {formatLanguage(lang)}
        </span>
      ))}
    </div>
  );
}

export function VerificationStatus({
  meeting,
}: {
  meeting: MeetingWithDetails;
}) {
  const verified = meeting.verificationStatus === "verified";
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        verified ? "text-sandstone" : "text-terracotta"
      }`}
    >
      {verified ? <Check size={14} /> : <AlertTriangle size={14} />}
      {verificationLabel(meeting)}
    </span>
  );
}

export default function MeetingCard({
  meeting,
  isToday,
}: {
  meeting: MeetingWithDetails;
  isToday: boolean;
}) {
  const venueLine =
    meeting.format === "online"
      ? `Online${meeting.districtName ? ` · ${meeting.districtName}` : ""}`
      : `${meeting.venueName}, ${meeting.venueLocality}${
          meeting.format === "hybrid" ? " · also online" : ""
        } · ${meeting.districtName}`;

  return (
    <li className="group relative rounded-xl border border-border bg-white p-4 transition-colors hover:border-indigo hover:bg-indigo/3">
      {isToday && (
        <span className="absolute right-4 top-4 rounded-full bg-indigo px-2.5 py-1 text-xs font-medium text-white">
          Today
        </span>
      )}

      <h3 className="truncate pr-16 text-base font-semibold text-ink">
        {meeting.groupName}
      </h3>

      <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-ink">
        <Clock size={16} className="shrink-0 text-ink" />
        {formatDays(meeting.daysOfWeek)} ·{" "}
        {formatTimeRange(meeting.startTime, meeting.endTime)}
      </p>
      <p className="mt-1 flex items-start gap-1.5 text-[13px] text-ink-muted">
        <MapPin size={16} className="mt-0.5 shrink-0 text-ink-muted" />
        <span className="line-clamp-2">{venueLine}</span>
      </p>

      <div className="my-3 border-t border-border" />

      <MeetingTags meeting={meeting} />

      <div className="mt-3 flex items-center justify-between">
        <VerificationStatus meeting={meeting} />
        <ChevronRight size={16} className="text-ink-muted" />
      </div>
    </li>
  );
}
