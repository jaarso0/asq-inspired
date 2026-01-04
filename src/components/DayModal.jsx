import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

const COLOR_OPTIONS = [
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Rose', value: '#f43f5e' }
];

// Style options: filled or hollow
const STYLE_OPTIONS = [
    { name: 'Filled', value: 'filled' },
    { name: 'Hollow', value: 'hollow' }
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
    const [newNoteStyle, setNewNoteStyle] = useState('filled');
    const [showColorWheel, setShowColorWheel] = useState(false);

    // State for editing existing note
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editText, setEditText] = useState('');
    const [editColor, setEditColor] = useState('');
    const [editStyle, setEditStyle] = useState('filled');

    // Format date for display
    const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleAddNote = () => {
        if (newNoteText.trim()) {
            // Encode style in color string (color:style format)
            const colorWithStyle = `${newNoteColor}:${newNoteStyle}`;
            addDayNote(date, newNoteText.trim(), colorWithStyle);
            setNewNoteText('');
            setNewNoteColor(COLOR_OPTIONS[0].value);
            setNewNoteStyle('filled');
            setShowColorWheel(false);
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
        // Parse color:style format
        const [color, style] = parseColorStyle(note.color);
        setEditColor(color);
        setEditStyle(style);
    };

    const saveEdit = () => {
        if (editText.trim() && editingNoteId) {
            const colorWithStyle = `${editColor}:${editStyle}`;
            editDayNote(date, editingNoteId, editText.trim(), colorWithStyle);
            setEditingNoteId(null);
            setEditText('');
            setEditColor('');
            setEditStyle('filled');
        }
    };

    const cancelEdit = () => {
        setEditingNoteId(null);
        setEditText('');
        setEditColor('');
        setEditStyle('filled');
    };

    const handleDelete = (noteId) => {
        removeDayNote(date, noteId);
    };

    // Parse color:style format, default to filled if no style
    const parseColorStyle = (colorString) => {
        if (colorString && colorString.includes(':')) {
            const [color, style] = colorString.split(':');
            return [color, style];
        }
        return [colorString || COLOR_OPTIONS[0].value, 'filled'];
    };

    // Get note style classes/styles
    const getNoteStyles = (colorString) => {
        const [color, style] = parseColorStyle(colorString);
        if (style === 'hollow') {
            return {
                backgroundColor: 'transparent',
                border: `2px solid ${color}`,
                borderLeft: `4px solid ${color}`
            };
        }
        return {
            backgroundColor: color + '20',
            borderLeft: `4px solid ${color}`
        };
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

    // Color picker component
    const ColorPicker = ({ selectedColor, onColorChange, selectedStyle, onStyleChange, showWheel, setShowWheel }) => (
        <div className="space-y-3">
            {/* Style toggle */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Style:</span>
                <div className="flex gap-1">
                    {STYLE_OPTIONS.map(style => (
                        <button
                            key={style.value}
                            onClick={() => onStyleChange(style.value)}
                            className={`px-3 py-1 text-xs rounded-full transition-all ${selectedStyle === style.value
                                    ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {style.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Preset colors */}
            <div className="flex gap-2 flex-wrap">
                {COLOR_OPTIONS.map(color => (
                    <button
                        key={color.value}
                        onClick={() => onColorChange(color.value)}
                        className={`w-7 h-7 rounded-full transition-all transform hover:scale-110 ${selectedColor === color.value
                                ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900 scale-110'
                                : ''
                            }`}
                        style={selectedStyle === 'hollow'
                            ? { border: `3px solid ${color.value}`, backgroundColor: 'transparent' }
                            : { backgroundColor: color.value }
                        }
                        title={color.name}
                    />
                ))}

                {/* Color wheel toggle */}
                <button
                    onClick={() => setShowWheel(!showWheel)}
                    className={`w-7 h-7 rounded-full transition-all transform hover:scale-110 flex items-center justify-center text-xs ${showWheel
                            ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900 scale-110'
                            : ''
                        }`}
                    style={{
                        background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)'
                    }}
                    title="Custom color"
                >
                    {showWheel ? '✓' : ''}
                </button>
            </div>

            {/* Color wheel input */}
            {showWheel && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => onColorChange(e.target.value)}
                        className="w-12 h-12 rounded-lg cursor-pointer border-0"
                        title="Pick custom color"
                    />
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Custom Color</p>
                        <input
                            type="text"
                            value={selectedColor}
                            onChange={(e) => onColorChange(e.target.value)}
                            className="w-full px-2 py-1 text-sm font-mono rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="#000000"
                        />
                    </div>
                    {/* Preview */}
                    <div
                        className="w-10 h-10 rounded-lg"
                        style={selectedStyle === 'hollow'
                            ? { border: `3px solid ${selectedColor}`, backgroundColor: 'transparent' }
                            : { backgroundColor: selectedColor }
                        }
                    />
                </div>
            )}
        </div>
    );

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
                                {existingNotes.map(note => {
                                    const [noteColor] = parseColorStyle(note.color);
                                    return (
                                        <div
                                            key={note.id}
                                            className="rounded-xl p-3 transition-all"
                                            style={getNoteStyles(note.color)}
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
                                                    <ColorPicker
                                                        selectedColor={editColor}
                                                        onColorChange={setEditColor}
                                                        selectedStyle={editStyle}
                                                        onStyleChange={setEditStyle}
                                                        showWheel={showColorWheel}
                                                        setShowWheel={setShowColorWheel}
                                                    />
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
                                    );
                                })}
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
                            className="flex gap-2 items-center p-2 rounded-xl transition-all"
                            style={newNoteStyle === 'hollow'
                                ? { border: `2px solid ${newNoteColor}`, backgroundColor: 'transparent' }
                                : { backgroundColor: newNoteColor + '15', border: `2px solid ${newNoteColor}50` }
                            }
                        >
                            <div
                                className="w-4 h-4 rounded-full flex-shrink-0"
                                style={newNoteStyle === 'hollow'
                                    ? { border: `2px solid ${newNoteColor}`, backgroundColor: 'transparent' }
                                    : { backgroundColor: newNoteColor }
                                }
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
                        <ColorPicker
                            selectedColor={newNoteColor}
                            onColorChange={setNewNoteColor}
                            selectedStyle={newNoteStyle}
                            onStyleChange={setNewNoteStyle}
                            showWheel={showColorWheel}
                            setShowWheel={setShowColorWheel}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
