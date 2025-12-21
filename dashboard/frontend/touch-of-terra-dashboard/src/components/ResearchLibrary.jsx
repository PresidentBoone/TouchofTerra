import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function ResearchLibrary() {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [newTopic, setNewTopic] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await fetch(`${API_URL}/api/reports`);
            const data = await response.json();
            setReports(data);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setError('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    const viewReport = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/reports/${id}`);
            const data = await response.json();
            setSelectedReport(data);
        } catch (err) {
            console.error('Error fetching report:', err);
        }
    };

    const generateReport = async (e) => {
        e.preventDefault();
        if (!newTopic.trim()) return;

        setGenerating(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/api/reports/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: newTopic })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setReports([data.report, ...reports]);
                setSelectedReport(data.report);
                setNewTopic('');
            } else {
                throw new Error(data.error || 'Failed to generate report');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setGenerating(false);
        }
    };

    const suggestedTopics = [
        "Youth homelessness in Louisville",
        "Housing First program effectiveness",
        "Mental health and homelessness connection",
        "Louisville eviction crisis impact",
        "Veteran homelessness solutions"
    ];

    return (
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-tot-large p-8 border-2 border-blue-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-tot-text-dark">Research Library</h2>
                        <p className="text-sm text-tot-text-light">Generate and save comprehensive research reports</p>
                    </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    {reports.length} Reports
                </span>
            </div>

            {/* Generate New Report */}
            <form onSubmit={generateReport} className="mb-6 p-4 bg-white rounded-xl border border-blue-100">
                <label className="block text-sm font-medium text-tot-text-dark mb-2">
                    Generate New Report
                </label>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        placeholder="Enter a research topic..."
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none"
                        disabled={generating}
                    />
                    <button
                        type="submit"
                        disabled={generating || !newTopic.trim()}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {generating ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Generating...
                            </span>
                        ) : 'Generate'}
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                    {suggestedTopics.map((topic, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setNewTopic(topic)}
                            className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </form>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    {error}
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
                {/* Reports List */}
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold text-tot-text-light mb-3">Saved Reports</h3>
                    {loading ? (
                        <div className="text-center py-8 text-gray-400">Loading...</div>
                    ) : reports.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <p>No reports yet</p>
                            <p className="text-xs mt-1">Generate your first report above</p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {reports.map((report) => (
                                <button
                                    key={report.id}
                                    onClick={() => viewReport(report.id)}
                                    className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedReport?.id === report.id
                                            ? 'bg-blue-50 border-blue-300'
                                            : 'bg-white border-gray-200 hover:border-blue-200'
                                        }`}
                                >
                                    <p className="font-medium text-tot-text-dark text-sm truncate">{report.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(report.generatedAt).toLocaleDateString()}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Report Viewer */}
                <div className="md:col-span-2">
                    {selectedReport ? (
                        <div className="bg-white rounded-xl p-6 border border-gray-200 max-h-[600px] overflow-y-auto">
                            <h3 className="text-xl font-bold text-tot-text-dark mb-2">{selectedReport.title}</h3>
                            <p className="text-xs text-gray-500 mb-4">
                                Generated: {new Date(selectedReport.generatedAt).toLocaleString()}
                            </p>

                            {/* Executive Summary */}
                            {selectedReport.content?.executiveSummary && (
                                <div className="p-4 bg-blue-50 rounded-lg mb-4">
                                    <h4 className="font-semibold text-blue-800 mb-1">Executive Summary</h4>
                                    <p className="text-blue-700 text-sm">{selectedReport.content.executiveSummary || selectedReport.summary}</p>
                                </div>
                            )}

                            {/* Sections */}
                            {selectedReport.content?.sections?.map((section, i) => (
                                <div key={i} className="mb-4">
                                    <h4 className="font-semibold text-tot-text-dark">{section.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{section.content}</p>
                                    {section.keyPoints && (
                                        <ul className="list-disc list-inside text-sm text-gray-500 mt-2">
                                            {section.keyPoints.map((point, j) => (
                                                <li key={j}>{point}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}

                            {/* Recommendations */}
                            {selectedReport.content?.recommendations && (
                                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                                    <h4 className="font-semibold text-green-800 mb-2">Recommendations</h4>
                                    <ol className="list-decimal list-inside text-sm text-green-700">
                                        {selectedReport.content.recommendations.map((rec, i) => (
                                            <li key={i}>{rec}</li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="text-gray-400">Select a report to view</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResearchLibrary;
