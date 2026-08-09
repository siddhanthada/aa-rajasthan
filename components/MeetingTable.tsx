import { Clock, MapPin } from "lucide-react";
import type { MeetingWithDetails } from "@/lib/data/meetings";
import { formatDays, formatTimeRange } from "@/lib/format";
import { MeetingTags, VerificationStatus } from "./MeetingCard";

const COLUMNS = ["Group", "Day & time", "Venue", "Tags", "Verified"];

export default function MeetingTable({
  meetings,
  today,
}: {
  meetings: MeetingWithDetails[];
  today: number;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="bg-paper">
            {COLUMNS.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-ink-muted"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {meetings.map((m) => {
            const isToday = m.daysOfWeek.includes(today);
            const venueLine =
              m.format === "online"
                ? "Online"
                : `${m.venueName}, ${m.venueLocality}`;
            return (
              <tr key={m.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3 align-top">
                  <span className="text-sm font-semibold text-ink">
                    {m.groupName}
                  </span>
                  {isToday && (
                    <span className="ml-2 rounded-full bg-indigo px-2 py-0.5 text-xs font-medium text-white">
                      Today
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 align-top">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
                    <Clock size={16} className="shrink-0 text-ink" />
                    {formatDays(m.daysOfWeek)} ·{" "}
                    {formatTimeRange(m.startTime, m.endTime)}
                  </span>
                </td>
                <td className="px-4 py-3 align-top">
                  <span className="flex items-start gap-1.5 text-[13px] text-ink-muted">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-ink-muted" />
                    <span>
                      {venueLine}
                      {m.format === "hybrid" && " · also online"}
                      {" · "}
                      {m.districtName}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3 align-top">
                  <MeetingTags meeting={m} />
                </td>
                <td className="px-4 py-3 align-top">
                  <VerificationStatus meeting={m} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
