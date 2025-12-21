import { useState } from 'react';

export default function AddHabitModal({ isOpen, onClose, domainId, domainName, onAdd }) {
    const [habitName, setHabitName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (habitName.trim()) {
            onAdd(habitName.trim());
            setHabitName('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Add New Habit
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Domain
                        </label>
                        <input
                            type="text"
                            value={domainName}
                            disabled
                            className="input bg-gray-50 text-gray-600 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Habit Name
                        </label>
                        <input
                            type="text"
                            value={habitName}
                            onChange={(e) => setHabitName(e.target.value)}
                            placeholder="e.g., Meditate for 10 minutes"
                            className="input"
                            autoFocus
                        />
                    </div>

                    <div className="flex space-x-3 pt-2">
                        <button
                            type="submit"
                            disabled={!habitName.trim()}
                            className={`flex-1 btn-primary ${!habitName.trim() ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            Add Habit
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
