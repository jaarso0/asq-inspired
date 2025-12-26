import { useStore } from '../store/useStore';
import { formatDate } from '../utils/dateHelpers';

export default function Settings() {
    const resetAllData = useStore(state => state.resetAllData);
    const cycleStartDate = useStore(state => state.cycleStartDate);
    const domains = useStore(state => state.domains);
    const theme = useStore(state => state.theme);
    const toggleTheme = useStore(state => state.toggleTheme);

    // Calculate approximate storage usage
    const calculateStorageSize = () => {
        try {
            const storageData = localStorage.getItem('human-3.0-storage');
            if (storageData) {
                const sizeInBytes = new Blob([storageData]).size;
                const sizeInKB = (sizeInBytes / 1024).toFixed(2);
                return `${sizeInKB} KB`;
            }
        } catch (error) {
            return 'Unknown';
        }
        return '0 KB';
    };

    // Count total habits across all domains
    const totalHabits = Object.values(domains).reduce(
        (sum, domain) => sum + (domain.habits?.length || 0),
        0
    );

    const handleResetData = () => {
        const confirmed = window.confirm(
            '⚠️ WARNING: This will permanently delete ALL your data including:\n\n' +
            '• All habits and habit completions\n' +
            '• All levels and progress\n' +
            '• All reflections and assessments\n' +
            '• All focus domain selections\n' +
            '• All history and timeline data\n\n' +
            'This action CANNOT be undone. Are you absolutely sure you want to continue?'
        );

        if (confirmed) {
            const doubleConfirm = window.confirm(
                'Are you REALLY sure? This is your last chance to cancel before all data is permanently deleted.'
            );

            if (doubleConfirm) {
                resetAllData();
                alert('✅ All data has been reset successfully.');
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage your preferences and data
                </p>
            </div>

            {/* Appearance Section */}
            <div className="card bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-4">
                    🎨 Appearance
                </h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                Dark Mode
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                Current theme: <span className="font-semibold capitalize">{theme}</span>
                            </p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            type="button"
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                            aria-label="Toggle theme"
                        >
                            <span
                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Data & Storage Section */}
            <div className="card bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-4">
                    📊 Data & Storage
                </h2>

                <div className="space-y-4">
                    {/* Storage Info */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3 border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Storage Used
                            </span>
                            <span className="text-sm text-gray-900 dark:text-gray-50 font-semibold">
                                {calculateStorageSize()}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Total Habits
                            </span>
                            <span className="text-sm text-gray-900 dark:text-gray-50 font-semibold">
                                {totalHabits}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Cycle Start Date
                            </span>
                            <span className="text-sm text-gray-900 dark:text-gray-50 font-semibold">
                                {formatDate(cycleStartDate)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Active Domains
                            </span>
                            <span className="text-sm text-gray-900 dark:text-gray-50 font-semibold">
                                {Object.keys(domains).length}
                            </span>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="border-2 border-red-200 dark:border-red-900/50 rounded-lg p-4 bg-red-50 dark:bg-red-950/30">
                        <h3 className="text-sm font-semibold text-red-900 dark:text-red-400 mb-2">
                            ⚠️ Danger Zone
                        </h3>
                        <p className="text-xs text-red-700 dark:text-red-300 mb-4">
                            Permanently delete all your data and start fresh. This action cannot be undone.
                        </p>
                        <button
                            onClick={handleResetData}
                            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white text-sm font-medium rounded-md transition-colors"
                        >
                            🗑️ Reset All Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications Section (Placeholder) */}
            <div className="card bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-4">
                    🔔 Notifications
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Notification settings coming soon...
                </p>
            </div>
        </div>
    );
}
