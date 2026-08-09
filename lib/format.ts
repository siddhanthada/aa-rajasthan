const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function dayName(day: number): string {
  return DAY_NAMES[day] ?? "";
}

export function dayShort(day: number): string {
  return DAY_SHORT[day] ?? "";
}

export function formatDays(days: number[]): string {
  return [...days]
    .sort((a, b) => a - b)
    .map(dayShort)
    .join(", ");
}

export function formatTime(time: string): string {
  const [hourStr, minuteStr] = time.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
}

export function formatTimeRange(start: string, end?: string): string {
  if (!end) return formatTime(start);
  return `${formatTime(start)} – ${formatTime(end)}`;
}

export function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const FORMAT_LABELS: Record<string, string> = {
  in_person: "In person",
  online: "Online",
  hybrid: "Hybrid",
};

export function formatFormat(format: string): string {
  return FORMAT_LABELS[format] ?? format;
}

const LANGUAGE_LABELS: Record<string, string> = {
  hi: "Hindi",
  en: "English",
};

export function formatLanguage(language: string): string {
  return LANGUAGE_LABELS[language] ?? language;
}
