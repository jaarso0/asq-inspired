import { useState } from 'react';
import { useStore } from '../store/useStore';
import DayModal from './DayModal';
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    addMonths,
    subMonths,
    addDays,
    isToday,
    isSameMonth,
    isSameDay,
    parseISO
} from 'date-fns';

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const calendarNotes = useStore(state => state.calendarNotes);
    const cycleStartDate = useStore(state => state.cycleStartDate);

    // Calculate 90-day cycle dates
    const cycleStart = cycleStartDate ? parseISO(cycleStartDate) : null;
    const cycleEnd = cycleStart ? addDays(cycleStart, 89) : null; // 90 days total (day 0 to day 89)

    // Generate calendar days for the current month view
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const handleToday = () => setCurrentDate(new Date());

    const handleDayClick = (date) => {
        setSelectedDate(format(date, 'yyyy-MM-dd'));
    };

    return (
        <div className="w-full">
            {/* Header with navigation */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleToday}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        Today
                    </button>
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        aria-label="Previous month"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        aria-label="Next month"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Week day headers */}
                <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    {weekDays.map(day => (
                        <div
                            key={day}
                            className="py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7">
                    {days.map((day, index) => {
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const dayNotes = calendarNotes[dateKey] || [];
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const isTodayDate = isToday(day);
                        const isCycleStart = cycleStart && isSameDay(day, cycleStart);
                        const isCycleEnd = cycleEnd && isSameDay(day, cycleEnd);

                        return (
                            <button
                                key={dateKey}
                                onClick={() => handleDayClick(day)}
                                className={`
                                    relative min-h-[100px] sm:min-h-[120px] p-2 border-b border-r border-gray-200 dark:border-gray-700
                                    transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 group text-left
                                    ${!isCurrentMonth ? 'bg-gray-50/50 dark:bg-gray-800/30' : ''}
                                    ${index % 7 === 6 ? 'border-r-0' : ''}
                                `}
                            >
                                {/* Day number with cycle indicators */}
                                <div className="relative">
                                    {/* Hollow circle for cycle start (green) or end (red) */}
                                    {(isCycleStart || isCycleEnd) && (
                                        <div
                                            className={`absolute inset-0 w-8 h-8 rounded-full border-2 ${isCycleStart
                                                    ? 'border-green-500'
                                                    : 'border-red-500'
                                                }`}
                                            title={isCycleStart ? '90-Day Challenge Start' : '90-Day Challenge End'}
                                        />
                                    )}
                                    <div className={`
                                        flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                                        ${isTodayDate
                                            ? 'bg-blue-600 text-white'
                                            : isCurrentMonth
                                                ? 'text-gray-900 dark:text-gray-100'
                                                : 'text-gray-400 dark:text-gray-600'
                                        }
                                    `}>
                                        {format(day, 'd')}
                                    </div>
                                </div>

                                {/* Notes preview - now shows multiple colored notes */}
                                {dayNotes && dayNotes.length > 0 && (
                                    <div className="space-y-1 mt-1">
                                        {dayNotes.slice(0, 3).map(note => (
                                            <div
                                                key={note.id}
                                                className="text-xs px-1.5 py-0.5 rounded truncate"
                                                style={{
                                                    backgroundColor: note.color + '25',
                                                    borderLeft: `3px solid ${note.color}`,
                                                    color: 'inherit'
                                                }}
                                            >
                                                {note.text}
                                            </div>
                                        ))}
                                        {dayNotes.length > 3 && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400 pl-1">
                                                +{dayNotes.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Hover indicator */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/5 dark:bg-white/5 transition-opacity pointer-events-none">
                                    <span className="text-2xl">📝</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Day Modal */}
            {selectedDate && (
                <DayModal
                    date={selectedDate}
                    onClose={() => setSelectedDate(null)}
                />
            )}
        </div>
    );
}
