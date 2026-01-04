import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LocalDataPrompt() {
    const { showLocalDataPrompt, backupLocalData, skipBackup, user } = useAuth();
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [error, setError] = useState('');

    if (!showLocalDataPrompt) return null;

    const handleBackup = async () => {
        setIsBackingUp(true);
        setError('');
        try {
            await backupLocalData();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsBackingUp(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                {/* Icon and header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold">Local Data Found!</h2>
                    <p className="text-green-100 mt-1">
                        Welcome, {user?.email}!
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 text-center">
                        We found existing data on this device. Would you like to back it up to your account?
                    </p>

                    <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 
                                  text-amber-700 dark:text-amber-300 px-4 py-3 rounded-lg text-sm">
                        <strong>Important:</strong> This will save all your habits, calendar notes, and todos to the cloud.
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 
                                      text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={handleBackup}
                            disabled={isBackingUp}
                            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 
                                     text-white font-semibold rounded-lg shadow-lg
                                     hover:from-green-600 hover:to-emerald-700
                                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            {isBackingUp ? (
                                <>
                                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Backing up...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    Yes, Backup My Data
                                </>
                            )}
                        </button>

                        <button
                            onClick={skipBackup}
                            disabled={isBackingUp}
                            className="w-full py-2 text-gray-500 dark:text-gray-400 
                                     hover:text-gray-700 dark:hover:text-gray-300 text-sm
                                     disabled:opacity-50"
                        >
                            Skip for now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
