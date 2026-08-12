"use client";

import { useTranslations } from "next-intl";
import { X, MapPin, Calendar, Languages, SlidersHorizontal } from "lucide-react";
import FilterDropdown, { type DropdownOption } from "./FilterDropdown";
import { pressable } from "@/lib/motion";

export default function MobileFilterSheet({
  open,
  onClose,
  districtOptions,
  dayOptions,
  languageOptions,
  formatOptions,
  districtIds,
  days,
  languages,
  formats,
  onDistrictChange,
  onDayChange,
  onLanguageChange,
  onFormatChange,
}: {
  open: boolean;
  onClose: () => void;
  districtOptions: DropdownOption[];
  dayOptions: DropdownOption[];
  languageOptions: DropdownOption[];
  formatOptions: DropdownOption[];
  districtIds: string[];
  days: string[];
  languages: string[];
  formats: string[];
  onDistrictChange: (v: string[]) => void;
  onDayChange: (v: string[]) => void;
  onLanguageChange: (v: string[]) => void;
  onFormatChange: (v: string[]) => void;
}) {
  const t = useTranslations("filters");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 md:hidden">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink">
            {t("filtersLabel")}
          </h2>
          <button
            type="button"
            aria-label={t("closeFilters")}
            onClick={onClose}
            className={`rounded text-ink-muted ${pressable}`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <FilterDropdown
            ariaLabel={t("districtAria")}
            values={districtIds}
            options={districtOptions}
            onChange={onDistrictChange}
            allLabel={t("allDistricts")}
            countLabel={(count) => t("districtsCount", { count })}
            clearLabel={t("clear")}
            icon={MapPin}
          />
          <FilterDropdown
            ariaLabel={t("dayAria")}
            values={days}
            options={dayOptions}
            onChange={onDayChange}
            allLabel={t("allDays")}
            countLabel={(count) => t("daysCount", { count })}
            clearLabel={t("clear")}
            icon={Calendar}
          />
          <FilterDropdown
            ariaLabel={t("languageAria")}
            values={languages}
            options={languageOptions}
            onChange={onLanguageChange}
            allLabel={t("allLanguages")}
            countLabel={(count) => t("languagesCount", { count })}
            clearLabel={t("clear")}
            icon={Languages}
          />
          <FilterDropdown
            ariaLabel={t("formatAria")}
            values={formats}
            options={formatOptions}
            onChange={onFormatChange}
            allLabel={t("allFormats")}
            countLabel={(count) => t("formatsCount", { count })}
            clearLabel={t("clear")}
            icon={SlidersHorizontal}
          />
        </div>

        <button
          type="button"
          onClick={onClose}
          className={`mt-4 w-full rounded-lg bg-indigo px-4 py-2.5 text-sm font-semibold text-white ${pressable}`}
        >
          {t("apply")}
        </button>
      </div>
    </div>
  );
}
