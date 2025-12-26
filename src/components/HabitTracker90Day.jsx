import { useState } from 'react';
import { useStore } from '../store/useStore';
import { DOMAINS } from '../data/domainConfig';
import {
    get90DayDates,
    getCurrentDayIndex,
    isFutureDay,
    isCurrentDay,
    formatDayLabel
} from '../utils/cycleHelpers';
import AddHabitModal from './AddHabitModal';
import HabitStats from './HabitStats';

export default function HabitTracker90Day({ domainId }) {
    const [showAddModal, setShowAddModal] = useState(false);

    // Get state and actions from store
    const domain = useStore(state => state.domains[domainId]);
    const cycleStartDate = useStore(state => state.cycleStartDate);
    const toggleHabit = useStore(state => state.toggleHabit);
    const addHabit = useStore(state => state.addHabit);
    const deleteHabit = useStore(state => state.deleteHabit);

    const domainConfig = DOMAINS[domainId];
    const currentDayIndex = getCurrentDayIndex(cycleStartDate);

    // Generate all 90 dates for the cycle
    const allDates = get90DayDates(cycleStartDate);

    const handleAddHabit = (habitName) => {
        addHabit(domainId, habitName);
    };

    const handleDeleteHabit = (habitId) => {
        if (window.confirm('Are you sure you want to delete this habit?')) {
            deleteHabit(domainId, habitId);
        }
    };

    if (!domain.habits || domain.habits.length === 0) {
        return (
            <div className="space-y-4">
                <div className="card bg-gray-50 text-center py-12">
                    <p className="text-gray-600 mb-4">No habits yet for this domain.</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary"
                    >
                        Add Your First Habit
                    </button>
                </div>

                <AddHabitModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    domainId={domainId}
                    domainName={domainConfig.name}
                    onAdd={handleAddHabit}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Add Habit button */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                        90-Day Habit Tracker
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Track your daily habits over a 90-day cycle. Currently on Day {currentDayIndex + 1}.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary"
                >
                    + Add Habit
                </button>
            </div>

            {/* Statistics Panel */}
            <HabitStats
                habits={domain.habits}
                cycleStartDate={cycleStartDate}
                domainId={domainId}
            />

            {/* 90-Day Grid - Desktop View (hidden on mobile) */}
            <div className="card overflow-hidden hidden md:block">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr>
                                    {/* Sticky habit name column header */}
                                    <th className="sticky left-0 z-20 bg-white dark:bg-gray-900 border-b-2 border-r-2 border-gray-300 dark:border-gray-700 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-50">
                                        Habit
                                    </th>

                                    {/* Day columns */}
                                    {allDates.map((date, dayIndex) => {
                                        const isCurrent = isCurrentDay(cycleStartDate, dayIndex);
                                        const isFuture = isFutureDay(cycleStartDate, dayIndex);

                                        return (
                                            <th
                                                key={date}
                                                className={`border-b-2 border-gray-300 dark:border-gray-700 px-1 py-2 text-center text-xs font-medium min-w-[40px] ${isCurrent ? 'bg-amber-100 dark:bg-amber-900' : isFuture ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'
                                                    }`}
                                            >
                                                <div className="flex flex-col items-center">
                                                    <span className={isCurrent ? 'text-amber-800 dark:text-amber-200 font-bold' : 'text-gray-600 dark:text-gray-400'}>
                                                        {dayIndex + 1}
                                                    </span>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>

                            <tbody>
                                {domain.habits.map((habit, habitIndex) => (
                                    <tr key={habit.id} className={habitIndex % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                                        {/* Sticky habit name column */}
                                        <td className="sticky left-0 z-10 border-r-2 border-gray-300 dark:border-gray-700 px-4 py-3 bg-inherit">
                                            <div className="flex items-center justify-between min-w-[200px]">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{habit.text}</p>
                                                    {habit.description && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{habit.description}</p>
                                                    )}
                                                </div>
                                                {habit.id.startsWith('custom_') && (
                                                    <button
                                                        onClick={() => handleDeleteHabit(habit.id)}
                                                        className="ml-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 text-xs"
                                                        title="Delete habit"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        </td>

                                        {/* Day checkboxes */}
                                        {allDates.map((date, dayIndex) => {
                                            const isCompleted = habit.completions && habit.completions[date];
                                            const isCurrent = isCurrentDay(cycleStartDate, dayIndex);
                                            const isFuture = isFutureDay(cycleStartDate, dayIndex);

                                            return (
                                                <td
                                                    key={date}
                                                    className={`border-l border-gray-200 dark:border-gray-700 px-1 py-2 text-center ${isCurrent ? 'bg-amber-50 dark:bg-amber-900/20' : ''
                                                        }`}
                                                >
                                                    <button
                                                        onClick={() => !isFuture && toggleHabit(domainId, habit.id, date)}
                                                        disabled={isFuture}
                                                        className={`w-8 h-8 rounded border-2 transition-all ${isCompleted
                                                            ? 'bg-emerald-500 border-emerald-500'
                                                            : isFuture
                                                                ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50'
                                                                : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                                            } ${isCurrent && !isCompleted ? 'ring-2 ring-amber-400' : ''}`}
                                                        title={`${formatDayLabel(dayIndex)} - ${date}`}
                                                    >
                                                        {isCompleted && (
                                                            <span className="text-white text-sm font-bold">✓</span>
                                                        )}
                                                    </button>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Legend */}
                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800 flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded border-2 bg-emerald-500 border-emerald-500"></div>
                        <span className="text-gray-700 dark:text-gray-300">Completed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded border-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"></div>
                        <span className="text-gray-700 dark:text-gray-300">Incomplete</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded border-2 bg-amber-50 dark:bg-amber-900/20 ring-2 ring-amber-400"></div>
                        <span className="text-gray-700 dark:text-gray-300">Today</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded border-2 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50"></div>
                        <span className="text-gray-700 dark:text-gray-300">Future (disabled)</span>
                    </div>
                </div>
            </div>

            {/* Mobile View - Card-based layout */}
            <div className="md:hidden space-y-4">
                {domain.habits.map((habit) => (
                    <div key={habit.id} className="card">
                        {/* Habit Name */}
                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">{habit.text}</p>
                                {habit.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{habit.description}</p>
                                )}
                            </div>
                            {habit.id.startsWith('custom_') && (
                                <button
                                    onClick={() => handleDeleteHabit(habit.id)}
                                    className="ml-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 text-sm"
                                    title="Delete habit"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Progress Checkboxes - 2 Rows */}
                        <div className="overflow-x-auto">
                            <div className="grid grid-rows-2 grid-flow-col gap-2 auto-cols-max">
                                {allDates.map((date, dayIndex) => {
                                    const isCompleted = habit.completions && habit.completions[date];
                                    const isCurrent = isCurrentDay(cycleStartDate, dayIndex);
                                    const isFuture = isFutureDay(cycleStartDate, dayIndex);

                                    return (
                                        <div key={date} className="flex flex-col items-center">
                                            <span className={`text-xs mb-1 ${isCurrent ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {dayIndex + 1}
                                            </span>
                                            <button
                                                onClick={() => !isFuture && toggleHabit(domainId, habit.id, date)}
                                                disabled={isFuture}
                                                className={`w-10 h-10 rounded border-2 transition-all ${isCompleted
                                                        ? 'bg-emerald-500 border-emerald-500'
                                                        : isFuture
                                                            ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50'
                                                            : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                                    } ${isCurrent && !isCompleted ? 'ring-2 ring-amber-400' : ''}`}
                                                title={`Day ${dayIndex + 1} - ${date}`}
                                            >
                                                {isCompleted && (
                                                    <span className="text-white text-sm font-bold">✓</span>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Calm reminder */}
            <p className="text-xs text-gray-500 italic text-center">
                Consistency over perfection. Every check-in matters.
            </p>

            {/* Add Habit Modal */}
            <AddHabitModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                domainId={domainId}
                domainName={domainConfig.name}
                onAdd={handleAddHabit}
            />
        </div>
    );
}
