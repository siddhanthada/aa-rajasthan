"use client";

import { useMemo, useState } from "react";
import type { District } from "@/lib/data/types";
import type { MeetingWithDetails } from "@/lib/data/meetings";
import { dayName } from "@/lib/format";
import MeetingCard from "./MeetingCard";

type FormatFilter = "" | "in_person" | "online" | "hybrid";
type LanguageFilter = "" | "hi" | "en";

export default function Finder({
  districts,
  meetings,
  today,
}: {
  districts: District[];
  meetings: MeetingWithDetails[];
  today: number;
}) {
  const [districtId, setDistrictId] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [language, setLanguage] = useState<LanguageFilter>("");
  const [format, setFormat] = useState<FormatFilter>("");

  const filtered = useMemo(() => {
    return meetings.filter((m) => {
      if (districtId && m.districtId !== districtId) return false;
      if (day !== "" && !m.daysOfWeek.includes(Number(day))) return false;
      if (language && !m.languages.includes(language)) return false;
      if (format && m.format !== format) return false;
      return true;
    });
  }, [meetings, districtId, day, language, format]);

  const hasActiveFilters = Boolean(districtId || day || language || format);

  function clearFilters() {
    setDistrictId("");
    setDay("");
    setLanguage("");
    setFormat("");
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDistrictId("")}
          aria-pressed={districtId === ""}
          className={`border px-3 py-1.5 text-sm ${
            districtId === ""
              ? "border-indigo bg-indigo text-paper"
              : "border-border text-ink hover:border-indigo"
          }`}
        >
          All districts
        </button>
        {districts.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDistrictId(d.id)}
            aria-pressed={districtId === d.id}
            className={`border px-3 py-1.5 text-sm ${
              districtId === d.id
                ? "border-indigo bg-indigo text-paper"
                : "border-border text-ink hover:border-indigo"
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          Day
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="border border-border bg-paper px-2 py-1.5 text-sm text-ink"
          >
            <option value="">All days</option>
            {[0, 1, 2, 3, 4, 5, 6].map((d) => (
              <option key={d} value={d}>
                {dayName(d)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-ink-muted">
          Language
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageFilter)}
            className="border border-border bg-paper px-2 py-1.5 text-sm text-ink"
          >
            <option value="">All languages</option>
            <option value="hi">Hindi</option>
            <option value="en">English</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-ink-muted">
          Format
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as FormatFilter)}
            className="border border-border bg-paper px-2 py-1.5 text-sm text-ink"
          >
            <option value="">All formats</option>
            <option value="in_person">In person</option>
            <option value="online">Online</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </label>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-indigo underline underline-offset-2"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="mt-4 text-sm text-ink-muted">
        {filtered.length} meeting{filtered.length === 1 ? "" : "s"} found
      </p>

      {filtered.length > 0 ? (
        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <MeetingCard
              key={m.id}
              meeting={m}
              isToday={m.daysOfWeek.includes(today)}
            />
          ))}
        </ul>
      ) : (
        <div className="mt-3 border border-border p-6 text-center">
          <p className="text-ink">No meetings match these filters.</p>
          <p className="mt-1 text-sm text-ink-muted">
            Try a different district, or clear filters to see all meetings.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 border border-indigo px-3 py-1.5 text-sm text-indigo"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
