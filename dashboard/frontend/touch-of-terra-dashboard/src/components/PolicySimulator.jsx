import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function PolicySimulator() {
    const [currentStats, setCurrentStats] = useState(null);
    const [scenarios, setScenarios] = useState({
        rentChange: 0,
        newBeds: 0,
        evictionReduction: 0,
        mentalHealthFunding: 0
    });
    const [projections, setProjections] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCurrentStats();
    }, []);

    useEffect(() => {
        if (currentStats) {
            calculateProjections();
        }
    }, [scenarios, currentStats]);

    const fetchCurrentStats = async () => {
        try {
            const response = await fetch(`${API_URL}/api/stats/current`);
            const data = await response.json();
            setCurrentStats(data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateProjections = () => {
        if (!currentStats) return;

        const baseline = currentStats.totalHomeless;

        // Impact models (simplified estimates based on research)
        // Rent: 10% increase = ~5% increase in homelessness
        const rentImpact = (scenarios.rentChange / 10) * 0.05 * baseline;

        // New shelter beds: Each bed reduces unsheltered by ~0.8 (some return)
        const bedImpact = scenarios.newBeds * 0.8;

        // Eviction prevention: 10% reduction in evictions = ~3% reduction in new homelessness
        const evictionImpact = (scenarios.evictionReduction / 10) * 0.03 * baseline;

        // Mental health funding: Each $100k reduces chronic homelessness by ~5 people
        const mentalHealthImpact = (scenarios.mentalHealthFunding / 100000) * 5;

        const projectedChange = rentImpact - bedImpact - evictionImpact - mentalHealthImpact;
        const projectedTotal = Math.max(0, Math.round(baseline + projectedChange));

        setProjections({
            baseline,
            projectedTotal,
            change: Math.round(projectedChange),
            percentChange: ((projectedChange / baseline) * 100).toFixed(1),
            breakdown: {
                rentImpact: Math.round(rentImpact),
                bedImpact: Math.round(-bedImpact),
                evictionImpact: Math.round(-evictionImpact),
                mentalHealthImpact: Math.round(-mentalHealthImpact)
            }
        });
    };

    const resetScenarios = () => {
        setScenarios({
            rentChange: 0,
            newBeds: 0,
            evictionReduction: 0,
            mentalHealthFunding: 0
        });
    };

    const presetScenarios = {
        optimistic: { rentChange: -5, newBeds: 200, evictionReduction: 30, mentalHealthFunding: 500000 },
        pessimistic: { rentChange: 15, newBeds: 0, evictionReduction: 0, mentalHealthFunding: 0 },
        moderate: { rentChange: 5, newBeds: 100, evictionReduction: 15, mentalHealthFunding: 250000 }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-3xl shadow-tot-large p-8">
                <div className="flex items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                    <p>Loading simulator...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-tot-large p-8 border-2 border-purple-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-tot-text-dark">Policy Impact Simulator</h2>
                        <p className="text-sm text-tot-text-light">Model "what if" scenarios for Louisville homelessness</p>
                    </div>
                </div>
                <button
                    onClick={resetScenarios}
                    className="px-4 py-2 text-sm text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                >
                    Reset
                </button>
            </div>

            {/* Preset Scenarios */}
            <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-sm text-gray-500">Quick presets:</span>
                <button
                    onClick={() => setScenarios(presetScenarios.optimistic)}
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                >
                    Optimistic
                </button>
                <button
                    onClick={() => setScenarios(presetScenarios.moderate)}
                    className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors"
                >
                    Moderate
                </button>
                <button
                    onClick={() => setScenarios(presetScenarios.pessimistic)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                >
                    Pessimistic
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="space-y-6">
                    <h3 className="font-semibold text-tot-text-dark">Adjust Policy Variables</h3>

                    {/* Rent Change */}
                    <div>
                        <label className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Average Rent Change</span>
                            <span className={scenarios.rentChange >= 0 ? 'text-red-600' : 'text-green-600'}>
                                {scenarios.rentChange >= 0 ? '+' : ''}{scenarios.rentChange}%
                            </span>
                        </label>
                        <input
                            type="range"
                            min="-20"
                            max="30"
                            value={scenarios.rentChange}
                            onChange={(e) => setScenarios({ ...scenarios, rentChange: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>-20%</span>
                            <span>+30%</span>
                        </div>
                    </div>

                    {/* New Shelter Beds */}
                    <div>
                        <label className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>New Shelter Beds Added</span>
                            <span className="text-green-600">+{scenarios.newBeds} beds</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="500"
                            step="10"
                            value={scenarios.newBeds}
                            onChange={(e) => setScenarios({ ...scenarios, newBeds: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>0</span>
                            <span>500</span>
                        </div>
                    </div>

                    {/* Eviction Prevention */}
                    <div>
                        <label className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Eviction Prevention Rate</span>
                            <span className="text-green-600">-{scenarios.evictionReduction}% evictions</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={scenarios.evictionReduction}
                            onChange={(e) => setScenarios({ ...scenarios, evictionReduction: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>0%</span>
                            <span>50%</span>
                        </div>
                    </div>

                    {/* Mental Health Funding */}
                    <div>
                        <label className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Mental Health Funding</span>
                            <span className="text-green-600">+${(scenarios.mentalHealthFunding / 1000).toFixed(0)}k</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1000000"
                            step="50000"
                            value={scenarios.mentalHealthFunding}
                            onChange={(e) => setScenarios({ ...scenarios, mentalHealthFunding: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>$0</span>
                            <span>$1M</span>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div>
                    <h3 className="font-semibold text-tot-text-dark mb-4">Projected Impact</h3>

                    {projections && (
                        <div className="space-y-4">
                            {/* Main Projection */}
                            <div className={`p-6 rounded-xl ${projections.change <= 0 ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
                                }`}>
                                <p className="text-sm text-gray-600 mb-1">Projected Homeless Population</p>
                                <p className="text-4xl font-bold">
                                    {projections.projectedTotal.toLocaleString()}
                                </p>
                                <p className={`text-lg font-semibold ${projections.change <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {projections.change <= 0 ? '↓' : '↑'} {Math.abs(projections.change)} ({projections.percentChange}%)
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Current: {projections.baseline.toLocaleString()}
                                </p>
                            </div>

                            {/* Breakdown */}
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Impact Breakdown</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Rent Impact</span>
                                        <span className={projections.breakdown.rentImpact >= 0 ? 'text-red-600' : 'text-green-600'}>
                                            {projections.breakdown.rentImpact >= 0 ? '+' : ''}{projections.breakdown.rentImpact}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shelter Beds</span>
                                        <span className="text-green-600">{projections.breakdown.bedImpact}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Eviction Prevention</span>
                                        <span className="text-green-600">{projections.breakdown.evictionImpact}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Mental Health</span>
                                        <span className="text-green-600">{projections.breakdown.mentalHealthImpact}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <p className="text-xs text-gray-400 italic">
                                * Projections are estimates based on research. Actual results vary based on many factors.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PolicySimulator;
