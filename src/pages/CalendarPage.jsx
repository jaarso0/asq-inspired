import Calendar from '../components/Calendar';

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
            <Calendar />
        </div>
    );
}
