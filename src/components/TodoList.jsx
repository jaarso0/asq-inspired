import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { format, addDays, subDays, isToday, isFuture } from 'date-fns';

export default function TodoList() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [newTodoText, setNewTodoText] = useState('');

    const dailyTodos = useStore(state => state.dailyTodos);
    const addTodo = useStore(state => state.addTodo);
    const toggleTodo = useStore(state => state.toggleTodo);
    const removeTodo = useStore(state => state.removeTodo);
    const cleanOldTodos = useStore(state => state.cleanOldTodos);

    const dateKey = format(currentDate, 'yyyy-MM-dd');
    const todos = dailyTodos[dateKey] || [];
    const isTodayDate = isToday(currentDate);
    const isFutureDate = isFuture(currentDate);

    // Clean old todos on mount
    useEffect(() => {
        cleanOldTodos();
    }, [cleanOldTodos]);

    // Calculate how many days back we can go (7 days max)
    const sevenDaysAgo = subDays(new Date(), 7);
    const canGoBack = currentDate > sevenDaysAgo;
    const canGoForward = !isTodayDate;

    const handlePrevDay = () => {
        if (canGoBack) {
            setCurrentDate(subDays(currentDate, 1));
        }
    };

    const handleNextDay = () => {
        if (canGoForward) {
            setCurrentDate(addDays(currentDate, 1));
        }
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const handleAddTodo = () => {
        if (newTodoText.trim() && isTodayDate) {
            addTodo(dateKey, newTodoText.trim());
            setNewTodoText('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTodo();
        }
    };

    const displayDate = format(currentDate, 'EEEE, MMM d');

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Header with navigation */}
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <button
                        onClick={handlePrevDay}
                        disabled={!canGoBack}
                        className={`p-2 rounded-lg transition-colors ${canGoBack
                                ? 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                            }`}
                        title="Previous day"
                    >
                        ◀
                    </button>

                    <div className="text-center">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                            {isTodayDate ? "Today's Tasks" : displayDate}
                        </h3>
                        {!isTodayDate && (
                            <button
                                onClick={handleToday}
                                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                Back to Today
                            </button>
                        )}
                    </div>

                    <button
                        onClick={handleNextDay}
                        disabled={!canGoForward}
                        className={`p-2 rounded-lg transition-colors ${canGoForward
                                ? 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                            }`}
                        title="Next day"
                    >
                        ▶
                    </button>
                </div>
            </div>

            {/* Todo list */}
            <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
                {todos.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                        <span className="text-3xl mb-2 block">📋</span>
                        <p className="text-sm">
                            {isTodayDate
                                ? 'No tasks yet. Add your first task!'
                                : 'No tasks for this day.'}
                        </p>
                    </div>
                ) : (
                    todos.map(todo => (
                        <div
                            key={todo.id}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${todo.completed
                                    ? 'bg-green-50 dark:bg-green-900/20'
                                    : 'bg-gray-50 dark:bg-gray-800'
                                }`}
                        >
                            {/* Checkbox */}
                            <button
                                onClick={() => toggleTodo(dateKey, todo.id)}
                                disabled={!isTodayDate}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${todo.completed
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : isTodayDate
                                            ? 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                                            : 'border-gray-200 dark:border-gray-700 cursor-not-allowed'
                                    }`}
                            >
                                {todo.completed && <span className="text-xs">✓</span>}
                            </button>

                            {/* Task text */}
                            <span className={`flex-1 ${todo.completed
                                    ? 'line-through text-gray-400 dark:text-gray-500'
                                    : 'text-gray-800 dark:text-gray-200'
                                }`}>
                                {todo.text}
                            </span>

                            {/* Delete button (only for today) */}
                            {isTodayDate && (
                                <button
                                    onClick={() => removeTodo(dateKey, todo.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                    title="Delete task"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Add new todo (only for today) */}
            {isTodayDate && (
                <div className="px-4 pb-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTodoText}
                            onChange={(e) => setNewTodoText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Add a task..."
                            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                        <button
                            onClick={handleAddTodo}
                            disabled={!newTodoText.trim()}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </div>
            )}

            {/* Footer info */}
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
                {isTodayDate
                    ? `${todos.filter(t => t.completed).length}/${todos.length} completed`
                    : 'Viewing past tasks (read-only)'
                }
            </div>
        </div>
    );
}
