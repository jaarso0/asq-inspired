import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { DOMAINS } from '../data/domainConfig';

export default function RadarChart({ domains }) {
    // Transform domain data for radar chart
    const data = Object.values(domains).map(domain => ({
        domain: DOMAINS[domain.id].name,
        level: domain.currentLevel,
        fullMark: 3.0
    }));

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Domain Balance
            </h3>

            <ResponsiveContainer width="100%" height={400}>
                <RechartsRadar data={data}>
                    <PolarGrid stroke="#d4d4d4" />
                    <PolarAngleAxis
                        dataKey="domain"
                        tick={{ fill: '#525252', fontSize: 14 }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 3]}
                        tick={{ fill: '#a3a3a3', fontSize: 12 }}
                        tickCount={4}
                    />
                    <Radar
                        name="Current Level"
                        dataKey="level"
                        stroke="#171717"
                        fill="#171717"
                        fillOpacity={0.3}
                    />
                </RechartsRadar>
            </ResponsiveContainer>

            <p className="text-sm text-gray-600 italic mt-4 text-center">
                A balanced life doesn't mean equal levels—it means conscious attention to what matters now.
            </p>
        </div>
    );
}
