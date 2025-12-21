import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function DeepResearch() {
    const [question, setQuestion] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const suggestedQuestions = [
        "What are the main causes of homelessness in Louisville?",
        "How effective are Housing First programs?",
        "What is the relationship between evictions and homelessness?",
        "How does mental health affect homelessness rates?",
        "What policies have reduced homelessness in other cities?"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(`${API_URL}/api/research/deep`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question })
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data);
            } else {
                throw new Error(data.error || 'Failed to get research');
            }
        } catch (err) {
            console.error('Deep research error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-tot-beige to-white rounded-3xl shadow-tot-large p-8 border-2 border-tot-teal/30">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-tot-teal to-tot-green-primary rounded-xl">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-tot-text-dark">Deep Research Mode</h2>
                    <p className="text-sm text-tot-text-light">Ask complex questions, get comprehensive research synthesis with citations</p>
                </div>
                <span className="ml-auto px-3 py-1 bg-tot-teal/10 text-tot-teal text-xs font-semibold rounded-full">AI-Powered</span>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask a research question about homelessness..."
                        className="flex-1 px-5 py-3 rounded-xl border-2 border-tot-green-sage/30 focus:border-tot-teal focus:outline-none text-tot-text-dark"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !question.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-tot-teal to-tot-green-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Researching...
                            </span>
                        ) : 'Research'}
                    </button>
                </div>
            </form>

            {/* Suggested Questions */}
            {!result && !loading && (
                <div className="mb-6">
                    <p className="text-sm text-tot-text-light mb-3">Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => setQuestion(q)}
                                className="px-3 py-1.5 text-sm bg-white border border-tot-green-sage/30 text-tot-text-dark rounded-full hover:border-tot-teal hover:bg-tot-teal/5 transition-colors"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="py-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-tot-teal/30 border-t-tot-teal mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-tot-text-dark">Analyzing multiple sources...</p>
                    <p className="text-sm text-tot-text-light">This may take 15-30 seconds for thorough research</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Results */}
            {result && (
                <div className="space-y-6">
                    {/* Summary */}
                    <div className="bg-tot-teal/10 rounded-xl p-5 border border-tot-teal/20">
                        <h3 className="font-semibold text-tot-teal mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Executive Summary
                        </h3>
                        <p className="text-tot-text-dark">{result.summary}</p>
                    </div>

                    {/* Key Findings */}
                    {result.keyFindings && result.keyFindings.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-tot-text-dark mb-3">Key Findings</h3>
                            <ul className="space-y-2">
                                {result.keyFindings.map((finding, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-tot-green-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                                            {i + 1}
                                        </span>
                                        <span className="text-tot-text-dark">{finding}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Detailed Sections */}
                    {result.sections && result.sections.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-tot-text-dark">Detailed Analysis</h3>
                            {result.sections.map((section, i) => (
                                <div key={i} className="bg-white rounded-xl p-5 border border-tot-green-sage/20">
                                    <h4 className="font-semibold text-tot-text-dark mb-2">{section.title}</h4>
                                    <p className="text-tot-text-dark mb-3">{section.content}</p>
                                    {section.sources && section.sources.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {section.sources.map((source, j) => (
                                                <a
                                                    key={j}
                                                    href={source.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-tot-teal/10 text-tot-teal text-xs font-medium rounded hover:bg-tot-teal/20 transition-colors"
                                                >
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    {source.name}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Methodology & Limitations */}
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        {result.methodology && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-700 mb-1">Methodology</h4>
                                <p className="text-gray-600">{result.methodology}</p>
                            </div>
                        )}
                        {result.limitations && (
                            <div className="bg-yellow-50 rounded-lg p-4">
                                <h4 className="font-semibold text-yellow-700 mb-1">Limitations</h4>
                                <p className="text-yellow-600">{result.limitations}</p>
                            </div>
                        )}
                    </div>

                    {/* Timestamp */}
                    <p className="text-xs text-gray-400 text-right">
                        Generated: {new Date(result.timestamp).toLocaleString()}
                    </p>
                </div>
            )}
        </div>
    );
}

export default DeepResearch;
