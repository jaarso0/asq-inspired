import { format, startOfWeek, addDays } from 'date-fns';

/**
 * Get the start of the current week (Monday)
 */
export function getCurrentWeekStart() {
    return startOfWeek(new Date(), { weekStartsOn: 1 }); // 1 = Monday
}

/**
 * Format a date as YYYY-MM-DD
 */
export function formatDate(date) {
    return format(date, 'yyyy-MM-dd');
}

/**
 * Format a date as a readable string
 */
export function formatReadableDate(date) {
    return format(new Date(date), 'MMM d, yyyy');
}

/**
 * Get today's date as YYYY-MM-DD
 */
export function getToday() {
    return formatDate(new Date());
}

/**
 * Get an array of the last N days as YYYY-MM-DD strings
 */
export function getLastNDays(n) {
    const days = [];
    const today = new Date();

    for (let i = 0; i < n; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        days.push(formatDate(date));
    }

    return days.reverse();
}

/**
 * Get week label for a given date
 */
export function getWeekLabel(date) {
    const weekStart = startOfWeek(new Date(date), { weekStartsOn: 1 });
    const weekEnd = addDays(weekStart, 6);
    return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
}

/**
 * Check if a date is today
 */
export function isToday(dateString) {
    return dateString === getToday();
}

/**
 * Check if a date is in the current week
 */
export function isCurrentWeek(dateString) {
    const date = new Date(dateString);
    const weekStart = getCurrentWeekStart();
    const weekEnd = addDays(weekStart, 6);

    return date >= weekStart && date <= weekEnd;
}
