import Link from "next/link";
import { Clock, MapPin, Check, AlertTriangle, ChevronRight } from "lucide-react";
import type { MeetingWithDetails } from "@/lib/data/meetings";
import {
  formatDays,
  formatFormat,
  formatLanguage,
  formatTimeRange,
  formatDate,
} from "@/lib/format";

function verificationLabel(
  meeting: MeetingWithDetails,
  compact: boolean,
): string {
  if (meeting.verificationStatus === "verified" && meeting.lastVerifiedAt) {
    return compact
      ? formatDate(meeting.lastVerifiedAt)
      : `Verified ${formatDate(meeting.lastVerifiedAt)}`;
  }
  if (meeting.verificationStatus === "needs_review") {
    return "Needs review";
  }
  return "Unverified";
}

export function MeetingTags({
  meeting,
  compact = false,
}: {
  meeting: MeetingWithDetails;
  compact?: boolean;
}) {
  const size = compact ? "px-2 py-0.5 text-[11px]" : "px-2 py-0.5 text-xs";
  const wrap = compact
    ? "flex-nowrap overflow-hidden"
    : "flex-wrap";
  return (
    <div className={`flex items-center gap-1.5 ${wrap}`}>
      <span
        className={`shrink-0 rounded-lg font-medium text-white ${size} ${
          meeting.access === "open" ? "bg-terracotta" : "bg-ink-muted"
        }`}
      >
        {meeting.access === "open" ? "Open" : "Closed"}
      </span>
      <span className={`shrink-0 rounded-lg bg-indigo/15 font-medium text-indigo ${size}`}>
        {formatFormat(meeting.format)}
      </span>
      {meeting.languages.map((lang) => (
        <span
          key={lang}
          className={`shrink-0 rounded-lg bg-sandstone/15 font-medium text-sandstone ${size}`}
        >
          {formatLanguage(lang)}
        </span>
      ))}
    </div>
  );
}

export function VerificationStatus({
  meeting,
  compact = false,
}: {
  meeting: MeetingWithDetails;
  compact?: boolean;
}) {
  const verified = meeting.verificationStatus === "verified";
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap text-xs font-medium ${
        verified ? "text-sandstone" : "text-terracotta"
      }`}
    >
      {verified ? <Check size={14} /> : <AlertTriangle size={14} />}
      {verificationLabel(meeting, compact)}
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
    <li>
      <Link
        href={`/meetings/${meeting.id}`}
        className="group relative block rounded-xl border border-border bg-white p-4 transition-colors hover:border-indigo hover:bg-indigo/3"
      >
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
      </Link>
    </li>
  );
}
