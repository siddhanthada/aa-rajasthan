"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  SlidersHorizontal,
  SearchX,
  Search,
  Calendar,
  Languages,
  CalendarCheck,
  Locate,
  LocateFixed,
  MapPin,
  X,
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
import { hoverTransition, pressable, FILTERS_START, CARDS_START } from "@/lib/motion";

type GeoStatus = "idle" | "loading" | "active" | "error";

const STAGGER_CAP = 4;
const STAGGER_STEP = 20;

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

  const DISTRICT_OPTIONS: DropdownOption[] = districts.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const DAY_OPTIONS: DropdownOption[] = [0, 1, 2, 3, 4, 5, 6].map((d) => ({
    value: String(d),
    label: fullDayLabels[d],
  }));

  const LANGUAGE_OPTIONS: DropdownOption[] = [
    { value: "hi", label: tBadges("languageHindi") },
    { value: "en", label: tBadges("languageEnglish") },
  ];

  const FORMAT_OPTIONS: DropdownOption[] = [
    { value: "in_person", label: tBadges("inPerson") },
    { value: "online", label: tBadges("online") },
    { value: "hybrid", label: tBadges("hybrid") },
  ];

  const [districtIds, setDistrictIds] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [formats, setFormats] = useState<string[]>([]);
  const [todayOnly, setTodayOnly] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("cards");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  // Initial-load stagger window: the first 6 result items get a staggered
  // entrance only while this is true, so later filter-driven re-renders
  // (handled by the cross-fade below) don't replay it. Must stay true long
  // enough to cover the full nav → tiles → filters → cards sequence, or
  // the class gets removed before the delayed card animations ever start.
  const SEQUENCE_END = CARDS_START + STAGGER_CAP * STAGGER_STEP + 190;
  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setInitialLoad(false), SEQUENCE_END + 50);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce the search text so filtering doesn't recompute on every
  // keystroke; the input itself stays instantly responsive.
  useEffect(() => {
    const timer = setTimeout(
      () => setSearch(searchInput.trim().toLowerCase()),
      150,
    );
    return () => clearTimeout(timer);
  }, [searchInput]);

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
      if (districtIds.length > 0 && !districtIds.includes(m.districtId))
        return false;
      if (
        days.length > 0 &&
        !m.daysOfWeek.some((d) => days.includes(String(d)))
      )
        return false;
      if (
        languages.length > 0 &&
        !m.languages.some((l) => languages.includes(l))
      )
        return false;
      if (formats.length > 0 && !formats.includes(m.format)) return false;
      if (todayOnly && !m.daysOfWeek.includes(today)) return false;
      if (search) {
        const haystack = [m.groupName, m.venueName, m.venueLocality]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });
  }, [
    meetings,
    districtIds,
    days,
    languages,
    formats,
    todayOnly,
    today,
    search,
  ]);

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
  // very first render so initial load uses the stagger-in instead. Guarded
  // by comparing the signature itself (not a boolean "have I run" flag) so
  // React Strict Mode's double effect-invocation on mount can't replay the
  // cross-fade against an unchanged result set.
  const resultsSignature = sorted.map((m) => m.id).join(",");
  const [displayed, setDisplayed] = useState(sorted);
  const [resultsVisible, setResultsVisible] = useState(true);
  const lastSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (lastSignatureRef.current === resultsSignature) {
      return;
    }
    const isFirstRun = lastSignatureRef.current === null;
    lastSignatureRef.current = resultsSignature;

    if (isFirstRun) {
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

  const dropdownFilterCount =
    districtIds.length + days.length + languages.length + formats.length;
  const hasActiveFilters =
    dropdownFilterCount > 0 || todayOnly || searchInput.trim() !== "";

  function clearFilters() {
    setDistrictIds([]);
    setDays([]);
    setLanguages([]);
    setFormats([]);
    setTodayOnly(false);
    setSearchInput("");
  }

  const languageLabels: Record<string, string> = {
    hi: tBadges("languageHindi"),
    en: tBadges("languageEnglish"),
  };
  const formatLabels: Record<string, string> = {
    in_person: tBadges("inPerson"),
    online: tBadges("online"),
    hybrid: tBadges("hybrid"),
  };

  const activeFilterChips: { key: string; label: string; onClear: () => void }[] = [
    ...(searchInput.trim() !== ""
      ? [
          {
            key: "search",
            label: t("searchChipLabel", { query: searchInput.trim() }),
            onClear: () => setSearchInput(""),
          },
        ]
      : []),
    ...(todayOnly
      ? [{ key: "today", label: t("today"), onClear: () => setTodayOnly(false) }]
      : []),
    ...districtIds.map((id) => ({
      key: `district-${id}`,
      label: districts.find((d) => d.id === id)?.name ?? "",
      onClear: () =>
        setDistrictIds((prev) => prev.filter((v) => v !== id)),
    })),
    ...days.map((d) => ({
      key: `day-${d}`,
      label: fullDayLabels[Number(d)],
      onClear: () => setDays((prev) => prev.filter((v) => v !== d)),
    })),
    ...languages.map((l) => ({
      key: `language-${l}`,
      label: languageLabels[l],
      onClear: () => setLanguages((prev) => prev.filter((v) => v !== l)),
    })),
    ...formats.map((f) => ({
      key: `format-${f}`,
      label: formatLabels[f],
      onClear: () => setFormats((prev) => prev.filter((v) => v !== f)),
    })),
  ];

  return (
    <div>
      <div
        className="relative mt-4 mb-4 animate-fade-rise"
        style={{ animationDelay: `${FILTERS_START}ms` }}
      >
        <Search
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchAria")}
          className={`h-11 w-full rounded-lg border border-border bg-white pl-11 pr-10 text-sm text-ink placeholder:text-ink-muted focus:border-indigo ${hoverTransition}`}
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => setSearchInput("")}
            aria-label={t("clearSearchAria")}
            className={`absolute right-3 top-1/2 -translate-y-1/2 rounded text-ink-muted ${pressable}`}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div
        className="relative z-30 flex flex-wrap items-center gap-2 animate-fade-rise"
        style={{ animationDelay: `${FILTERS_START}ms` }}
      >
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

        <div className="ml-2 hidden items-center gap-2 md:flex">
          <FilterDropdown
            ariaLabel={t("districtAria")}
            values={districtIds}
            options={DISTRICT_OPTIONS}
            onChange={setDistrictIds}
            allLabel={t("allDistricts")}
            countLabel={(count) => t("districtsCount", { count })}
            clearLabel={t("clear")}
            className="w-40"
            icon={MapPin}
          />
          <FilterDropdown
            ariaLabel={t("dayAria")}
            values={days}
            options={DAY_OPTIONS}
            onChange={setDays}
            allLabel={t("allDays")}
            countLabel={(count) => t("daysCount", { count })}
            clearLabel={t("clear")}
            className="w-40"
            icon={Calendar}
          />
          <FilterDropdown
            ariaLabel={t("languageAria")}
            values={languages}
            options={LANGUAGE_OPTIONS}
            onChange={setLanguages}
            allLabel={t("allLanguages")}
            countLabel={(count) => t("languagesCount", { count })}
            clearLabel={t("clear")}
            className="w-44"
            icon={Languages}
          />
          <FilterDropdown
            ariaLabel={t("formatAria")}
            values={formats}
            options={FORMAT_OPTIONS}
            onChange={setFormats}
            allLabel={t("allFormats")}
            countLabel={(count) => t("formatsCount", { count })}
            clearLabel={t("clear")}
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
      </div>

      {activeFilterChips.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {activeFilterChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.onClear}
              aria-label={t("removeFilterAria", { label: chip.label })}
              className={`flex items-center gap-1 rounded-full bg-indigo/10 px-2.5 py-1.5 text-xs font-medium text-indigo ${hoverTransition} ${pressable}`}
            >
              {chip.label}
              <X size={12} />
            </button>
          ))}
          {activeFilterChips.length >= 2 && (
            <button
              type="button"
              onClick={clearFilters}
              className={`text-[13px] text-ink-muted hover:text-ink ${hoverTransition}`}
            >
              {t("clearAll")}
            </button>
          )}
        </div>
      )}

      {geoStatus === "error" && (
        <p className="mt-2 text-sm text-terracotta">{t("geoError")}</p>
      )}

      <MobileFilterSheet
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        districtOptions={DISTRICT_OPTIONS}
        dayOptions={DAY_OPTIONS}
        languageOptions={LANGUAGE_OPTIONS}
        formatOptions={FORMAT_OPTIONS}
        districtIds={districtIds}
        days={days}
        languages={languages}
        formats={formats}
        onDistrictChange={setDistrictIds}
        onDayChange={setDays}
        onLanguageChange={setLanguages}
        onFormatChange={setFormats}
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
                    initialLoad
                      ? CARDS_START + Math.min(index, STAGGER_CAP) * STAGGER_STEP
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
                staggerEntrance={initialLoad}
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
