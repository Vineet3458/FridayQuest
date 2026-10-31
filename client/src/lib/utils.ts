import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines Tailwind class names cleanly, resolving conflicts with twMerge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a Date object or ISO string in Indian Standard Time (IST, UTC+05:30).
 */
export function formatISTDateTime(
  dateInput: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return 'Invalid Date';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  return new Intl.DateTimeFormat('en-IN', { ...defaultOptions, ...options }).format(d);
}

/**
 * Formats a Date object or ISO string as an IST Date (e.g., "Fri, Nov 6, 2026").
 */
export function formatISTDate(dateInput: Date | string | number): string {
  return formatISTDateTime(dateInput, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: undefined,
    minute: undefined,
  });
}

/**
 * Extracts uppercase 2-letter initials from a user's full name.
 */
export function getInitials(name?: string | null): string {
  if (!name || typeof name !== 'string') return 'FQ';
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Safely truncates a string with an ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) return str || '';
  return str.slice(0, maxLength).trimEnd() + '...';
}

