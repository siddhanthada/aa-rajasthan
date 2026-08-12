"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Clock, Navigation } from "lucide-react";
import type { MeetingWithDetails } from "@/lib/data/meetings";
import { formatDayTimeCompact } from "@/lib/format";
import { formatDistanceKm } from "@/lib/geo";
import { MeetingTags, VerificationStatus, verificationLabel, tagsSummary } from "./MeetingCard";
import { hoverTransition, pressable } from "@/lib/motion";

function isModifiedClick(e: React.MouseEvent) {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1;
}

const STAGGER_CAP = 6;

export default function MeetingTable({
  meetings,
  today,
  distances,
  onSelect,
  staggerEntrance = false,
}: {
  meetings: MeetingWithDetails[];
  today: number;
  distances?: Record<string, number>;
  onSelect: (id: string) => void;
  staggerEntrance?: boolean;
}) {
  const t = useTranslations("table");
  const tCard = useTranslations("card");
  const tBadges = useTranslations("badges");
  const tDays = useTranslations("days");
  const dayLabels = tDays.raw("short") as string[];

  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);

  function syncHeaderScroll() {
    if (headerScrollRef.current && bodyScrollRef.current) {
      headerScrollRef.current.scrollLeft = bodyScrollRef.current.scrollLeft;
    }
  }

  const GRID_COLUMNS =
    "minmax(220px, 260px) minmax(240px, 280px) minmax(260px, 1.4fr) minmax(220px, 260px) minmax(130px, 150px)";

  const COLUMNS = [
    t("columnGroup"),
    t("columnDayTime"),
    t("columnVenue"),
    t("columnTags"),
    t("columnVerified"),
  ];

  return (
    <div className="rounded-xl border border-border bg-white">
      <div role="table">
        {/* Sticky against page scroll; horizontal position is mirrored from
            the body's real scroll container below, since an element can't
            both be sticky-to-page and its own horizontal scroll container. */}
        <div
          ref={headerScrollRef}
          className="sticky top-[68px] z-10 overflow-hidden rounded-t-xl bg-paper"
        >
          <div
            role="row"
            className="grid gap-x-6 px-4 py-2.5"
            style={{ gridTemplateColumns: GRID_COLUMNS }}
          >
            {COLUMNS.map((col) => (
              <div
                key={col}
                role="columnheader"
                className="whitespace-nowrap text-xs font-medium uppercase tracking-wide text-ink-muted"
              >
                {col}
              </div>
            ))}
          </div>
        </div>

        <div
          ref={bodyScrollRef}
          onScroll={syncHeaderScroll}
          className="overflow-x-auto rounded-b-xl"
        >
          {meetings.map((m, index) => {
            const isToday = m.daysOfWeek.includes(today);
            const dayTime = formatDayTimeCompact(
              m.daysOfWeek,
              m.startTime,
              m.endTime,
              dayLabels,
            );
            const distanceKm = distances?.[m.id];
            const venueLine =
              m.format === "online"
                ? `${tCard("online")} · ${m.districtName}`
                : `${m.venueName}, ${m.venueLocality}${
                    m.format === "hybrid" ? ` · ${tCard("alsoOnline")}` : ""
                  } · ${m.districtName}`;
            const venueTitle =
              venueLine +
              (distanceKm !== undefined && Number.isFinite(distanceKm)
                ? ` · ${formatDistanceKm(distanceKm, tCard("kmAway"))}`
                : "");

            return (
              <div
                key={m.id}
                role="row"
                onClick={() => onSelect(m.id)}
                className={`grid cursor-pointer gap-x-6 border-t border-border px-4 py-3 hover:bg-paper ${hoverTransition} ${
                  staggerEntrance ? "animate-card-enter" : ""
                }`}
                style={{
                  gridTemplateColumns: GRID_COLUMNS,
                  ...(staggerEntrance
                    ? { animationDelay: `${Math.min(index, STAGGER_CAP) * 40}ms` }
                    : {}),
                }}
              >
                <div role="cell">
                  <Link
                    href={`/meetings/${m.id}`}
                    onClick={(e) => {
                      if (isModifiedClick(e)) {
                        e.stopPropagation();
                        return;
                      }
                      e.preventDefault();
                      e.stopPropagation();
                      onSelect(m.id);
                    }}
                    title={m.groupName}
                    className="line-clamp-3 text-sm font-semibold text-ink"
                  >
                    {m.groupName}
                    {isToday && (
                      <span className="ml-1.5 inline-flex items-center rounded-full bg-indigo px-2 py-0.5 align-middle text-[10px] font-medium text-white">
                        {tCard("today")}
                      </span>
                    )}
                  </Link>
                </div>

                <div role="cell" title={dayTime} className="flex items-start gap-1.5">
                  <Clock size={14} className="mt-0.5 shrink-0 text-ink" />
                  <span className="line-clamp-3 text-sm font-medium text-ink">
                    {dayTime}
                  </span>
                </div>

                <div
                  role="cell"
                  title={venueTitle}
                  className="flex items-start gap-1.5"
                >
                  <span className="line-clamp-3 text-[13px] text-ink-muted">
                    {venueLine}
                    {distanceKm !== undefined && Number.isFinite(distanceKm) && (
                      <> · {formatDistanceKm(distanceKm, tCard("kmAway"))}</>
                    )}
                  </span>
                  {m.mapLink && (
                    <a
                      href={m.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={tCard("getDirectionsAria", {
                        venue: m.venueName ?? "",
                      })}
                      className={`shrink-0 rounded text-indigo ${pressable}`}
                    >
                      <Navigation size={16} />
                    </a>
                  )}
                </div>

                <div
                  role="cell"
                  title={tagsSummary(m, tBadges)}
                  className="max-h-[70px] overflow-hidden"
                >
                  <MeetingTags meeting={m} compact />
                </div>

                <div role="cell" title={verificationLabel(m, tBadges)}>
                  <span className="line-clamp-3">
                    <VerificationStatus meeting={m} compact />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
