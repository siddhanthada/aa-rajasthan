"use client";

import { X } from "lucide-react";
import FilterDropdown, { type DropdownOption } from "./FilterDropdown";

export default function MobileFilterSheet({
  open,
  onClose,
  dayOptions,
  languageOptions,
  formatOptions,
  day,
  language,
  format,
  onDayChange,
  onLanguageChange,
  onFormatChange,
}: {
  open: boolean;
  onClose: () => void;
  dayOptions: DropdownOption[];
  languageOptions: DropdownOption[];
  formatOptions: DropdownOption[];
  day: string;
  language: string;
  format: string;
  onDayChange: (v: string) => void;
  onLanguageChange: (v: string) => void;
  onFormatChange: (v: string) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 md:hidden">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink">Filters</h2>
          <button
            type="button"
            aria-label="Close filters"
            onClick={onClose}
            className="text-ink-muted"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <FilterDropdown
            ariaLabel="Day"
            value={day}
            options={dayOptions}
            onChange={onDayChange}
          />
          <FilterDropdown
            ariaLabel="Language"
            value={language}
            options={languageOptions}
            onChange={onLanguageChange}
          />
          <FilterDropdown
            ariaLabel="Format"
            value={format}
            options={formatOptions}
            onChange={onFormatChange}
          />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-lg bg-indigo px-4 py-2.5 text-sm font-semibold text-white"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
