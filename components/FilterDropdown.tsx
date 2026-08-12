"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { hoverTransition, pressable } from "@/lib/motion";

export type DropdownOption = { value: string; label: string };

export default function FilterDropdown({
  ariaLabel,
  value,
  options,
  onChange,
  className = "",
  icon: Icon,
}: {
  ariaLabel: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
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

  const current = options.find((o) => o.value === value) ?? options[0];

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
          <span className="truncate">{current.label}</span>
        </span>
        <ChevronDown size={16} className="shrink-0 text-ink-muted" />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-20 mt-1 min-w-full overflow-hidden rounded-lg border border-border bg-white py-1 shadow-none"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`block w-full whitespace-nowrap px-2 py-2 text-left text-sm text-ink hover:bg-paper ${hoverTransition}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
