import { Link } from 'react-router-dom';
import { DOMAINS } from '../data/domainConfig';
import LevelBadge from './LevelBadge';
import PhaseBadge from './PhaseBadge';
import WeeklyProgress from './WeeklyProgress';
import { getWeeklyProgress } from '../utils/levelProgression';

export default function DomainCard({ domain, isFocus }) {
    const domainConfig = DOMAINS[domain.id];
    const weeklyProgress = getWeeklyProgress(domain.habits);

    return (
        <Link to={`/domain/${domain.id}`}>
            <div className={`card hover:scale-[1.02] transition-transform cursor-pointer ${isFocus ? 'ring-2 ring-gray-900 ring-offset-2' : ''
                }`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <span className="text-4xl">{domainConfig.icon}</span>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {domainConfig.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {domainConfig.description}
                            </p>
                        </div>
                    </div>

                    {isFocus && (
                        <div className="flex items-center space-x-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            <span>🎯</span>
                            <span>Focus</span>
                        </div>
                    )}
                </div>

                {/* Level & Phase */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <LevelBadge level={domain.currentLevel} />
                    <PhaseBadge phase={domain.currentPhase} />
                </div>

                {/* Weekly Progress */}
                {domain.habits.length > 0 && (
                    <WeeklyProgress percentage={weeklyProgress} />
                )}

                {/* Assessment prompt if not completed */}
                {!domain.assessmentCompleted && (
                    <div className="mt-4 text-sm text-gray-600 italic">
                        Complete self-assessment to begin →
                    </div>
                )}
            </div>
        </Link>
    );
}
