/**
 * Helper utilities for date formatting, string manipulation, and common operations
 * Extensible collection of utility functions for the portfolio application
 */

import { logger } from "@/lib/logger";

type DateFormat = "iso" | "short" | "long" | "relative" | "human" | "time";
type StringFormat = "kebab" | "snake" | "camel" | "pascal" | "title" | "sentence";
type NumberFormat = "decimal" | "currency" | "percent" | "compact";

// Date utilities
export function formatDate(
  date: Date | string,
  format: DateFormat = "human",
  locale: string = "en-US"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    logger.warn("Invalid date provided to formatDate", { date });
    return "Invalid date";
  }

  switch (format) {
    case "iso":
      return dateObj.toISOString();
    case "short":
      return dateObj.toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    case "long":
      return dateObj.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
    case "time":
      return dateObj.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    case "relative": {
      const now = new Date();
      const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000);
      
      if (Math.abs(diffInSeconds) < 60) return "just now";
      if (Math.abs(diffInSeconds) < 3600) {
        const minutes = Math.round(diffInSeconds / 60);
        return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
      }
      if (Math.abs(diffInSeconds) < 86400) {
        const hours = Math.round(diffInSeconds / 3600);
        return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
      }
      if (Math.abs(diffInSeconds) < 2592000) {
        const days = Math.round(diffInSeconds / 86400);
        return days === 1 ? "1 day ago" : `${days} days ago`;
      }
      const months = Math.round(diffInSeconds / 2592000);
      return months === 1 ? "1 month ago" : `${months} months ago`;
    }
    case "human":
    default:
      return dateObj.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  }
}

export function parseDate(date: string | Date): Date {
  if (date instanceof Date) return date;
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }
  return parsed;
}

export function isDateValid(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return !isNaN(dateObj.getTime());
}

export function addDays(date: Date | string, days: number): Date {
  const dateObj = parseDate(date);
  const result = new Date(dateObj);
  result.setDate(result.getDate() + days);
  return result;
}

export function differenceInDays(date1: Date | string, date2: Date | string): number {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// String utilities
export function convertCase(str: string, format: StringFormat): string {
  if (!str) return "";
  const result = str.trim();
  
  switch (format) {
    case "kebab":
      return result
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/\s+/g, "-")
        .toLowerCase();
    case "snake":
      return result
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .replace(/\s+/g, "_")
        .toLowerCase();
    case "camel":
      return result
        .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : "")
        .replace(/^./, str => str.toLowerCase());
    case "pascal":
      return result
        .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : "")
        .replace(/^./, str => str.toUpperCase());
    case "title":
      return result
        .replace(/[-_]/g, " ")
        .replace(/\s+/g, " ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    case "sentence":
      return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
    default:
      return result;
  }
}

export function truncate(str: string, maxLength: number, suffix: string = "…"): string {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length).trimEnd() + suffix;
}

export function capitalize(str: string, allWords: boolean = false): string {
  if (!str) return "";
  if (allWords) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(str: string, separator: string = "-"): string {
  const escapedSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, separator)
    .replace(new RegExp(`${escapedSeparator}{2,}`, "g"), separator)
    .replace(new RegExp(`^${escapedSeparator}|${escapedSeparator}$`, "g"), "");
}

export function removeDiacritics(str: string): string {
  return str.replace(/[^\u0000-\u00ff]/g, "");
}

export function padStart(str: string, length: number, char: string = "0"): string {
  return str.padStart(length, char);
}

export function padEnd(str: string, length: number, char: string = "0"): string {
  return str.padEnd(length, char);
}

// Number utilities
export function formatNumber(
  num: number,
  format: NumberFormat = "decimal",
  locale: string = "en-US",
  options: Intl.NumberFormatOptions = {}
): string {
  switch (format) {
    case "currency":
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: options.currency || "USD",
        ...options,
      }).format(num);
    case "percent":
      return new Intl.NumberFormat(locale, {
        style: "percent",
        ...options,
      }).format(num);
    case "compact": {
      const abs = Math.abs(num);
      if (abs >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
      if (abs >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
      if (abs >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
      return num.toString();
    }
    case "decimal":
    default:
      return new Intl.NumberFormat(locale, options).format(num);
  }
}

export function round(num: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isInteger(value: any): boolean {
  return Number.isInteger(value);
}

export function isFloat(value: any): boolean {
  return Number.isFinite(value) && !isInteger(value);
}

// Array utilities
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function groupBy<T>(array: T[], keyFn: (item: T) => string | number): Map<string | number, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
    return groups;
  }, new Map<string | number, T[]>());
}

export function orderBy<T>(array: T[], keyFn: (item: T) => any, direction: "asc" | "desc" = "asc"): T[] {
  return array.sort((a, b) => {
    const aVal = keyFn(a);
    const bVal = keyFn(b);
    
    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function flatten<T>(array: (T | T[])[]): T[] {
  return array.reduce<T[]>((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []);
}

export function take<T>(array: T[], count: number): T[] {
  return array.slice(0, count);
}

export function drop<T>(array: T[], count: number): T[] {
  return array.slice(count);
}

// Object utilities
export function isObject(item: any): boolean {
  return item !== null && typeof item === "object" && !Array.isArray(item);
}

export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (isObject(source[key]) && isObject(result[key])) {
      result[key] = deepMerge(result[key], source[key] as any);
    } else {
      result[key] = source[key] as any;
    }
  }
  
  return result;
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj } as any;
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}

// Validation utilities
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
}

export function isRequired(value: any): boolean {
  return !isEmpty(value);
}

// String matching
export function includes(haystack: string, needle: string, ignoreCase: boolean = false): boolean {
  const search = ignoreCase ? haystack.toLowerCase() : haystack;
  const target = ignoreCase ? needle.toLowerCase() : needle;
  return search.includes(target);
}

export function startsWith(haystack: string, needle: string, ignoreCase: boolean = false): boolean {
  const search = ignoreCase ? haystack.toLowerCase() : haystack;
  const target = ignoreCase ? needle.toLowerCase() : needle;
  return search.startsWith(target);
}

export function endsWith(haystack: string, needle: string, ignoreCase: boolean = false): boolean {
  const search = ignoreCase ? haystack.toLowerCase() : haystack;
  const target = ignoreCase ? needle.toLowerCase() : needle;
  return search.endsWith(target);
}