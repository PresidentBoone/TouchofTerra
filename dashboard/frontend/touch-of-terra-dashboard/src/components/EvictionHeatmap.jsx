import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function EvictionHeatmap() {
    const [evictionData, setEvictionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEvictionData();
    }, []);

    const fetchEvictionData = async () => {
        try {
            const response = await fetch(`${API_URL}/api/external/louisville/evictions`);
            const data = await response.json();
            setEvictionData(data);
        } catch (err) {
            console.error('Error fetching eviction data:', err);
            setError('Unable to load eviction data');
        } finally {
            setLoading(false);
        }
    };

    const getRiskLevel = (count) => {
        if (count >= 300) return { level: 'Critical', color: 'bg-red-500', textColor: 'text-red-700' };
        if (count >= 200) return { level: 'High', color: 'bg-orange-500', textColor: 'text-orange-700' };
        if (count >= 100) return { level: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
        return { level: 'Low', color: 'bg-green-500', textColor: 'text-green-700' };
    };

    if (loading) {
        return (
            <div className="bg-white rounded-3xl shadow-tot-large p-8 border border-red-200">
                <div className="flex items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                    <p className="text-tot-text-dark">Loading eviction data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-white to-red-50 rounded-3xl shadow-tot-large p-8 border-2 border-red-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-tot-text-dark">Eviction Risk Heatmap</h2>
                        <p className="text-sm text-tot-text-light">Louisville eviction filings by zip code</p>
                    </div>
                </div>
                {evictionData?.fallback && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                        Using Estimated Data
                    </span>
                )}
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    {error}
                </div>
            )}

            {/* Summary Stats */}
            {evictionData && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 text-center border border-red-100">
                        <p className="text-3xl font-bold text-red-600">{evictionData.totalEvictions?.toLocaleString()}</p>
                        <p className="text-sm text-tot-text-light">Total Eviction Filings</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-red-100">
                        <p className="text-3xl font-bold text-orange-600">{evictionData.byZipCode?.length || 0}</p>
                        <p className="text-sm text-tot-text-light">Affected Zip Codes</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-red-100">
                        <p className="text-3xl font-bold text-yellow-600">
                            {evictionData.byZipCode?.[0]?.zipCode || '-'}
                        </p>
                        <p className="text-sm text-tot-text-light">Highest Risk Area</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-red-100">
                        <p className="text-3xl font-bold text-tot-teal">
                            {evictionData.byZipCode?.[0]?.count || '-'}
                        </p>
                        <p className="text-sm text-tot-text-light">Filings in Top Area</p>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="flex items-center gap-6 mb-6 p-4 bg-white rounded-xl border border-gray-100">
                <span className="text-sm font-medium text-tot-text-light">Risk Level:</span>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500"></div>
                    <span className="text-xs text-gray-600">Critical (300+)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-orange-500"></div>
                    <span className="text-xs text-gray-600">High (200+)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-yellow-500"></div>
                    <span className="text-xs text-gray-600">Moderate (100+)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500"></div>
                    <span className="text-xs text-gray-600">Low (&lt;100)</span>
                </div>
            </div>

            {/* Zip Code Grid */}
            {evictionData && evictionData.byZipCode && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {evictionData.byZipCode.map((zip, index) => {
                        const risk = getRiskLevel(zip.count);
                        return (
                            <div
                                key={zip.zipCode}
                                className={`relative overflow-hidden rounded-xl p-4 border-2 ${risk.level === 'Critical' ? 'border-red-300 bg-red-50' :
                                        risk.level === 'High' ? 'border-orange-300 bg-orange-50' :
                                            risk.level === 'Moderate' ? 'border-yellow-300 bg-yellow-50' :
                                                'border-green-300 bg-green-50'
                                    }`}
                            >
                                {/* Rank Badge */}
                                <div className={`absolute top-2 right-2 w-6 h-6 rounded-full ${risk.color} flex items-center justify-center text-white text-xs font-bold`}>
                                    {index + 1}
                                </div>

                                <p className="text-lg font-bold text-tot-text-dark">{zip.zipCode}</p>
                                <p className={`text-2xl font-bold ${risk.textColor}`}>{zip.count}</p>
                                <p className="text-xs text-gray-500">eviction filings</p>

                                {/* Intensity Bar */}
                                <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${risk.color} transition-all`}
                                        style={{ width: `${zip.intensity * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Source Attribution */}
            <div className="mt-6 pt-4 border-t border-red-100 flex items-center justify-between text-xs text-gray-500">
                <p>
                    Source: {evictionData?.source || 'Louisville Metro Open Data'}
                </p>
                <p>
                    Last updated: {evictionData?.timestamp ? new Date(evictionData.timestamp).toLocaleString() : '-'}
                </p>
            </div>

            {/* Insight Box */}
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <p className="font-semibold text-red-700">Why This Matters</p>
                        <p className="text-sm text-red-600">
                            Eviction filings are a leading indicator of potential homelessness.
                            Areas with high eviction rates often see increased demand for emergency shelters within 30-90 days.
                            Touch of Terra focuses resources on these high-risk zip codes for early intervention.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EvictionHeatmap;
