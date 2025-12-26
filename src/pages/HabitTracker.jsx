import { useState } from 'react';
import { useStore } from '../store/useStore';
import { DOMAINS } from '../data/domainConfig';
import HabitTracker90Day from '../components/HabitTracker90Day';

export default function HabitTracker() {
    const domains = useStore(state => state.domains);
    const [selectedDomain, setSelectedDomain] = useState('body');

    const domainIds = ['body', 'mind', 'vocation', 'spirit'];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Habit Tracker
                </h1>
                <p className="text-gray-600">
                    Track your daily habits across all four domains over a 90-day cycle
                </p>
            </div>

            {/* Domain Selector */}
            <div className="card">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {domainIds.map(domainId => {
                        const domainConfig = DOMAINS[domainId];
                        const isSelected = selectedDomain === domainId;

                        return (
                            <button
                                key={domainId}
                                onClick={() => setSelectedDomain(domainId)}
                                className={`p-4 rounded-lg border-2 transition-all ${isSelected
                                        ? 'border-gray-900 bg-gray-50 shadow-md'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex flex-col items-center space-y-2">
                                    <span className="text-3xl">{domainConfig.icon}</span>
                                    <span className={`text-sm font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-600'
                                        }`}>
                                        {domainConfig.name}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Domain Habit Tracker */}
            <div className="card">
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200">
                    <span className="text-3xl">{DOMAINS[selectedDomain].icon}</span>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {DOMAINS[selectedDomain].name} Habits
                    </h2>
                </div>

                <HabitTracker90Day domainId={selectedDomain} />
            </div>
        </div>
    );
}
