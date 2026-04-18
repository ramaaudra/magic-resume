import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function parseToDate(dateStr: string): Date | null {
  let year: number | null = null;
  let month: number | null = null;

  if (dateStr.match(/^\d{4}-\d{2}$/)) {
    const parts = dateStr.split("-");
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
  } else if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const parts = dateStr.split("-");
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
  } else if (dateStr.match(/^\d{4}\.\d{2}$/)) {
    const parts = dateStr.split(".");
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
  } else if (dateStr.match(/^\d{4}\/\d{2}$/)) {
    const parts = dateStr.split("/");
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
  }

  if (year !== null && month !== null) {
      return new Date(Date.UTC(year, month - 1, 1));
  }
  return null;
}

export function formatDateString(dateStr: string | undefined, locale: string = "zh"): string {
  if (!dateStr) return "";

  if (dateStr.includes(" - ")) {
    const [start, end] = dateStr.split(" - ");
    const formattedStart = formatDateString(start, locale);
    const formattedEnd = formatDateString(end, locale);
    return formattedEnd ? `${formattedStart} - ${formattedEnd}` : formattedStart;
  }

  const date = parseToDate(dateStr);
  if (!date) return dateStr;

  try {
      if (locale === "zh" || locale === "zh-CN") {
          return `${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
      }
      const formatter = new Intl.DateTimeFormat(locale, { 
          year: 'numeric', 
          month: '2-digit',
          timeZone: 'UTC' 
      });
      return formatter.format(date);
  } catch (e) {
      return dateStr;
  }
}
