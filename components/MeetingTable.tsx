"use client";

import Link from "next/link";
import { Clock, Navigation } from "lucide-react";
import type { MeetingWithDetails } from "@/lib/data/meetings";
import { formatDayTimeCompact } from "@/lib/format";
import { formatDistanceKm } from "@/lib/geo";
import { MeetingTags, VerificationStatus, verificationLabel, tagsSummary } from "./MeetingCard";

const GRID_COLUMNS =
  "minmax(220px, 260px) minmax(240px, 280px) minmax(260px, 1.4fr) minmax(220px, 260px) minmax(130px, 150px)";

const COLUMNS = ["Group", "Day & time", "Venue", "Tags", "Verified"];

function isModifiedClick(e: React.MouseEvent) {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1;
}

export default function MeetingTable({
  meetings,
  today,
  distances,
  onSelect,
}: {
  meetings: MeetingWithDetails[];
  today: number;
  distances?: Record<string, number>;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-white">
      <div role="table">
        <div
          role="row"
          className="sticky top-[68px] z-10 grid gap-x-6 rounded-t-xl bg-paper px-4 py-2.5"
          style={{ gridTemplateColumns: GRID_COLUMNS }}
        >
          {COLUMNS.map((col) => (
            <div
              key={col}
              role="columnheader"
              className="text-xs font-medium uppercase tracking-wide text-ink-muted"
            >
              {col}
            </div>
          ))}
        </div>

        {meetings.map((m, index) => {
            const isToday = m.daysOfWeek.includes(today);
            const dayTime = formatDayTimeCompact(
              m.daysOfWeek,
              m.startTime,
              m.endTime,
            );
            const distanceKm = distances?.[m.id];
            const venueLine =
              m.format === "online"
                ? `Online · ${m.districtName}`
                : `${m.venueName}, ${m.venueLocality}${
                    m.format === "hybrid" ? " · also online" : ""
                  } · ${m.districtName}`;
            const venueTitle =
              venueLine +
              (distanceKm !== undefined && Number.isFinite(distanceKm)
                ? ` · ${formatDistanceKm(distanceKm)}`
                : "");

            return (
              <div
                key={m.id}
                role="row"
                onClick={() => onSelect(m.id)}
                className={`grid cursor-pointer gap-x-6 border-t border-border px-4 py-3 hover:bg-paper ${
                  index === meetings.length - 1 ? "rounded-b-xl" : ""
                }`}
                style={{ gridTemplateColumns: GRID_COLUMNS }}
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
                        Today
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
                      <> · {formatDistanceKm(distanceKm)}</>
                    )}
                  </span>
                  {m.mapLink && (
                    <a
                      href={m.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Get directions to ${m.venueName ?? "venue"}`}
                      className="shrink-0 text-indigo"
                    >
                      <Navigation size={16} />
                    </a>
                  )}
                </div>

                <div
                  role="cell"
                  title={tagsSummary(m)}
                  className="max-h-[70px] overflow-hidden"
                >
                  <MeetingTags meeting={m} compact />
                </div>

                <div role="cell" title={verificationLabel(m)}>
                  <span className="line-clamp-3">
                    <VerificationStatus meeting={m} compact />
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
