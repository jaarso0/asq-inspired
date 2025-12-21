import { LEVELS } from '../data/domainConfig';

export default function LevelBadge({ level }) {
    const levelInfo = LEVELS[level];

    const colorClasses = {
        1.0: 'bg-blue-100 text-blue-800 border-blue-200',
        2.0: 'bg-purple-100 text-purple-800 border-purple-200',
        3.0: 'bg-amber-100 text-amber-800 border-amber-200'
    };

    return (
        <div className={`badge border ${colorClasses[level]}`}>
            <span className="font-semibold">{level}</span>
            <span className="mx-1">·</span>
            <span>{levelInfo.name}</span>
        </div>
    );
}
