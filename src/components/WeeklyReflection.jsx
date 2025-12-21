import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { MICRO_COPY } from '../data/domainConfig';
import { getWeekLabel, getCurrentWeekStart } from '../utils/dateHelpers';

export default function WeeklyReflection({ domainId }) {
    const saveReflection = useStore(state => state.saveReflection);
    const getCurrentWeekReflection = useStore(state => state.getCurrentWeekReflection);

    const existingReflection = getCurrentWeekReflection(domainId);
    const [content, setContent] = useState(existingReflection?.content || '');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (existingReflection) {
            setContent(existingReflection.content);
        }
    }, [existingReflection]);

    const handleSave = () => {
        if (content.trim()) {
            saveReflection(domainId, content);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    };

    const weekLabel = getWeekLabel(getCurrentWeekStart());

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Weekly Reflection
                </h3>
                <p className="text-sm text-gray-600">
                    Week of {weekLabel}
                </p>
            </div>

            <div className="card bg-purple-50 border-purple-200">
                <p className="text-sm text-purple-800 italic">
                    {MICRO_COPY.reflection.prompt}
                </p>
            </div>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your reflection here..."
                rows={6}
                className="textarea"
            />

            <div className="flex items-center justify-between">
                <button
                    onClick={handleSave}
                    disabled={!content.trim()}
                    className={`btn-primary ${!content.trim() ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    Save Reflection
                </button>

                {saved && (
                    <span className="text-sm text-emerald-600 font-medium">
                        ✓ {MICRO_COPY.reflection.saved}
                    </span>
                )}
            </div>
        </div>
    );
}
