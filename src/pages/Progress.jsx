import { useStore } from '../store/useStore';
import { DOMAINS } from '../data/domainConfig';
import RadarChart from '../components/RadarChart';
import Timeline from '../components/Timeline';
import { calculateHabitCompletionRate } from '../utils/levelProgression';

export default function Progress() {
    const domains = useStore(state => state.domains);

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

            {/* Progress Bars */}
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
                                    <span className="text-sm font-medium text-gray-600">
                                        {completionRate}%
                                    </span>
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
        </div>
    );
}
