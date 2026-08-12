import { Clock, MapPin, ExternalLink, Check } from "lucide-react";
import type { MeetingWithDetails } from "@/lib/data/meetings";
import { formatDays, formatTimeRange } from "@/lib/format";
import { MeetingTags, VerificationStatus } from "@/components/MeetingCard";
import ReportIssueForm from "@/components/ReportIssueForm";

const REASSURANCES = [
  "You don't need to register.",
  "You don't need to introduce yourself if you don't want to.",
  "There is no fee to attend.",
];

export default function MeetingDetailContent({
  meeting,
}: {
  meeting: MeetingWithDetails;
}) {
  const today = new Date().getDay();
  const isToday = meeting.daysOfWeek.includes(today);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-[22px] font-semibold text-ink">
          {meeting.groupName}
        </h1>
        {isToday && (
          <span className="rounded-full bg-indigo px-2.5 py-1 text-xs font-medium text-white">
            Today
          </span>
        )}
      </div>

      <p className="mt-4 flex items-center gap-2 text-base font-medium text-ink">
        <Clock size={18} className="shrink-0 text-ink" />
        {formatDays(meeting.daysOfWeek)} ·{" "}
        {formatTimeRange(meeting.startTime, meeting.endTime)}
      </p>

      {meeting.format !== "online" && meeting.venueAddress && (
        <div className="mt-3">
          <p className="flex items-start gap-2 text-sm text-ink">
            <MapPin size={18} className="mt-0.5 shrink-0 text-ink" />
            <span>
              {meeting.venueName}, {meeting.venueAddress},{" "}
              {meeting.venueLocality}, {meeting.districtName}
              {meeting.format === "hybrid" && " · also online"}
            </span>
          </p>
          {meeting.mapLink && (
            <a
              href={meeting.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo px-4 py-2 text-sm font-semibold text-white"
            >
              Get directions
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      )}
      {meeting.format === "online" && (
        <p className="mt-3 flex items-center gap-2 text-sm text-ink">
          <MapPin size={18} className="shrink-0 text-ink" />
          Online meeting · {meeting.districtName}
        </p>
      )}

      <div className="mt-4">
        <MeetingTags meeting={meeting} />
      </div>

      <div className="mt-3">
        <VerificationStatus meeting={meeting} />
      </div>

      <div className="mt-8 rounded-xl bg-indigo/6 p-5">
        <h2 className="text-[15px] font-semibold text-ink">
          Going for the first time?
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {REASSURANCES.map((line) => (
            <li key={line} className="flex items-start gap-2 text-sm text-ink">
              <Check size={16} className="mt-0.5 shrink-0 text-indigo" />
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <ReportIssueForm meetingId={meeting.id} />
      </div>
    </div>
  );
}
