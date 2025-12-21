export default function WeeklyProgress({ percentage }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Weekly Progress</span>
                <span className="font-medium text-gray-900">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                    className="bg-gray-900 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
