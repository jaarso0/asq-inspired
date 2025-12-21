import { formatReadableDate } from '../utils/dateHelpers';
import { LEVELS, PHASES } from '../data/domainConfig';

export default function Timeline({ history }) {
    if (!history || history.length === 0) {
        return (
            <div className="card">
                <p className="text-gray-600 text-sm">No history yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {history.map((entry, index) => {
                const levelInfo = LEVELS[entry.level];
                const phaseInfo = PHASES[entry.phase];
                const isActive = entry.endDate === null;

                return (
                    <div key={index} className="flex">
                        {/* Timeline line */}
                        <div className="flex flex-col items-center mr-4">
                            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-gray-900' : 'bg-gray-400'
                                }`} />
                            {index < history.length - 1 && (
                                <div className="w-0.5 h-full bg-gray-300 my-1" />
                            )}
                        </div>

                        {/* Content */}
                        <div className={`card flex-1 ${isActive ? 'ring-2 ring-gray-900' : ''
                            }`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="font-semibold text-gray-900">
                                        Level {entry.level} · {phaseInfo.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {levelInfo.description}
                                    </p>
                                </div>
                                {isActive && (
                                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                        Current
                                    </span>
                                )}
                            </div>

                            <div className="mt-3 text-xs text-gray-500">
                                <span>{formatReadableDate(entry.startDate)}</span>
                                {entry.endDate && (
                                    <>
                                        <span className="mx-2">→</span>
                                        <span>{formatReadableDate(entry.endDate)}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
