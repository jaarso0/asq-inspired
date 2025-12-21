import { PHASES } from '../data/domainConfig';

export default function PhaseBadge({ phase }) {
    const phaseInfo = PHASES[phase];

    const colorClasses = {
        dissonance: 'bg-red-50 text-red-700 border-red-200',
        uncertainty: 'bg-amber-50 text-amber-700 border-amber-200',
        discovery: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };

    return (
        <div className={`badge border ${colorClasses[phase]}`}>
            {phaseInfo.name}
        </div>
    );
}
