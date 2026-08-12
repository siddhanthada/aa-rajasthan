"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Clock } from "lucide-react";
import type { MeetingWithDetails } from "@/lib/data/meetings";
import { formatDayTimeCompact } from "@/lib/format";
import { formatDistanceKm } from "@/lib/geo";
import { MeetingTags, VerificationStatus, verificationLabel, tagsSummary } from "./MeetingCard";

const COLUMNS: { label: string; width: string }[] = [
  { label: "Group", width: "w-[220px]" },
  { label: "Day & time", width: "w-[170px]" },
  { label: "Venue", width: "" },
  { label: "Tags", width: "w-[220px]" },
  { label: "Verified", width: "w-[150px]" },
];

export default function MeetingTable({
  meetings,
  today,
  distances,
}: {
  meetings: MeetingWithDetails[];
  today: number;
  distances?: Record<string, number>;
}) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[900px] table-fixed border-collapse text-left">
        <thead>
          <tr className="bg-paper">
            {COLUMNS.map((col) => (
              <th
                key={col.label}
                className={`px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-ink-muted ${col.width}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {meetings.map((m) => {
            const isToday = m.daysOfWeek.includes(today);
            const dayTime = formatDayTimeCompact(
              m.daysOfWeek,
              m.startTime,
              m.endTime,
            );
            const distanceKm = distances?.[m.id];
            const venueLine =
              (m.format === "online"
                ? `Online · ${m.districtName}`
                : `${m.venueName}, ${m.venueLocality}${
                    m.format === "hybrid" ? " · also online" : ""
                  } · ${m.districtName}`) +
              (distanceKm !== undefined && Number.isFinite(distanceKm)
                ? ` · ${formatDistanceKm(distanceKm)}`
                : "");

            return (
              <tr
                key={m.id}
                onClick={() => router.push(`/meetings/${m.id}`)}
                className="cursor-pointer border-b border-border last:border-b-0 hover:bg-paper"
              >
                <td className="w-[220px] px-4 py-3 align-top">
                  <Link
                    href={`/meetings/${m.id}`}
                    className="flex min-w-0 items-start gap-1.5"
                  >
                    <span
                      title={m.groupName}
                      className="line-clamp-3 text-sm font-semibold text-ink"
                    >
                      {m.groupName}
                    </span>
                    {isToday && (
                      <span className="shrink-0 rounded-full bg-indigo px-2 py-0.5 text-[10px] font-medium text-white">
                        Today
                      </span>
                    )}
                  </Link>
                </td>
                <td className="w-[170px] px-4 py-3 align-top">
                  <span
                    title={dayTime}
                    className="flex items-start gap-1.5 text-sm font-medium text-ink"
                  >
                    <Clock size={14} className="mt-0.5 shrink-0 text-ink" />
                    <span className="line-clamp-3">{dayTime}</span>
                  </span>
                </td>
                <td
                  title={venueLine}
                  className="line-clamp-3 px-4 py-3 align-top text-[13px] text-ink-muted"
                >
                  {venueLine}
                </td>
                <td
                  title={tagsSummary(m)}
                  className="w-[220px] max-h-[70px] overflow-hidden px-4 py-3 align-top"
                >
                  <MeetingTags meeting={m} compact />
                </td>
                <td
                  title={verificationLabel(m)}
                  className="w-[150px] px-4 py-3 align-top"
                >
                  <span className="line-clamp-3">
                    <VerificationStatus meeting={m} compact />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
