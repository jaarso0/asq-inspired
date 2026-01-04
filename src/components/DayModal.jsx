import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

const COLOR_OPTIONS = [
    { name: 'Red', value: '#ef4444', bg: 'bg-red-500' },
    { name: 'Orange', value: '#f97316', bg: 'bg-orange-500' },
    { name: 'Yellow', value: '#eab308', bg: 'bg-yellow-500' },
    { name: 'Green', value: '#22c55e', bg: 'bg-green-500' },
    { name: 'Blue', value: '#3b82f6', bg: 'bg-blue-500' },
    { name: 'Purple', value: '#a855f7', bg: 'bg-purple-500' }
];

export default function DayModal({ date, onClose }) {
    const calendarNotes = useStore(state => state.calendarNotes);
    const addDayNote = useStore(state => state.addDayNote);
    const editDayNote = useStore(state => state.editDayNote);
    const removeDayNote = useStore(state => state.removeDayNote);

    const existingNotes = calendarNotes[date] || [];

    // State for new note input
    const [newNoteText, setNewNoteText] = useState('');
    const [newNoteColor, setNewNoteColor] = useState(COLOR_OPTIONS[0].value);

    // State for editing existing note
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editText, setEditText] = useState('');
    const [editColor, setEditColor] = useState('');

    // Format date for display
    const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleAddNote = () => {
        if (newNoteText.trim()) {
            addDayNote(date, newNoteText.trim(), newNoteColor);
            setNewNoteText('');
            setNewNoteColor(COLOR_OPTIONS[0].value);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddNote();
        }
    };

    const startEditing = (note) => {
        setEditingNoteId(note.id);
        setEditText(note.text);
        setEditColor(note.color);
    };

    const saveEdit = () => {
        if (editText.trim() && editingNoteId) {
            editDayNote(date, editingNoteId, editText.trim(), editColor);
            setEditingNoteId(null);
            setEditText('');
            setEditColor('');
        }
    };

    const cancelEdit = () => {
        setEditingNoteId(null);
        setEditText('');
        setEditColor('');
    };

    const handleDelete = (noteId) => {
        removeDayNote(date, noteId);
    };

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                if (editingNoteId) {
                    cancelEdit();
                } else {
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose, editingNoteId]);

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                                {displayDate}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {/* Existing Notes */}
                        {existingNotes.length > 0 && (
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Notes
                                </label>
                                {existingNotes.map(note => (
                                    <div
                                        key={note.id}
                                        className="rounded-xl p-3 transition-all"
                                        style={{ backgroundColor: note.color + '20', borderLeft: `4px solid ${note.color}` }}
                                    >
                                        {editingNoteId === note.id ? (
                                            // Edit mode
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={editText}
                                                    onChange={e => setEditText(e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    autoFocus
                                                />
                                                <div className="flex gap-2 flex-wrap">
                                                    {COLOR_OPTIONS.map(color => (
                                                        <button
                                                            key={color.value}
                                                            onClick={() => setEditColor(color.value)}
                                                            className={`w-7 h-7 rounded-full ${color.bg} transition-all transform hover:scale-110 ${editColor === color.value
                                                                    ? 'ring-2 ring-offset-1 ring-gray-400 dark:ring-offset-gray-900 scale-110'
                                                                    : ''
                                                                }`}
                                                            title={color.name}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={saveEdit}
                                                        className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // Display mode
                                            <div className="flex items-start justify-between gap-3">
                                                <p className="text-gray-800 dark:text-gray-200 flex-1">{note.text}</p>
                                                <div className="flex gap-1 flex-shrink-0">
                                                    <button
                                                        onClick={() => startEditing(note)}
                                                        className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(note.id)}
                                                        className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty state */}
                        {existingNotes.length === 0 && (
                            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                <span className="text-4xl mb-2 block">📝</span>
                                <p>No notes yet. Add your first note below!</p>
                            </div>
                        )}
                    </div>

                    {/* Add New Note Section - Fixed at bottom */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Add New Note
                        </label>

                        {/* Input with color preview */}
                        <div
                            className="flex gap-2 items-center p-2 rounded-xl border-2 transition-all"
                            style={{
                                backgroundColor: newNoteColor + '15',
                                borderColor: newNoteColor + '50'
                            }}
                        >
                            <div
                                className="w-4 h-4 rounded-full flex-shrink-0"
                                style={{ backgroundColor: newNoteColor }}
                            />
                            <input
                                type="text"
                                value={newNoteText}
                                onChange={e => setNewNoteText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a note and press Enter..."
                                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                            />
                            <button
                                onClick={handleAddNote}
                                disabled={!newNoteText.trim()}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm rounded-lg font-medium transition-colors"
                            >
                                Add
                            </button>
                        </div>

                        {/* Color picker */}
                        <div className="flex gap-2 flex-wrap">
                            {COLOR_OPTIONS.map(color => (
                                <button
                                    key={color.value}
                                    onClick={() => setNewNoteColor(color.value)}
                                    className={`w-8 h-8 rounded-full ${color.bg} transition-all transform hover:scale-110 ${newNoteColor === color.value
                                            ? 'ring-3 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800 scale-110'
                                            : ''
                                        }`}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
