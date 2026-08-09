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

export default function MeetingCard({
  meeting,
  isToday,
}: {
  meeting: MeetingWithDetails;
  isToday: boolean;
}) {
  return (
    <li className="break-inside-avoid border-b border-border py-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
        <span className="text-sm font-medium text-ink">
          {meeting.groupName}
          {isToday && (
            <span className="ml-1.5 text-xs font-medium text-indigo">
              Today
            </span>
          )}
        </span>
        <span className="text-xs text-ink-muted">
          {formatDays(meeting.daysOfWeek)} ·{" "}
          {formatTimeRange(meeting.startTime, meeting.endTime)}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-2 text-xs text-ink-muted">
        <span>
          {meeting.format === "online"
            ? "Online"
            : `${meeting.venueName}, ${meeting.venueLocality}`}
          {meeting.format === "hybrid" && " · also online"}
          {" · "}
          {meeting.districtName}
        </span>
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="border border-terracotta px-1 py-px font-medium text-terracotta">
          {meeting.access === "open" ? "Open" : "Closed"}
        </span>
        <span className="border border-border px-1 py-px text-ink-muted">
          {formatFormat(meeting.format)}
        </span>
        {meeting.languages.map((lang) => (
          <span
            key={lang}
            className="border border-border px-1 py-px text-ink-muted"
          >
            {formatLanguage(lang)}
          </span>
        ))}
        <span className="ml-auto text-sandstone">
          {verificationLabel(meeting)}
        </span>
      </div>
    </li>
  );
}
