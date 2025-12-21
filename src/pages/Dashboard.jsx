import { useStore } from '../store/useStore';
import DomainCard from '../components/DomainCard';
import { MICRO_COPY, DOMAINS } from '../data/domainConfig';

export default function Dashboard() {
    const domains = useStore(state => state.domains);
    const focusDomains = useStore(state => state.focusDomains);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Your Development Journey
                </h1>
                <p className="text-gray-600">
                    {MICRO_COPY.dashboard.welcome}
                </p>
            </div>

            {/* Focus Domain Message */}
            {focusDomains.length > 0 ? (
                <div className="card bg-amber-50 border-amber-200 text-center">
                    <p className="text-amber-800 font-medium">
                        🎯 You're focusing on {focusDomains.length} domain{focusDomains.length > 1 ? 's' : ''}: {' '}
                        {focusDomains.map(id => DOMAINS[id].name).join(' & ')}
                    </p>
                    {focusDomains.length < 2 && (
                        <p className="text-amber-700 text-sm mt-1">
                            You can select one more focus domain
                        </p>
                    )}
                </div>
            ) : (
                <div className="card bg-blue-50 border-blue-200 text-center">
                    <p className="text-blue-700 text-sm">
                        Select up to 2 domains to focus on for your 90-day cycle
                    </p>
                </div>
            )}

            {/* Domain Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.values(domains).map(domain => (
                    <DomainCard
                        key={domain.id}
                        domain={domain}
                        isFocus={focusDomains.includes(domain.id)}
                    />
                ))}
            </div>
        </div>
    );
}
