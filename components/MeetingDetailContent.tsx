import { useTranslations } from "next-intl";
import { Clock, MapPin, ExternalLink, Check } from "lucide-react";
import type { MeetingWithDetails } from "@/lib/data/meetings";
import { formatDays, formatTimeRange } from "@/lib/format";
import { MeetingTags, VerificationStatus } from "@/components/MeetingCard";
import ReportIssueForm from "@/components/ReportIssueForm";

export default function MeetingDetailContent({
  meeting,
}: {
  meeting: MeetingWithDetails;
}) {
  const t = useTranslations("meetingDetail");
  const tCard = useTranslations("card");
  const tDays = useTranslations("days");
  const dayLabels = tDays.raw("short") as string[];

  const today = new Date().getDay();
  const isToday = meeting.daysOfWeek.includes(today);

  const REASSURANCES = [
    t("firstTime.line1"),
    t("firstTime.line2"),
    t("firstTime.line3"),
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-[22px] font-semibold text-ink">
          {meeting.groupName}
        </h1>
        {isToday && (
          <span className="rounded-full bg-indigo px-2.5 py-1 text-xs font-medium text-white">
            {tCard("today")}
          </span>
        )}
      </div>

      <p className="mt-4 flex items-center gap-2 text-base font-medium text-ink">
        <Clock size={18} className="shrink-0 text-ink" />
        {formatDays(meeting.daysOfWeek, dayLabels)} ·{" "}
        {formatTimeRange(meeting.startTime, meeting.endTime)}
      </p>

      {meeting.format !== "online" && meeting.venueAddress && (
        <div className="mt-3">
          <p className="flex items-start gap-2 text-sm text-ink">
            <MapPin size={18} className="mt-0.5 shrink-0 text-ink" />
            <span>
              {meeting.venueName}, {meeting.venueAddress},{" "}
              {meeting.venueLocality}, {meeting.districtName}
              {meeting.format === "hybrid" && ` · ${t("alsoOnline")}`}
            </span>
          </p>
          {meeting.mapLink && (
            <a
              href={meeting.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo px-4 py-2 text-sm font-semibold text-white"
            >
              {t("getDirections")}
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      )}
      {meeting.format === "online" && (
        <p className="mt-3 flex items-center gap-2 text-sm text-ink">
          <MapPin size={18} className="shrink-0 text-ink" />
          {t("onlineMeeting")} · {meeting.districtName}
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
          {t("firstTime.heading")}
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
