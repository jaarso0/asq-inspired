import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DOMAINS } from '../data/domainConfig';
import { getHabitsForLevel } from '../data/habitTemplates';
import { getToday, getCurrentWeekStart, formatDate } from '../utils/dateHelpers';
import { getNextPhase, getNextLevel } from '../utils/levelProgression';

// Initialize default domain state
function createDefaultDomainState(domainId) {
    const domain = DOMAINS[domainId];
    const today = getToday();

    return {
        id: domainId,
        name: domain.name,
        currentLevel: 1.0,
        currentPhase: 'dissonance',
        levelStartDate: today,
        phaseStartDate: today,
        assessmentScore: 0,
        assessmentCompleted: false,
        habits: [],
        reflections: [],
        history: [
            {
                level: 1.0,
                phase: 'dissonance',
                startDate: today,
                endDate: null
            }
        ]
    };
}

// Initialize all domains
function initializeDomains() {
    const domains = {};
    Object.keys(DOMAINS).forEach(domainId => {
        domains[domainId] = createDefaultDomainState(domainId);
    });
    return domains;
}

export const useStore = create(
    persist(
        (set, get) => ({
            // State
            domains: initializeDomains(),
            focusDomains: [], // Array of up to 2 focus domains
            weeklyIntegrations: [],
            cycleStartDate: getToday(), // 90-day cycle start date (persists in localStorage)

            // Actions

            /**
             * Complete self-assessment for a domain
             */
            completeAssessment: (domainId, score, calculatedLevel) => {
                set(state => {
                    const domain = state.domains[domainId];
                    const today = getToday();

                    // Initialize habits for the calculated level
                    const habitTemplates = getHabitsForLevel(domainId, calculatedLevel);
                    const habits = habitTemplates.map(template => ({
                        ...template,
                        completions: {}
                    }));

                    return {
                        domains: {
                            ...state.domains,
                            [domainId]: {
                                ...domain,
                                assessmentScore: score,
                                assessmentCompleted: true,
                                currentLevel: calculatedLevel,
                                currentPhase: 'uncertainty', // Move to uncertainty after assessment
                                levelStartDate: today,
                                phaseStartDate: today,
                                habits,
                                history: [
                                    ...domain.history.slice(0, -1), // Remove the last entry
                                    {
                                        ...domain.history[domain.history.length - 1],
                                        endDate: today
                                    },
                                    {
                                        level: calculatedLevel,
                                        phase: 'uncertainty',
                                        startDate: today,
                                        endDate: null
                                    }
                                ]
                            }
                        }
                    };
                });
            },

            /**
             * Toggle habit completion for a specific date
             */
            toggleHabit: (domainId, habitId, date = getToday()) => {
                set(state => {
                    const domain = state.domains[domainId];
                    const habits = domain.habits.map(habit => {
                        if (habit.id === habitId) {
                            const completions = { ...habit.completions };
                            completions[date] = !completions[date];
                            return { ...habit, completions };
                        }
                        return habit;
                    });

                    return {
                        domains: {
                            ...state.domains,
                            [domainId]: {
                                ...domain,
                                habits
                            }
                        }
                    };
                });
            },

            /**
             * Save a weekly reflection
             */
            saveReflection: (domainId, content) => {
                set(state => {
                    const domain = state.domains[domainId];
                    const weekStart = formatDate(getCurrentWeekStart());

                    // Check if reflection for this week already exists
                    const existingIndex = domain.reflections.findIndex(
                        r => r.weekStartDate === weekStart
                    );

                    const newReflection = {
                        id: `${domainId}_${weekStart}`,
                        weekStartDate: weekStart,
                        content,
                        timestamp: new Date().toISOString()
                    };

                    let reflections;
                    if (existingIndex >= 0) {
                        // Update existing reflection
                        reflections = [...domain.reflections];
                        reflections[existingIndex] = newReflection;
                    } else {
                        // Add new reflection
                        reflections = [...domain.reflections, newReflection];
                    }

                    return {
                        domains: {
                            ...state.domains,
                            [domainId]: {
                                ...domain,
                                reflections
                            }
                        }
                    };
                });
            },

            /**
             * Advance to next phase
             */
            advancePhase: (domainId) => {
                set(state => {
                    const domain = state.domains[domainId];
                    const today = getToday();
                    const nextPhase = getNextPhase(domain.currentPhase);

                    return {
                        domains: {
                            ...state.domains,
                            [domainId]: {
                                ...domain,
                                currentPhase: nextPhase,
                                phaseStartDate: today,
                                history: [
                                    ...domain.history.slice(0, -1),
                                    {
                                        ...domain.history[domain.history.length - 1],
                                        endDate: today
                                    },
                                    {
                                        level: domain.currentLevel,
                                        phase: nextPhase,
                                        startDate: today,
                                        endDate: null
                                    }
                                ]
                            }
                        }
                    };
                });
            },

            /**
             * Advance to next level
             */
            advanceLevel: (domainId) => {
                set(state => {
                    const domain = state.domains[domainId];
                    const today = getToday();
                    const nextLevel = getNextLevel(domain.currentLevel);

                    // Get new habits for the next level
                    const habitTemplates = getHabitsForLevel(domainId, nextLevel);
                    const habits = habitTemplates.map(template => ({
                        ...template,
                        completions: {}
                    }));

                    return {
                        domains: {
                            ...state.domains,
                            [domainId]: {
                                ...domain,
                                currentLevel: nextLevel,
                                currentPhase: 'dissonance', // Start at dissonance for new level
                                levelStartDate: today,
                                phaseStartDate: today,
                                habits,
                                history: [
                                    ...domain.history.slice(0, -1),
                                    {
                                        ...domain.history[domain.history.length - 1],
                                        endDate: today
                                    },
                                    {
                                        level: nextLevel,
                                        phase: 'dissonance',
                                        startDate: today,
                                        endDate: null
                                    }
                                ]
                            }
                        }
                    };
                });
            },

            /**
             * Toggle focus domain (supports up to 2 focus domains)
             * If domain is already in focus, remove it
             * If domain is not in focus and less than 2 domains are focused, add it
             */
            toggleFocusDomain: (domainId) => {
                set(state => {
                    const currentFocus = state.focusDomains;
                    const isAlreadyFocused = currentFocus.includes(domainId);

                    if (isAlreadyFocused) {
                        // Remove from focus
                        return {
                            focusDomains: currentFocus.filter(id => id !== domainId)
                        };
                    } else if (currentFocus.length < 2) {
                        // Add to focus (max 2)
                        return {
                            focusDomains: [...currentFocus, domainId]
                        };
                    }

                    // Already have 2 focus domains, do nothing
                    return state;
                });
            },

            /**
             * Save weekly integration answer
             */
            saveWeeklyIntegration: (question, answer) => {
                set(state => {
                    const weekStart = formatDate(getCurrentWeekStart());

                    // Check if integration for this week exists
                    const existingIndex = state.weeklyIntegrations.findIndex(
                        wi => wi.weekStartDate === weekStart
                    );

                    const newIntegration = {
                        weekStartDate: weekStart,
                        question,
                        answer,
                        timestamp: new Date().toISOString()
                    };

                    let weeklyIntegrations;
                    if (existingIndex >= 0) {
                        weeklyIntegrations = [...state.weeklyIntegrations];
                        weeklyIntegrations[existingIndex] = newIntegration;
                    } else {
                        weeklyIntegrations = [...state.weeklyIntegrations, newIntegration];
                    }

                    return { weeklyIntegrations };
                });
            },

            /**
             * Add a custom habit to a domain
             * Habits are stored with empty completions and persist in localStorage
             */
            addHabit: (domainId, habitName) => {
                set(state => {
                    const domain = state.domains[domainId];

                    // Generate a simple unique ID
                    const habitId = `custom_${domainId}_${Date.now()}`;

                    const newHabit = {
                        id: habitId,
                        text: habitName,
                        description: 'Custom habit',
                        completions: {} // Empty completions object, will be populated as user checks boxes
                    };

                    return {
                        domains: {
                            ...state.domains,
                            [domainId]: {
                                ...domain,
                                habits: [...domain.habits, newHabit]
                            }
                        }
                    };
                });
            },

            /**
             * Delete a habit from a domain
             */
            deleteHabit: (domainId, habitId) => {
                set(state => {
                    const domain = state.domains[domainId];

                    return {
                        domains: {
                            ...state.domains,
                            [domainId]: {
                                ...domain,
                                habits: domain.habits.filter(h => h.id !== habitId)
                            }
                        }
                    };
                });
            },

            /**
             * Reset the 90-day cycle to start from today
             * This does NOT delete habit data, just resets the cycle window
             */
            resetCycle: () => {
                set({ cycleStartDate: getToday() });
            },

            /**
             * Get current week's reflection for a domain
             */
            getCurrentWeekReflection: (domainId) => {
                const state = get();
                const domain = state.domains[domainId];
                const weekStart = formatDate(getCurrentWeekStart());

                return domain.reflections.find(r => r.weekStartDate === weekStart);
            },

            /**
             * Get current week's integration
             */
            getCurrentWeekIntegration: () => {
                const state = get();
                const weekStart = formatDate(getCurrentWeekStart());

                return state.weeklyIntegrations.find(wi => wi.weekStartDate === weekStart);
            }
        }),
        {
            name: 'human-3.0-storage', // localStorage key
            version: 1
        }
    )
);
