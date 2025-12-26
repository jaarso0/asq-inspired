import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getCurrentDayIndex } from '../utils/cycleHelpers';
import { useStore } from '../store/useStore';

export default function HabitStats({ habits, cycleStartDate, domainId }) {
    const [newGoal, setNewGoal] = useState('');
    const [goalsExpanded, setGoalsExpanded] = useState(true);
    const goals = useStore(state => state.domains[domainId]?.goals || []);
    const addGoal = useStore(state => state.addGoal);
    const toggleGoal = useStore(state => state.toggleGoal);
    const deleteGoal = useStore(state => state.deleteGoal);

    // Calculate statistics
    const stats = useMemo(() => {
        const currentDay = getCurrentDayIndex(cycleStartDate);

        // Total possible completions = number of habits × current day index
        // (We only count up to current day, not future days)
        const totalPossible = habits.length * (currentDay + 1);

        // Count actual completions
        let totalCompleted = 0;
        habits.forEach(habit => {
            if (habit.completions) {
                totalCompleted += Object.values(habit.completions).filter(Boolean).length;
            }
        });

        const totalMissed = totalPossible - totalCompleted;
        const completionPercentage = totalPossible > 0
            ? Math.round((totalCompleted / totalPossible) * 100)
            : 0;

        return {
            totalPossible,
            totalCompleted,
            totalMissed,
            completionPercentage,
            currentDay: currentDay + 1 // Display as 1-indexed
        };
    }, [habits, cycleStartDate]);

    // Prepare data for pie chart
    const pieData = [
        { name: 'Completed', value: stats.totalCompleted, color: '#10b981' },
        { name: 'Missed', value: stats.totalMissed, color: '#d4d4d4' }
    ];

    const handleAddGoal = (e) => {
        e.preventDefault();
        if (newGoal.trim()) {
            addGoal(domainId, newGoal.trim());
            setNewGoal('');
        }
    };

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
                Progress Statistics
            </h3>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                        {stats.completionPercentage}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</div>
                </div>

                <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                        Day {stats.currentDay}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">of 90</div>
                </div>
            </div>

            {/* Pie Chart and Goals Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {/* Pie Chart - Left Half */}
                <div>
                    {stats.totalPossible > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm italic">
                            No habit data yet. Start checking off habits to see your progress!
                        </div>
                    )}
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>

                {/* Goals Checklist - Right Half */}
                <div className="md:pl-6 md:border-l border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-md font-semibold text-gray-900 dark:text-gray-50">
                            Goals for the 90-Day Period
                        </h4>
                        <button
                            onClick={() => setGoalsExpanded(!goalsExpanded)}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                            aria-label={goalsExpanded ? "Collapse goals" : "Expand goals"}
                        >
                            {goalsExpanded ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {goalsExpanded && (
                        <>
                            {/* Add Goal Form */}
                            <form onSubmit={handleAddGoal} className="mb-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newGoal}
                                        onChange={(e) => setNewGoal(e.target.value)}
                                        placeholder="Add a new goal..."
                                        className="input text-sm flex-1"
                                    />
                                    <button
                                        type="submit"
                                        className="btn-primary text-sm px-3 py-2"
                                    >
                                        Add
                                    </button>
                                </div>
                            </form>

                            {/* Goals List */}
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {goals.length === 0 ? (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                        No goals yet. Add your first goal above!
                                    </p>
                                ) : (
                                    goals.map((goal) => (
                                        <div
                                            key={goal.id}
                                            className="flex items-start gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={goal.completed}
                                                onChange={() => toggleGoal(domainId, goal.id)}
                                                className="mt-1 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-800"
                                            />
                                            <span
                                                className={`flex-1 text-sm ${goal.completed
                                                        ? 'line-through text-gray-400 dark:text-gray-500'
                                                        : 'text-gray-700 dark:text-gray-300'
                                                    }`}
                                            >
                                                {goal.text}
                                            </span>
                                            <button
                                                onClick={() => deleteGoal(domainId, goal.id)}
                                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xs"
                                                aria-label="Delete goal"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Detailed Stats */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Habits:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-50">{habits.length}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Completed Days:</span>
                    <span className="font-medium text-emerald-600">{stats.totalCompleted}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Missed Days:</span>
                    <span className="font-medium text-gray-400 dark:text-gray-500">{stats.totalMissed}</span>
                </div>
            </div>
        </div>
    );
}
