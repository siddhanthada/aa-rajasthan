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
    <li
      className={`border border-border bg-paper p-4 ${
        isToday ? "border-t-2 border-t-indigo" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium text-ink">{meeting.groupName}</h3>
        {isToday && (
          <span className="shrink-0 border border-indigo px-1.5 py-0.5 text-xs font-medium text-indigo">
            Today
          </span>
        )}
      </div>

      <p className="mt-1 text-sm text-ink">
        {formatDays(meeting.daysOfWeek)} · {formatTimeRange(
          meeting.startTime,
          meeting.endTime,
        )}
      </p>

      <p className="mt-1 text-sm text-ink-muted">
        {meeting.format === "online"
          ? "Online meeting"
          : `${meeting.venueName}, ${meeting.venueLocality}`}
        {meeting.format === "hybrid" && " · also online"}
      </p>
      <p className="text-sm text-ink-muted">{meeting.districtName}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="border border-terracotta px-1.5 py-0.5 font-medium text-terracotta">
          {meeting.access === "open" ? "Open meeting" : "Closed meeting"}
        </span>
        <span className="border border-border px-1.5 py-0.5 text-ink-muted">
          {formatFormat(meeting.format)}
        </span>
        {meeting.languages.map((lang) => (
          <span
            key={lang}
            className="border border-border px-1.5 py-0.5 text-ink-muted"
          >
            {formatLanguage(lang)}
          </span>
        ))}
      </div>

      <div className="mt-3 text-xs text-sandstone">
        {verificationLabel(meeting)}
      </div>
    </li>
  );
}
