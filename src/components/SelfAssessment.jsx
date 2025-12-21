import { useState } from 'react';
import { ASSESSMENT_QUESTIONS, calculateLevelFromScore } from '../data/assessmentQuestions';
import { useStore } from '../store/useStore';

export default function SelfAssessment({ domainId }) {
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const completeAssessment = useStore(state => state.completeAssessment);

    // Get all questions for this domain
    const allQuestions = [
        ...ASSESSMENT_QUESTIONS[domainId][1.0],
        ...ASSESSMENT_QUESTIONS[domainId][2.0],
        ...ASSESSMENT_QUESTIONS[domainId][3.0]
    ];

    const handleAnswer = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const calculateScore = () => {
        const totalQuestions = allQuestions.length;
        const totalPoints = Object.values(answers).reduce((sum, val) => sum + val, 0);
        const maxPoints = totalQuestions * 5; // 5-point scale
        return Math.round((totalPoints / maxPoints) * 100);
    };

    const handleSubmit = () => {
        const score = calculateScore();
        const level = calculateLevelFromScore(score);
        completeAssessment(domainId, score, level);
        setShowResults(true);
    };

    const allAnswered = allQuestions.every(q => answers[q.id] !== undefined);

    if (showResults) {
        const score = calculateScore();
        const level = calculateLevelFromScore(score);

        return (
            <div className="card bg-emerald-50 border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                    ✓ Assessment Complete
                </h3>
                <p className="text-emerald-700 mb-4">
                    Your assessment indicates you're at Level {level}. Habits and guidance have been customized for your current stage.
                </p>
                <p className="text-sm text-emerald-600 italic">
                    Remember: This is a starting point. Your actual level will emerge through consistent practice and reflection.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="card bg-blue-50 border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Self-Assessment
                </h3>
                <p className="text-blue-700 text-sm">
                    Answer honestly based on how you currently operate, not how you aspire to be. There are no wrong answers—this helps us understand your starting point.
                </p>
            </div>

            <div className="space-y-4">
                {allQuestions.map((question, index) => (
                    <div key={question.id} className="card">
                        <p className="text-sm font-medium text-gray-900 mb-3">
                            {index + 1}. {question.text}
                        </p>

                        <div className="flex items-center justify-between space-x-2">
                            <span className="text-xs text-gray-500">Strongly Disagree</span>
                            <div className="flex space-x-2">
                                {[1, 2, 3, 4, 5].map(value => (
                                    <button
                                        key={value}
                                        onClick={() => handleAnswer(question.id, value)}
                                        className={`w-10 h-10 rounded-full border-2 transition-all ${answers[question.id] === value
                                                ? 'bg-gray-900 text-white border-gray-900'
                                                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                                            }`}
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                            <span className="text-xs text-gray-500">Strongly Agree</span>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className={`w-full btn-primary ${!allAnswered ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                Complete Assessment
            </button>
        </div>
    );
}
