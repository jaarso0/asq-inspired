import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { DOMAINS, LEVELS, PHASES } from '../data/domainConfig';
import LevelBadge from '../components/LevelBadge';
import PhaseBadge from '../components/PhaseBadge';
import SelfAssessment from '../components/SelfAssessment';
import HabitTracker90Day from '../components/HabitTracker90Day';
import WeeklyReflection from '../components/WeeklyReflection';
import { canAdvancePhase, canAdvanceLevel } from '../utils/levelProgression';

export default function DomainDetail() {
    const { domainId } = useParams();
    const domain = useStore(state => state.domains[domainId]);
    const focusDomains = useStore(state => state.focusDomains);
    const toggleFocusDomain = useStore(state => state.toggleFocusDomain);
    const advancePhase = useStore(state => state.advancePhase);
    const advanceLevel = useStore(state => state.advanceLevel);

    if (!domain) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Domain not found</p>
                <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
                    ← Back to Dashboard
                </Link>
            </div>
        );
    }

    const domainConfig = DOMAINS[domainId];
    const levelInfo = LEVELS[domain.currentLevel];
    const phaseInfo = PHASES[domain.currentPhase];
    const isFocus = focusDomains.includes(domainId);
    const canAddFocus = focusDomains.length < 2 || isFocus;

    const canPhaseAdvance = canAdvancePhase(domain);
    const canLevelAdvance = canAdvanceLevel(domain);

    return (
        <div className="space-y-8">
            {/* Back Button */}
            <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                ← Back to Dashboard
            </Link>

            {/* Header */}
            <div className="card">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <span className="text-5xl">{domainConfig.icon}</span>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {domainConfig.name}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {domainConfig.description}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => toggleFocusDomain(domainId)}
                        disabled={!canAddFocus}
                        className={`btn-secondary ${isFocus ? 'ring-2 ring-gray-900' : ''
                            } ${!canAddFocus ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={!canAddFocus ? 'Maximum 2 focus domains allowed' : ''}
                    >
                        {isFocus ? '🎯 Focus Domain' : 'Set as Focus'}
                    </button>
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                    <LevelBadge level={domain.currentLevel} />
                    <PhaseBadge phase={domain.currentPhase} />
                </div>

                {/* Level & Phase Info */}
                <div className="mt-6 space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">
                            {levelInfo.name} ({levelInfo.subtitle})
                        </h3>
                        <p className="text-sm text-gray-700 mb-2">
                            {levelInfo.description}
                        </p>
                        <p className="text-sm text-gray-600 italic">
                            {levelInfo.philosophy}
                        </p>
                    </div>

                    <div className={`rounded-lg p-4 ${domain.currentPhase === 'dissonance' ? 'bg-red-50' :
                        domain.currentPhase === 'uncertainty' ? 'bg-amber-50' :
                            'bg-emerald-50'
                        }`}>
                        <h3 className="font-semibold text-gray-900 mb-1">
                            Phase: {phaseInfo.name}
                        </h3>
                        <p className="text-sm text-gray-700 mb-2">
                            {phaseInfo.description}
                        </p>
                        <p className="text-sm text-gray-600 italic">
                            {phaseInfo.guidance}
                        </p>
                    </div>
                </div>
            </div>

            {/* Progression Actions */}
            {canLevelAdvance && (
                <div className="card bg-emerald-50 border-emerald-200">
                    <h3 className="font-semibold text-emerald-900 mb-2">
                        Ready to Advance to Level {domain.currentLevel === 1.0 ? '2.0' : '3.0'}
                    </h3>
                    <p className="text-sm text-emerald-700 mb-4">
                        You've met all the requirements. Take a moment to reflect on your growth before advancing.
                    </p>
                    <button
                        onClick={() => advanceLevel(domainId)}
                        className="btn-primary bg-emerald-600 hover:bg-emerald-700"
                    >
                        Advance to Next Level
                    </button>
                </div>
            )}

            {canPhaseAdvance && !canLevelAdvance && (
                <div className="card bg-blue-50 border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">
                        Ready to Advance Phase
                    </h3>
                    <p className="text-sm text-blue-700 mb-4">
                        You're ready to move to the next phase of development.
                    </p>
                    <button
                        onClick={() => advancePhase(domainId)}
                        className="btn-primary bg-blue-600 hover:bg-blue-700"
                    >
                        Advance to {PHASES[domain.currentPhase === 'dissonance' ? 'uncertainty' : 'discovery'].name}
                    </button>
                </div>
            )}

            {/* Self-Assessment */}
            {!domain.assessmentCompleted && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Self-Assessment
                    </h2>
                    <SelfAssessment domainId={domainId} />
                </div>
            )}

            {/* 90-Day Habit Tracker */}
            {domain.assessmentCompleted && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        90-Day Habit Tracker
                    </h2>
                    <HabitTracker90Day domainId={domainId} />
                </div>
            )}

            {/* Weekly Reflection */}
            {domain.assessmentCompleted && (
                <div>
                    <WeeklyReflection domainId={domainId} />
                </div>
            )}
        </div>
    );
}
