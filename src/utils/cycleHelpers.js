import { differenceInDays, addDays, format } from 'date-fns';

/**
 * CYCLE_LENGTH defines the 90-day tracking window.
 * This is a LOGICAL window, not a localStorage expiration time.
 * Data persists indefinitely in localStorage.
 */
export const CYCLE_LENGTH = 90;

/**
 * Calculate the current day index within the 90-day cycle.
 * Returns a value between 0 and 89.
 * 
 * @param {string} cycleStartDate - YYYY-MM-DD format
 * @returns {number} Current day index (0-89)
 */
export function getCurrentDayIndex(cycleStartDate) {
    const today = new Date();
    const startDate = new Date(cycleStartDate);

    // Calculate days since cycle start
    const daysSince = differenceInDays(today, startDate);

    // Clamp between 0 and 89
    return Math.max(0, Math.min(CYCLE_LENGTH - 1, daysSince));
}

/**
 * Convert a day index (0-89) to a date string.
 * 
 * @param {string} cycleStartDate - YYYY-MM-DD format
 * @param {number} dayIndex - Day index (0-89)
 * @returns {string} Date in YYYY-MM-DD format
 */
export function getDateForDayIndex(cycleStartDate, dayIndex) {
    const startDate = new Date(cycleStartDate);
    const targetDate = addDays(startDate, dayIndex);
    return format(targetDate, 'yyyy-MM-dd');
}

/**
 * Convert a date string to a day index within the cycle.
 * Returns null if date is outside the 90-day window.
 * 
 * @param {string} cycleStartDate - YYYY-MM-DD format
 * @param {string} date - YYYY-MM-DD format
 * @returns {number|null} Day index (0-89) or null if outside cycle
 */
export function getDayIndexForDate(cycleStartDate, date) {
    const startDate = new Date(cycleStartDate);
    const targetDate = new Date(date);

    const daysSince = differenceInDays(targetDate, startDate);

    // Return null if outside the 90-day window
    if (daysSince < 0 || daysSince >= CYCLE_LENGTH) {
        return null;
    }

    return daysSince;
}

/**
 * Generate an array of all 90 dates in the cycle.
 * Each date is in YYYY-MM-DD format.
 * 
 * @param {string} cycleStartDate - YYYY-MM-DD format
 * @returns {string[]} Array of 90 dates
 */
export function get90DayDates(cycleStartDate) {
    const dates = [];
    const startDate = new Date(cycleStartDate);

    for (let i = 0; i < CYCLE_LENGTH; i++) {
        const date = addDays(startDate, i);
        dates.push(format(date, 'yyyy-MM-dd'));
    }

    return dates;
}

/**
 * Check if a day index represents a future day.
 * 
 * @param {string} cycleStartDate - YYYY-MM-DD format
 * @param {number} dayIndex - Day index (0-89)
 * @returns {boolean} True if the day is in the future
 */
export function isFutureDay(cycleStartDate, dayIndex) {
    const currentDayIndex = getCurrentDayIndex(cycleStartDate);
    return dayIndex > currentDayIndex;
}

/**
 * Check if a day index represents the current day.
 * 
 * @param {string} cycleStartDate - YYYY-MM-DD format
 * @param {number} dayIndex - Day index (0-89)
 * @returns {boolean} True if the day is today
 */
export function isCurrentDay(cycleStartDate, dayIndex) {
    const currentDayIndex = getCurrentDayIndex(cycleStartDate);
    return dayIndex === currentDayIndex;
}

/**
 * Format a day index for display (e.g., "Day 1", "Day 45")
 * 
 * @param {number} dayIndex - Day index (0-89)
 * @returns {string} Formatted day label
 */
export function formatDayLabel(dayIndex) {
    return `Day ${dayIndex + 1}`;
}
