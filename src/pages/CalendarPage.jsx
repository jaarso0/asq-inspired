import Calendar from '../components/Calendar';
import TodoList from '../components/TodoList';

export default function CalendarPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                    📅 Calendar
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Click on any day to add notes and highlight with colors
                </p>
            </div>

            {/* Grid layout: Calendar + TodoList */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar - takes 2 columns on large screens */}
                <div className="lg:col-span-2">
                    <Calendar />
                </div>

                {/* TodoList - takes 1 column on large screens */}
                <div>
                    <TodoList />
                </div>
            </div>
        </div>
    );
}
