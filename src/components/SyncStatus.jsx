import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function SyncStatus() {
    const { syncStatus, syncEnabled, isAuthenticated } = useAuth();
    const [visible, setVisible] = useState(false);

    // Show indicator when syncing, then hide 2 seconds after synced
    useEffect(() => {
        if (syncStatus === 'syncing') {
            setVisible(true);
        } else if (syncStatus === 'synced') {
            // Keep visible for 2 seconds after sync completes, then hide
            const timer = setTimeout(() => setVisible(false), 2000);
            return () => clearTimeout(timer);
        } else if (syncStatus === 'error') {
            setVisible(true); // Keep visible on error
        }
    }, [syncStatus]);

    // Don't render if not authenticated or not visible
    if (!isAuthenticated || !syncEnabled || !visible) return null;

    const getStatusContent = () => {
        switch (syncStatus) {
            case 'syncing':
                return (
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                        <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-xs">Syncing...</span>
                    </div>
                );
            case 'synced':
                return (
                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs">Synced</span>
                    </div>
                );
            case 'error':
                return (
                    <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs">Sync error</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="py-1 px-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 transition-opacity">
            {getStatusContent()}
        </div>
    );
}

