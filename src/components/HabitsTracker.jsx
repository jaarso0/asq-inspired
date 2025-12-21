import { useStore } from '../store/useStore';
import { getToday, getLastNDays, formatReadableDate } from '../utils/dateHelpers';
import { MICRO_COPY } from '../data/domainConfig';

export default function HabitsTracker({ domainId }) {
    const domain = useStore(state => state.domains[domainId]);
    const toggleHabit = useStore(state => state.toggleHabit);

    const today = getToday();
    const last7Days = getLastNDays(7);

    if (!domain.habits || domain.habits.length === 0) {
        return (
            <div className="card bg-gray-50">
                <p className="text-gray-600 text-sm italic">
                    {MICRO_COPY.habits.empty}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Encouragement */}
            <div className="text-sm text-gray-600 italic">
                {MICRO_COPY.habits.encouragement}
            </div>

            {/* Desktop view: Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Habit
                            </th>
                            {last7Days.map(date => (
                                <th key={date} className="text-center py-3 px-2 text-xs text-gray-600">
                                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                                    <br />
                                    <span className="text-gray-400">
                                        {new Date(date).getDate()}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {domain.habits.map(habit => (
                            <tr key={habit.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{habit.text}</p>
                                        <p className="text-xs text-gray-500">{habit.description}</p>
                                    </div>
                                </td>
                                {last7Days.map(date => (
                                    <td key={date} className="text-center py-3 px-2">
                                        <button
                                            onClick={() => toggleHabit(domainId, habit.id, date)}
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${habit.completions[date]
                                                    ? 'bg-gray-900 border-gray-900'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            {habit.completions[date] && (
                                                <span className="text-white text-sm">✓</span>
                                            )}
                                        </button>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile view: Today only */}
            <div className="md:hidden space-y-3">
                <p className="text-sm font-medium text-gray-700">Today's Habits</p>
                {domain.habits.map(habit => (
                    <div key={habit.id} className="card flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{habit.text}</p>
                            <p className="text-xs text-gray-500">{habit.description}</p>
                        </div>
                        <button
                            onClick={() => toggleHabit(domainId, habit.id, today)}
                            className={`ml-4 w-10 h-10 rounded-full border-2 transition-all flex-shrink-0 ${habit.completions[today]
                                    ? 'bg-gray-900 border-gray-900'
                                    : 'border-gray-300'
                                }`}
                        >
                            {habit.completions[today] && (
                                <span className="text-white">✓</span>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {/* No streak messaging */}
            <p className="text-xs text-gray-500 italic">
                {MICRO_COPY.habits.streakFree}
            </p>
        </div>
    );
}
