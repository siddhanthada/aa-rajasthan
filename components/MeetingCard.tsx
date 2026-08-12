"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Clock,
  MapPin,
  Check,
  AlertTriangle,
  ChevronRight,
  Navigation,
} from "lucide-react";
import type { MeetingWithDetails } from "@/lib/data/meetings";
import { formatDays, formatFormat, formatLanguage, formatTimeRange, formatDate } from "@/lib/format";
import { formatDistanceKm } from "@/lib/geo";
import { hoverTransition, pressable } from "@/lib/motion";

type Translate = (key: string) => string;

export function verificationLabel(
  meeting: MeetingWithDetails,
  t: Translate,
  compact: boolean = false,
): string {
  if (meeting.verificationStatus === "verified" && meeting.lastVerifiedAt) {
    const date = formatDate(meeting.lastVerifiedAt);
    return compact ? date : `${t("verified")} ${date}`;
  }
  if (meeting.verificationStatus === "needs_review") {
    return t("needsReview");
  }
  return t("unverified");
}

export function tagsSummary(meeting: MeetingWithDetails, t: Translate): string {
  const formatLabels: Record<string, string> = {
    in_person: t("inPerson"),
    online: t("online"),
    hybrid: t("hybrid"),
  };
  const languageLabels: Record<string, string> = {
    hi: t("languageHindi"),
    en: t("languageEnglish"),
  };
  const parts = [
    meeting.access === "open" ? t("open") : t("closed"),
    formatFormat(meeting.format, formatLabels),
    ...meeting.languages.map((lang) => formatLanguage(lang, languageLabels)),
  ];
  return parts.join(", ");
}

export function MeetingTags({
  meeting,
  compact = false,
}: {
  meeting: MeetingWithDetails;
  compact?: boolean;
}) {
  const t = useTranslations("badges");
  const formatLabels: Record<string, string> = {
    in_person: t("inPerson"),
    online: t("online"),
    hybrid: t("hybrid"),
  };
  const languageLabels: Record<string, string> = {
    hi: t("languageHindi"),
    en: t("languageEnglish"),
  };
  const size = compact ? "px-2 py-0.5 text-[11px]" : "px-2 py-0.5 text-xs";
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span
        className={`shrink-0 rounded-lg font-medium text-white ${size} ${
          meeting.access === "open" ? "bg-terracotta" : "bg-ink-muted"
        }`}
      >
        {meeting.access === "open" ? t("open") : t("closed")}
      </span>
      <span className={`shrink-0 rounded-lg bg-indigo/15 font-medium text-indigo ${size}`}>
        {formatFormat(meeting.format, formatLabels)}
      </span>
      {meeting.languages.map((lang) => (
        <span
          key={lang}
          className={`shrink-0 rounded-lg bg-sandstone/15 font-medium text-sandstone ${size}`}
        >
          {formatLanguage(lang, languageLabels)}
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
  const t = useTranslations("badges");
  const verified = meeting.verificationStatus === "verified";
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap text-xs font-medium ${
        verified ? "text-sandstone" : "text-terracotta"
      }`}
    >
      {verified ? <Check size={14} /> : <AlertTriangle size={14} />}
      {verificationLabel(meeting, t, compact)}
    </span>
  );
}

function isModifiedClick(e: React.MouseEvent) {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1;
}

export default function MeetingCard({
  meeting,
  isToday,
  distanceKm,
  onSelect,
  entranceDelay,
}: {
  meeting: MeetingWithDetails;
  isToday: boolean;
  distanceKm?: number;
  onSelect?: (id: string) => void;
  entranceDelay?: number;
}) {
  const t = useTranslations("card");
  const tDays = useTranslations("days");
  const dayLabels = tDays.raw("short") as string[];

  const venueLine =
    meeting.format === "online"
      ? `${t("online")}${meeting.districtName ? ` · ${meeting.districtName}` : ""}`
      : `${meeting.venueName}, ${meeting.venueLocality}${
          meeting.format === "hybrid" ? ` · ${t("alsoOnline")}` : ""
        } · ${meeting.districtName}`;

  return (
    <li
      className={entranceDelay !== undefined ? "animate-fade-rise" : undefined}
      style={
        entranceDelay !== undefined
          ? { animationDelay: `${entranceDelay}ms` }
          : undefined
      }
    >
      <Link
        href={`/meetings/${meeting.id}`}
        onClick={(e) => {
          if (!onSelect || isModifiedClick(e)) return;
          e.preventDefault();
          onSelect(meeting.id);
        }}
        className={`group relative block rounded-xl border border-border bg-white p-4 hover:border-indigo hover:bg-indigo/3 ${hoverTransition}`}
      >
        {isToday && (
          <span className="absolute right-4 top-4 rounded-full bg-indigo px-2.5 py-1 text-xs font-medium text-white">
            {t("today")}
          </span>
        )}

        <h3 className="truncate pr-16 text-base font-semibold text-ink">
          {meeting.groupName}
        </h3>

        <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-ink">
          <Clock size={16} className="shrink-0 text-ink" />
          {formatDays(meeting.daysOfWeek, dayLabels)} ·{" "}
          {formatTimeRange(meeting.startTime, meeting.endTime)}
        </p>
        <p className="mt-1 flex items-start gap-1.5 text-[13px] text-ink-muted">
          <MapPin size={16} className="mt-0.5 shrink-0 text-ink-muted" />
          <span className="line-clamp-2">
            {venueLine}
            {distanceKm !== undefined && Number.isFinite(distanceKm) && (
              <> · {formatDistanceKm(distanceKm, t("kmAway"))}</>
            )}
          </span>
          {meeting.mapLink && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(meeting.mapLink, "_blank", "noopener,noreferrer");
              }}
              aria-label={t("getDirectionsAria", {
                venue: meeting.venueName ?? "",
              })}
              className={`shrink-0 rounded text-indigo ${pressable}`}
            >
              <Navigation size={16} />
            </button>
          )}
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
