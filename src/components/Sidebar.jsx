import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation();

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: '🏠' },
        { path: '/progress', label: 'Progress', icon: '📊' },
        { path: '/habit-tracker', label: 'Habit Tracker', icon: '✅' },
        { path: '/settings', label: 'Settings', icon: '⚙️' }
    ];

    const handleLinkClick = () => {
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Menu</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="p-4">
                    <ul className="space-y-2">
                        {menuItems.map(item => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    onClick={handleLinkClick}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50 font-medium'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                                        }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Human 3.0 v1.0
                    </p>
                </div>
            </div>
        </>
    );
}
