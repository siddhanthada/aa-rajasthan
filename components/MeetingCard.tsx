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
  const verified = meeting.verificationStatus === "verified";

  return (
    <li className="rounded-[2px] border border-border bg-white p-4 transition-colors hover:border-indigo">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-semibold text-ink">
          {meeting.groupName}
        </h3>
        {isToday && (
          <span className="rounded-[2px] bg-indigo px-2 py-0.5 text-xs font-medium text-white">
            Today
          </span>
        )}
      </div>

      <p className="mt-1 text-[13px] text-ink-muted">
        {formatDays(meeting.daysOfWeek)} ·{" "}
        {formatTimeRange(meeting.startTime, meeting.endTime)}
      </p>
      <p className="text-[13px] text-ink-muted">
        {meeting.format === "online"
          ? "Online"
          : `${meeting.venueName}, ${meeting.venueLocality}`}
        {meeting.format === "hybrid" && " · also online"}
        {" · "}
        {meeting.districtName}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span
          className={`rounded-[2px] px-2 py-0.5 text-xs font-medium text-white ${
            meeting.access === "open" ? "bg-terracotta" : "bg-ink-muted"
          }`}
        >
          {meeting.access === "open" ? "Open" : "Closed"}
        </span>
        <span className="rounded-[2px] bg-indigo/12 px-2 py-0.5 text-xs font-medium text-indigo">
          {formatFormat(meeting.format)}
        </span>
        {meeting.languages.map((lang) => (
          <span
            key={lang}
            className="rounded-[2px] bg-sandstone/15 px-2 py-0.5 text-xs font-medium text-sandstone"
          >
            {formatLanguage(lang)}
          </span>
        ))}
      </div>

      <div
        className={`mt-2 text-right text-xs font-medium ${
          verified ? "text-sandstone" : "text-terracotta"
        }`}
      >
        {verificationLabel(meeting)}
      </div>
    </li>
  );
}
