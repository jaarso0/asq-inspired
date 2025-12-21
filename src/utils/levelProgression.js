import { differenceInWeeks, differenceInDays, startOfWeek, format } from 'date-fns';

/**
 * Calculate if a user is eligible to advance to the next phase
 */
export function canAdvancePhase(domainState) {
    const { currentLevel, currentPhase, phaseStartDate, habits, reflections } = domainState;

    const daysSincePhaseStart = differenceInDays(new Date(), new Date(phaseStartDate));
    const weeksSincePhaseStart = differenceInWeeks(new Date(), new Date(phaseStartDate));

    // Dissonance → Uncertainty: Just need to complete assessment (handled elsewhere)
    if (currentPhase === 'dissonance') {
        return true; // Assessment completion triggers this
    }

    // Uncertainty → Discovery: 2 weeks minimum + 60% habit completion
    if (currentPhase === 'uncertainty') {
        const habitCompletionRate = calculateHabitCompletionRate(habits, 14); // Last 2 weeks
        return weeksSincePhaseStart >= 2 && habitCompletionRate >= 0.6;
    }

    // Discovery → Next Level: 4 weeks minimum + 70% habit completion + 3 reflections
    if (currentPhase === 'discovery') {
        const habitCompletionRate = calculateHabitCompletionRate(habits, 28); // Last 4 weeks
        const recentReflections = getRecentReflections(reflections, 28);
        return weeksSincePhaseStart >= 4 &&
            habitCompletionRate >= 0.7 &&
            recentReflections.length >= 3;
    }

    return false;
}

/**
 * Calculate if a user is eligible to advance to the next level
 */
export function canAdvanceLevel(domainState) {
    const { currentLevel, currentPhase, levelStartDate, habits, reflections } = domainState;

    // Must be in Discovery phase
    if (currentPhase !== 'discovery') {
        return false;
    }

    const weeksSinceLevelStart = differenceInWeeks(new Date(), new Date(levelStartDate));

    // Minimum 6 weeks at current level
    if (weeksSinceLevelStart < 6) {
        return false;
    }

    // 70%+ habit completion rate over the level period
    const habitCompletionRate = calculateHabitCompletionRate(habits, 42); // 6 weeks
    if (habitCompletionRate < 0.7) {
        return false;
    }

    // At least 4 weekly reflections
    const recentReflections = getRecentReflections(reflections, 42);
    if (recentReflections.length < 4) {
        return false;
    }

    return true;
}

/**
 * Calculate habit completion rate over a given number of days
 */
export function calculateHabitCompletionRate(habits, days = 7) {
    if (!habits || habits.length === 0) {
        return 0;
    }

    const today = new Date();
    const dates = [];

    // Generate array of dates for the period
    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(format(date, 'yyyy-MM-dd'));
    }

    let totalPossible = habits.length * dates.length;
    let totalCompleted = 0;

    habits.forEach(habit => {
        dates.forEach(date => {
            if (habit.completions && habit.completions[date]) {
                totalCompleted++;
            }
        });
    });

    return totalPossible > 0 ? totalCompleted / totalPossible : 0;
}

/**
 * Get reflections from the last N days
 */
export function getRecentReflections(reflections, days = 28) {
    if (!reflections) {
        return [];
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return reflections.filter(reflection => {
        const reflectionDate = new Date(reflection.timestamp);
        return reflectionDate >= cutoffDate;
    });
}

/**
 * Get the next phase in the progression
 */
export function getNextPhase(currentPhase) {
    const phaseOrder = ['dissonance', 'uncertainty', 'discovery'];
    const currentIndex = phaseOrder.indexOf(currentPhase);

    if (currentIndex === -1 || currentIndex === phaseOrder.length - 1) {
        return 'dissonance'; // Loop back to start for new level
    }

    return phaseOrder[currentIndex + 1];
}

/**
 * Get the next level in the progression
 */
export function getNextLevel(currentLevel) {
    if (currentLevel === 1.0) return 2.0;
    if (currentLevel === 2.0) return 3.0;
    return 3.0; // Max level
}

/**
 * Calculate weekly progress percentage
 */
export function getWeeklyProgress(habits) {
    return Math.round(calculateHabitCompletionRate(habits, 7) * 100);
}
