import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useStore } from '../store/useStore';
import { useAuth } from '../contexts/AuthContext';
import SyncStatus from './SyncStatus';
import AuthModal from './AuthModal';

export default function Layout({ children }) {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const theme = useStore(state => state.theme);
    const { user, isAuthenticated, logout } = useAuth();

    // Apply theme to document
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userMenuOpen && !e.target.closest('.user-menu-container')) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [userMenuOpen]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
            {/* Auth Modal */}
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Header */}
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left side: Hamburger + Logo */}
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            {/* Hamburger Menu */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none transition-colors"
                                aria-label="Open menu"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>

                            {/* Logo */}
                            <Link to="/" className="flex items-center space-x-2">
                                <span className="text-2xl">🌱</span>
                                <div className="hidden sm:block">
                                    <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50 transition-colors">Human 3.0</h1>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Personal Development</p>
                                </div>
                                <div className="sm:hidden">
                                    <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50 transition-colors">Human 3.0</h1>
                                </div>
                            </Link>
                        </div>

                        {/* Right side: Icon Navigation + User Menu */}
                        <nav className="flex items-center space-x-2">
                            {/* Sync Status */}
                            <SyncStatus />

                            {/* Habit Tracker Icon */}
                            <Link
                                to="/habit-tracker"
                                className={`p-2 rounded-md text-xl transition-colors ${location.pathname === '/habit-tracker'
                                    ? 'bg-gray-100 dark:bg-gray-800'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                title="Habit Tracker"
                            >
                                ✅
                            </Link>
                            {/* Calendar Icon */}
                            <Link
                                to="/calendar"
                                className={`p-2 rounded-md text-xl transition-colors ${location.pathname === '/calendar'
                                    ? 'bg-gray-100 dark:bg-gray-800'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                title="Calendar"
                            >
                                📅
                            </Link>

                            {/* User Menu */}
                            <div className="relative user-menu-container">
                                {isAuthenticated ? (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setUserMenuOpen(!userMenuOpen);
                                            }}
                                            className="flex items-center justify-center w-8 h-8 rounded-full 
                                                     bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium
                                                     hover:from-indigo-600 hover:to-purple-600 transition-all"
                                            title={user?.email}
                                        >
                                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                                        </button>

                                        {/* Dropdown Menu */}
                                        {userMenuOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg 
                                                          border border-gray-200 dark:border-gray-700 py-1 z-50">
                                                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        {user?.email}
                                                    </p>
                                                    <p className="text-xs text-green-600 dark:text-green-400">
                                                        Cloud sync enabled
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setUserMenuOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 
                                                             hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    Sign out
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setAuthModalOpen(true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                                                 bg-gradient-to-r from-indigo-500 to-purple-500 text-white
                                                 hover:from-indigo-600 hover:to-purple-600 transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                        </svg>
                                        <span className="hidden sm:inline">Sync</span>
                                    </button>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 italic transition-colors">
                        "Growth is not linear. It's cyclical, interconnected, and emergent."
                    </p>
                </div>
            </footer>
        </div>
    );
}

