import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getCurrentDayIndex } from '../utils/cycleHelpers';

export default function HabitStats({ habits, cycleStartDate }) {
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

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Progress Statistics
            </h3>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                        {stats.completionPercentage}%
                    </div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
                </div>

                <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                        Day {stats.currentDay}
                    </div>
                    <div className="text-sm text-gray-600">of 90</div>
                </div>
            </div>

            {/* Pie Chart */}
            {stats.totalPossible > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
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
                <div className="text-center py-8 text-gray-500 text-sm italic">
                    No habit data yet. Start checking off habits to see your progress!
                </div>
            )}

            {/* Detailed Stats */}
            <div className="mt-6 pt-4 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Total Habits:</span>
                    <span className="font-medium text-gray-900">{habits.length}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Completed Days:</span>
                    <span className="font-medium text-emerald-600">{stats.totalCompleted}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Missed Days:</span>
                    <span className="font-medium text-gray-400">{stats.totalMissed}</span>
                </div>
            </div>
        </div>
    );
}
