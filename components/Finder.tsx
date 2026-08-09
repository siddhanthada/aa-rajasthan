"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { District } from "@/lib/data/types";
import type { MeetingWithDetails } from "@/lib/data/meetings";
import { dayName } from "@/lib/format";
import MeetingCard from "./MeetingCard";
import MeetingTable from "./MeetingTable";
import FilterDropdown, { type DropdownOption } from "./FilterDropdown";
import MobileFilterSheet from "./MobileFilterSheet";
import ViewToggle, { type ViewMode } from "./ViewToggle";

type FormatFilter = "" | "in_person" | "online" | "hybrid";
type LanguageFilter = "" | "hi" | "en";

const DAY_OPTIONS: DropdownOption[] = [
  { value: "", label: "All days" },
  ...[0, 1, 2, 3, 4, 5, 6].map((d) => ({ value: String(d), label: dayName(d) })),
];

const LANGUAGE_OPTIONS: DropdownOption[] = [
  { value: "", label: "All languages" },
  { value: "hi", label: "Hindi" },
  { value: "en", label: "English" },
];

const FORMAT_OPTIONS: DropdownOption[] = [
  { value: "", label: "All formats" },
  { value: "in_person", label: "In person" },
  { value: "online", label: "Online" },
  { value: "hybrid", label: "Hybrid" },
];

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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("cards");

  const filtered = useMemo(() => {
    return meetings.filter((m) => {
      if (districtId && m.districtId !== districtId) return false;
      if (day !== "" && !m.daysOfWeek.includes(Number(day))) return false;
      if (language && !m.languages.includes(language)) return false;
      if (format && m.format !== format) return false;
      return true;
    });
  }, [meetings, districtId, day, language, format]);

  const dropdownFilterCount = [day, language, format].filter(Boolean).length;
  const hasActiveFilters = Boolean(districtId) || dropdownFilterCount > 0;

  function clearFilters() {
    setDistrictId("");
    setDay("");
    setLanguage("");
    setFormat("");
  }

  return (
    <div>
      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setDistrictId("")}
          aria-pressed={districtId === ""}
          className={`h-10 shrink-0 whitespace-nowrap rounded-lg border px-3.5 text-sm ${
            districtId === ""
              ? "border-indigo bg-indigo text-white"
              : "border-border bg-white text-ink"
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
            className={`h-10 shrink-0 whitespace-nowrap rounded-lg border px-3.5 text-sm ${
              districtId === d.id
                ? "border-indigo bg-indigo text-white"
                : "border-border bg-white text-ink"
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="mt-4 hidden items-center gap-3 md:flex">
        <FilterDropdown
          ariaLabel="Day"
          value={day}
          options={DAY_OPTIONS}
          onChange={setDay}
          className="w-40"
        />
        <FilterDropdown
          ariaLabel="Language"
          value={language}
          options={LANGUAGE_OPTIONS}
          onChange={(v) => setLanguage(v as LanguageFilter)}
          className="w-44"
        />
        <FilterDropdown
          ariaLabel="Format"
          value={format}
          options={FORMAT_OPTIONS}
          onChange={(v) => setFormat(v as FormatFilter)}
          className="w-40"
        />

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

      <div className="mt-4 md:hidden">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-3.5 text-sm text-ink"
        >
          <SlidersHorizontal size={16} className="text-ink-muted" />
          Filters
          {dropdownFilterCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo text-[10px] font-medium text-white">
              {dropdownFilterCount}
            </span>
          )}
        </button>
      </div>

      <MobileFilterSheet
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        dayOptions={DAY_OPTIONS}
        languageOptions={LANGUAGE_OPTIONS}
        formatOptions={FORMAT_OPTIONS}
        day={day}
        language={language}
        format={format}
        onDayChange={setDay}
        onLanguageChange={(v) => setLanguage(v as LanguageFilter)}
        onFormatChange={(v) => setFormat(v as FormatFilter)}
      />

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-ink-muted">
          {filtered.length} meeting{filtered.length === 1 ? "" : "s"} found
        </p>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {filtered.length > 0 ? (
        view === "cards" ? (
          <ul className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => (
              <MeetingCard
                key={m.id}
                meeting={m}
                isToday={m.daysOfWeek.includes(today)}
              />
            ))}
          </ul>
        ) : (
          <div className="mt-3">
            <MeetingTable meetings={filtered} today={today} />
          </div>
        )
      ) : (
        <div className="mt-3 rounded-xl border border-border bg-white p-6 text-center">
          <p className="text-ink">No meetings match these filters.</p>
          <p className="mt-1 text-sm text-ink-muted">
            Try a different district, or clear filters to see all meetings.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 rounded-lg border border-indigo px-3 py-1.5 text-sm text-indigo"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
