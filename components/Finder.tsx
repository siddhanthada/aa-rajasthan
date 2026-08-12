"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
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
import { haversineDistanceKm } from "@/lib/geo";
import MeetingCard from "./MeetingCard";
import MeetingTable from "./MeetingTable";
import MeetingOverlay from "./MeetingOverlay";
import FilterDropdown, { type DropdownOption } from "./FilterDropdown";
import MobileFilterSheet from "./MobileFilterSheet";
import ViewToggle, { type ViewMode } from "./ViewToggle";
import { hoverTransition, pressable } from "@/lib/motion";

type FormatFilter = "" | "in_person" | "online" | "hybrid";
type LanguageFilter = "" | "hi" | "en";
type GeoStatus = "idle" | "loading" | "active" | "error";

const STAGGER_CAP = 6;

export default function Finder({
  districts,
  meetings,
  today,
}: {
  districts: District[];
  meetings: MeetingWithDetails[];
  today: number;
}) {
  const t = useTranslations("filters");
  const tEmpty = useTranslations("emptyState");
  const tBadges = useTranslations("badges");
  const tDays = useTranslations("days");
  const fullDayLabels = tDays.raw("full") as string[];

  const DAY_OPTIONS: DropdownOption[] = [
    { value: "", label: t("allDays") },
    ...[0, 1, 2, 3, 4, 5, 6].map((d) => ({
      value: String(d),
      label: fullDayLabels[d],
    })),
  ];

  const LANGUAGE_OPTIONS: DropdownOption[] = [
    { value: "", label: t("allLanguages") },
    { value: "hi", label: tBadges("languageHindi") },
    { value: "en", label: tBadges("languageEnglish") },
  ];

  const FORMAT_OPTIONS: DropdownOption[] = [
    { value: "", label: t("allFormats") },
    { value: "in_person", label: tBadges("inPerson") },
    { value: "online", label: tBadges("online") },
    { value: "hybrid", label: tBadges("hybrid") },
  ];

  const [districtId, setDistrictId] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [language, setLanguage] = useState<LanguageFilter>("");
  const [format, setFormat] = useState<FormatFilter>("");
  const [todayOnly, setTodayOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("cards");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  // Initial-load stagger window: the first 6 result items get a staggered
  // entrance only while this is true, so later filter-driven re-renders
  // (handled by the cross-fade below) don't replay it.
  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setInitialLoad(false), 600);
    return () => clearTimeout(timer);
  }, []);

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

  // Cross-fade the result area when the filtered set changes: briefly fade
  // out the old results, swap, then fade the new ones in. Skipped on the
  // very first render so initial load uses the stagger-in instead.
  const resultsSignature = sorted.map((m) => m.id).join(",");
  const [displayed, setDisplayed] = useState(sorted);
  const [resultsVisible, setResultsVisible] = useState(true);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayed(sorted);
      return;
    }
    setResultsVisible(false);
    const hideTimer = setTimeout(() => {
      setDisplayed(sorted);
      setResultsVisible(true);
    }, 100);
    return () => clearTimeout(hideTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultsSignature]);

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
      <div className="mt-5 flex flex-wrap items-center gap-2 animate-fade-rise">
        <button
          type="button"
          onClick={() => setTodayOnly((v) => !v)}
          aria-pressed={todayOnly}
          className={`flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3.5 text-sm ${hoverTransition} ${pressable} ${
            todayOnly
              ? "border-indigo bg-indigo text-white"
              : "border-border bg-white text-ink hover:border-indigo"
          }`}
        >
          <CalendarCheck size={16} />
          {t("today")}
        </button>

        <button
          type="button"
          onClick={handleNearMe}
          aria-pressed={geoStatus === "active"}
          className={`flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3.5 text-sm ${hoverTransition} ${pressable} ${
            geoStatus === "active"
              ? "border-indigo bg-indigo text-white"
              : "border-border bg-white text-ink hover:border-indigo"
          }`}
        >
          {geoStatus === "active" ? (
            <LocateFixed size={16} />
          ) : (
            <Locate size={16} />
          )}
          {geoStatus === "loading" ? t("locating") : t("nearMe")}
        </button>

        <button
          type="button"
          onClick={() => setDistrictId("")}
          aria-pressed={districtId === ""}
          className={`h-9 shrink-0 whitespace-nowrap rounded-lg border px-3.5 text-sm ${hoverTransition} ${pressable} ${
            districtId === ""
              ? "border-indigo bg-indigo text-white"
              : "border-border bg-white text-ink hover:border-indigo"
          }`}
        >
          {t("allDistricts")}
        </button>
        {districts.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDistrictId(d.id)}
            aria-pressed={districtId === d.id}
            className={`h-9 shrink-0 whitespace-nowrap rounded-lg border px-3.5 text-sm ${hoverTransition} ${pressable} ${
              districtId === d.id
                ? "border-indigo bg-indigo text-white"
                : "border-border bg-white text-ink hover:border-indigo"
            }`}
          >
            {d.name}
          </button>
        ))}

        <div className="mx-1 h-6 w-px shrink-0 bg-border" aria-hidden="true" />

        <div className="hidden items-center gap-2 md:flex">
          <FilterDropdown
            ariaLabel={t("dayAria")}
            value={day}
            options={DAY_OPTIONS}
            onChange={setDay}
            className="w-40"
            icon={Calendar}
          />
          <FilterDropdown
            ariaLabel={t("languageAria")}
            value={language}
            options={LANGUAGE_OPTIONS}
            onChange={(v) => setLanguage(v as LanguageFilter)}
            className="w-44"
            icon={Languages}
          />
          <FilterDropdown
            ariaLabel={t("formatAria")}
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
            className={`flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-3.5 text-sm text-ink hover:border-indigo ${hoverTransition} ${pressable}`}
          >
            <SlidersHorizontal size={16} className="text-ink-muted" />
            {t("filtersLabel")}
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
            className={`hidden text-sm text-indigo underline underline-offset-2 md:inline ${hoverTransition}`}
          >
            {t("clearFilters")}
          </button>
        )}
      </div>

      {geoStatus === "error" && (
        <p className="mt-2 text-sm text-terracotta">{t("geoError")}</p>
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
          {t("meetingsFound", { count: sorted.length })}
        </p>
        <ViewToggle view={view} onChange={setView} />
      </div>

      <div
        className="motion-safe:transition-opacity motion-safe:ease-standard"
        style={{
          opacity: resultsVisible ? 1 : 0,
          transitionDuration: resultsVisible
            ? "var(--duration-slow)"
            : "100ms",
        }}
      >
        {displayed.length > 0 ? (
          view === "cards" ? (
            <ul className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayed.map((m, index) => (
                <MeetingCard
                  key={m.id}
                  meeting={m}
                  isToday={m.daysOfWeek.includes(today)}
                  distanceKm={distances?.[m.id]}
                  onSelect={setSelectedId}
                  entranceDelay={
                    initialLoad && index < STAGGER_CAP
                      ? index * 40
                      : undefined
                  }
                />
              ))}
            </ul>
          ) : (
            <div className="mt-3">
              <MeetingTable
                meetings={displayed}
                today={today}
                distances={distances}
                onSelect={setSelectedId}
                staggerFirst={initialLoad ? STAGGER_CAP : 0}
              />
            </div>
          )
        ) : (
          <div className="mt-3 flex flex-col items-center gap-3 rounded-xl border border-border bg-white px-6 py-10 text-center">
            <SearchX size={32} className="text-ink-muted/50" />
            <p className="text-sm text-ink-muted">{tEmpty("message")}</p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className={`rounded-lg border border-indigo px-3 py-1.5 text-sm text-indigo ${hoverTransition} ${pressable}`}
              >
                {t("clearFilters")}
              </button>
            )}
            <p className="mt-2 text-sm text-ink-muted">
              {tEmpty("helplineCallout", { number: "+91 141 400 0000" })}
            </p>
          </div>
        )}
      </div>

      <MeetingOverlay
        meeting={meetings.find((m) => m.id === selectedId) ?? null}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
