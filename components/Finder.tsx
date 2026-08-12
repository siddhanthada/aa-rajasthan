"use client";

import { useMemo, useState } from "react";
import {
  SlidersHorizontal,
  SearchX,
  Calendar,
  Languages,
  CalendarCheck,
  Locate,
  LocateFixed,
} from "lucide-react";
import type { District } from "@/lib/data/types";
import type { MeetingWithDetails } from "@/lib/data/meetings";
import { dayName } from "@/lib/format";
import { haversineDistanceKm } from "@/lib/geo";
import MeetingCard from "./MeetingCard";
import MeetingTable from "./MeetingTable";
import FilterDropdown, { type DropdownOption } from "./FilterDropdown";
import MobileFilterSheet from "./MobileFilterSheet";
import ViewToggle, { type ViewMode } from "./ViewToggle";

type FormatFilter = "" | "in_person" | "online" | "hybrid";
type LanguageFilter = "" | "hi" | "en";
type GeoStatus = "idle" | "loading" | "active" | "error";

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
  const [todayOnly, setTodayOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("cards");

  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  function handleNearMe() {
    if (geoStatus === "active") {
      setGeoStatus("idle");
      setCoords(null);
      return;
    }
    if (!("geolocation" in navigator)) {
      setGeoStatus("error");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus("active");
      },
      () => {
        setGeoStatus("error");
        setCoords(null);
      },
      { timeout: 8000 },
    );
  }

  const filtered = useMemo(() => {
    return meetings.filter((m) => {
      if (districtId && m.districtId !== districtId) return false;
      if (day !== "" && !m.daysOfWeek.includes(Number(day))) return false;
      if (language && !m.languages.includes(language)) return false;
      if (format && m.format !== format) return false;
      if (todayOnly && !m.daysOfWeek.includes(today)) return false;
      return true;
    });
  }, [meetings, districtId, day, language, format, todayOnly, today]);

  const distances = useMemo(() => {
    if (!coords) return undefined;
    const map: Record<string, number> = {};
    for (const m of filtered) {
      map[m.id] =
        m.venueLat !== undefined && m.venueLng !== undefined
          ? haversineDistanceKm(coords.lat, coords.lng, m.venueLat, m.venueLng)
          : Infinity;
    }
    return map;
  }, [filtered, coords]);

  const sorted = useMemo(() => {
    if (!distances) return filtered;
    return [...filtered].sort(
      (a, b) => (distances[a.id] ?? Infinity) - (distances[b.id] ?? Infinity),
    );
  }, [filtered, distances]);

  const dropdownFilterCount = [day, language, format].filter(Boolean).length;
  const hasActiveFilters =
    Boolean(districtId) || dropdownFilterCount > 0 || todayOnly;

  function clearFilters() {
    setDistrictId("");
    setDay("");
    setLanguage("");
    setFormat("");
    setTodayOnly(false);
  }

  return (
    <div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setTodayOnly((v) => !v)}
          aria-pressed={todayOnly}
          className={`flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3.5 text-sm ${
            todayOnly
              ? "border-indigo bg-indigo text-white"
              : "border-border bg-white text-ink"
          }`}
        >
          <CalendarCheck size={16} />
          Today
        </button>

        <button
          type="button"
          onClick={handleNearMe}
          aria-pressed={geoStatus === "active"}
          className={`flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3.5 text-sm ${
            geoStatus === "active"
              ? "border-indigo bg-indigo text-white"
              : "border-border bg-white text-ink"
          }`}
        >
          {geoStatus === "active" ? (
            <LocateFixed size={16} />
          ) : (
            <Locate size={16} />
          )}
          {geoStatus === "loading" ? "Locating…" : "Near me"}
        </button>

        <button
          type="button"
          onClick={() => setDistrictId("")}
          aria-pressed={districtId === ""}
          className={`h-9 shrink-0 whitespace-nowrap rounded-lg border px-3.5 text-sm ${
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
            className={`h-9 shrink-0 whitespace-nowrap rounded-lg border px-3.5 text-sm ${
              districtId === d.id
                ? "border-indigo bg-indigo text-white"
                : "border-border bg-white text-ink"
            }`}
          >
            {d.name}
          </button>
        ))}

        <div className="mx-1 h-6 w-px shrink-0 bg-border" aria-hidden="true" />

        <div className="hidden items-center gap-2 md:flex">
          <FilterDropdown
            ariaLabel="Day"
            value={day}
            options={DAY_OPTIONS}
            onChange={setDay}
            className="w-40"
            icon={Calendar}
          />
          <FilterDropdown
            ariaLabel="Language"
            value={language}
            options={LANGUAGE_OPTIONS}
            onChange={(v) => setLanguage(v as LanguageFilter)}
            className="w-44"
            icon={Languages}
          />
          <FilterDropdown
            ariaLabel="Format"
            value={format}
            options={FORMAT_OPTIONS}
            onChange={(v) => setFormat(v as FormatFilter)}
            className="w-40"
            icon={SlidersHorizontal}
          />
        </div>

        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-3.5 text-sm text-ink"
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

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="hidden text-sm text-indigo underline underline-offset-2 md:inline"
          >
            Clear filters
          </button>
        )}
      </div>

      {geoStatus === "error" && (
        <p className="mt-2 text-sm text-terracotta">
          Couldn&rsquo;t get your location — showing all meetings instead.
        </p>
      )}

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
          {sorted.length} meeting{sorted.length === 1 ? "" : "s"} found
        </p>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {sorted.length > 0 ? (
        view === "cards" ? (
          <ul className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((m) => (
              <MeetingCard
                key={m.id}
                meeting={m}
                isToday={m.daysOfWeek.includes(today)}
                distanceKm={distances?.[m.id]}
              />
            ))}
          </ul>
        ) : (
          <div className="mt-3">
            <MeetingTable meetings={sorted} today={today} distances={distances} />
          </div>
        )
      ) : (
        <div className="mt-3 flex flex-col items-center gap-3 rounded-xl border border-border bg-white px-6 py-10 text-center">
          <SearchX size={32} className="text-ink-muted/50" />
          <p className="text-sm text-ink-muted">
            No meetings match these filters yet.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-indigo px-3 py-1.5 text-sm text-indigo"
            >
              Clear filters
            </button>
          )}
          <p className="mt-2 text-sm text-ink-muted">
            Need to talk to someone now? Call{" "}
            <a href="tel:+911414000000" className="font-medium text-indigo">
              +91 141 400 0000
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
