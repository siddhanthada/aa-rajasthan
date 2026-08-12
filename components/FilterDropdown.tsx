"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, type LucideIcon } from "lucide-react";
import { hoverTransition, pressable } from "@/lib/motion";

export type DropdownOption = { value: string; label: string };

export default function FilterDropdown({
  ariaLabel,
  values,
  options,
  onChange,
  allLabel,
  countLabel,
  clearLabel,
  className = "",
  icon: Icon,
}: {
  ariaLabel: string;
  values: string[];
  options: DropdownOption[];
  onChange: (values: string[]) => void;
  allLabel: string;
  countLabel: (count: number) => string;
  clearLabel: string;
  className?: string;
  icon?: LucideIcon;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const buttonLabel =
    values.length === 0
      ? allLabel
      : values.length === 1
        ? (options.find((o) => o.value === values[0])?.label ?? allLabel)
        : countLabel(values.length);

  function toggle(value: string) {
    onChange(
      values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value],
    );
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 text-sm text-ink hover:border-indigo ${pressable}`}
      >
        <span className="flex min-w-0 items-center gap-2">
          {Icon && <Icon size={16} className="shrink-0 text-ink-muted" />}
          <span className="truncate">{buttonLabel}</span>
        </span>
        <ChevronDown size={16} className="shrink-0 text-ink-muted" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="absolute left-0 top-full z-20 mt-1 min-w-full overflow-hidden rounded-lg border border-border bg-white py-1 shadow-none"
        >
          {options.map((option) => {
            const checked = values.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={checked}
                onClick={() => toggle(option.value)}
                className={`flex w-full items-center gap-2 whitespace-nowrap px-3 py-3 text-left text-sm text-ink hover:bg-paper ${hoverTransition}`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${hoverTransition} ${
                    checked ? "border border-indigo bg-indigo" : "border border-border bg-white"
                  }`}
                >
                  {checked && (
                    <Check size={12} strokeWidth={3} className="text-white" />
                  )}
                </span>
                {option.label}
              </button>
            );
          })}

          {values.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className={`block w-full px-3 py-2 text-left text-[13px] text-ink-muted hover:text-ink ${hoverTransition}`}
            >
              {clearLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
