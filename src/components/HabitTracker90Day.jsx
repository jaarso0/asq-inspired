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
            <HabitStats habits={domain.habits} cycleStartDate={cycleStartDate} />

            {/* 90-Day Grid */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr>
                                    {/* Sticky habit name column header */}
                                    <th className="sticky left-0 z-20 bg-white border-b-2 border-r-2 border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        Habit
                                    </th>

                                    {/* Day columns */}
                                    {allDates.map((date, dayIndex) => {
                                        const isCurrent = isCurrentDay(cycleStartDate, dayIndex);
                                        const isFuture = isFutureDay(cycleStartDate, dayIndex);

                                        return (
                                            <th
                                                key={date}
                                                className={`border-b-2 border-gray-300 px-1 py-2 text-center text-xs font-medium min-w-[40px] ${isCurrent ? 'bg-amber-100' : isFuture ? 'bg-gray-50' : 'bg-white'
                                                    }`}
                                            >
                                                <div className="flex flex-col items-center">
                                                    <span className={isCurrent ? 'text-amber-800 font-bold' : 'text-gray-600'}>
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
                                    <tr key={habit.id} className={habitIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        {/* Sticky habit name column */}
                                        <td className="sticky left-0 z-10 border-r-2 border-gray-300 px-4 py-3 bg-inherit">
                                            <div className="flex items-center justify-between min-w-[200px]">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{habit.text}</p>
                                                    {habit.description && (
                                                        <p className="text-xs text-gray-500">{habit.description}</p>
                                                    )}
                                                </div>
                                                {habit.id.startsWith('custom_') && (
                                                    <button
                                                        onClick={() => handleDeleteHabit(habit.id)}
                                                        className="ml-2 text-gray-400 hover:text-red-600 text-xs"
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
                                                    className={`border-l border-gray-200 px-1 py-2 text-center ${isCurrent ? 'bg-amber-50' : ''
                                                        }`}
                                                >
                                                    <button
                                                        onClick={() => !isFuture && toggleHabit(domainId, habit.id, date)}
                                                        disabled={isFuture}
                                                        className={`w-8 h-8 rounded border-2 transition-all ${isCompleted
                                                                ? 'bg-emerald-500 border-emerald-500'
                                                                : isFuture
                                                                    ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                                                                    : 'bg-white border-gray-300 hover:border-gray-400'
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
                <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded border-2 bg-emerald-500 border-emerald-500"></div>
                        <span className="text-gray-700">Completed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded border-2 bg-white border-gray-300"></div>
                        <span className="text-gray-700">Incomplete</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded border-2 bg-amber-50 ring-2 ring-amber-400"></div>
                        <span className="text-gray-700">Today</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded border-2 bg-gray-100 border-gray-200 opacity-50"></div>
                        <span className="text-gray-700">Future (disabled)</span>
                    </div>
                </div>
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
