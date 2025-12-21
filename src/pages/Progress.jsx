import { useState } from 'react';
import { useStore } from '../store/useStore';
import { DOMAINS } from '../data/domainConfig';
import RadarChart from '../components/RadarChart';
import Timeline from '../components/Timeline';
import HabitTracker90Day from '../components/HabitTracker90Day';
import { calculateHabitCompletionRate } from '../utils/levelProgression';

export default function Progress() {
    const domains = useStore(state => state.domains);
    const [selectedDomain, setSelectedDomain] = useState(null);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Progress & Insights
                </h1>
                <p className="text-gray-600">
                    Visualize your development across all domains
                </p>
            </div>

            {/* Radar Chart */}
            <RadarChart domains={domains} />

            {/* Progress Bars with Habit Tracker Buttons */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Habit Completion (Last 30 Days)
                </h3>
                <div className="space-y-4">
                    {Object.values(domains).map(domain => {
                        const domainConfig = DOMAINS[domain.id];
                        const completionRate = Math.round(
                            calculateHabitCompletionRate(domain.habits, 30) * 100
                        );

                        return (
                            <div key={domain.id}>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl">{domainConfig.icon}</span>
                                        <span className="font-medium text-gray-900">
                                            {domainConfig.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm font-medium text-gray-600">
                                            {completionRate}%
                                        </span>
                                        <button
                                            onClick={() => setSelectedDomain(domain.id)}
                                            className="btn-secondary text-sm py-1 px-3"
                                        >
                                            📊 Habit Tracker
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${completionRate}%`,
                                            backgroundColor: `var(--${domainConfig.color})`
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Timeline for each domain */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Development Timeline
                </h2>

                {Object.values(domains).map(domain => {
                    const domainConfig = DOMAINS[domain.id];

                    return (
                        <div key={domain.id}>
                            <div className="flex items-center space-x-2 mb-4">
                                <span className="text-2xl">{domainConfig.icon}</span>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {domainConfig.name}
                                </h3>
                            </div>
                            <Timeline history={domain.history} />
                        </div>
                    );
                })}
            </div>

            {/* Habit Tracker Modal */}
            {selectedDomain && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <span className="text-3xl">{DOMAINS[selectedDomain].icon}</span>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {DOMAINS[selectedDomain].name} Habit Tracker
                                </h2>
                            </div>
                            <button
                                onClick={() => setSelectedDomain(null)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6">
                            <HabitTracker90Day domainId={selectedDomain} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
