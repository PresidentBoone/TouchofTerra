import React, { useState } from 'react';
import OpenAI from 'openai';

const EducationalChatbot = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "👋 Hi! I'm here to help you understand homelessness through facts and data. Ask me anything about:\n\n• Root causes of homelessness\n• Statistics and trends\n• Economic factors\n• Mental health and addiction\n• Housing policy\n• Evidence-based solutions\n\nAll responses are backed by research from HUD, CDC, NIH, and peer-reviewed studies."
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const systemPrompt = `You are an educational chatbot focused on explaining homelessness using ONLY factual, data-driven information. Your role is to:

1. Provide unbiased, evidence-based explanations
2. Cite specific data sources (HUD Annual Reports, CDC studies, NIH research, peer-reviewed journals)
3. Explain economic factors (housing costs, wage stagnation, job loss)
4. Address mental health and addiction as symptoms AND causes
5. Discuss systemic issues (affordable housing shortage, healthcare access, etc.)
6. Present multiple perspectives when appropriate
7. Use statistics and real numbers
8. Avoid political ideology or partisan framing

CRITICAL RULES:
- No political rhetoric or partisan language
- Always cite data sources
- Focus on root causes: economics, housing, health, policy
- Acknowledge complexity - homelessness has multiple interrelated causes
- Use empathy without sentimentality
- Correct common misconceptions with data

Data to reference:
- HUD 2023 Report: 653,104 people experiencing homelessness in US
- Primary causes: lack of affordable housing (56%), unemployment (26%), mental illness (25%), substance abuse (23%)
- Housing wage gap: minimum wage workers need 2-3 jobs to afford 2-bedroom apartment
- Only 37 affordable rental homes per 100 extremely low-income renters (NLIHC)
- 1/3 of homeless have serious mental illness (SAMHSA)
- Childhood trauma strongly correlated with adult homelessness (CDC)`;

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const openai = new OpenAI({
                apiKey: import.meta.env.VITE_OPENAI_API_KEY,
                dangerouslyAllowBrowser: true
            });

            const response = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0),
                    userMessage
                ],
                temperature: 0.3, // Lower temperature for more factual responses
                max_tokens: 600
            });

            const assistantMessage = {
                role: 'assistant',
                content: response.choices[0].message.content
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Educational chatbot error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '⚠️ I apologize, but I encountered an error. Please try asking your question again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const quickQuestions = [
        "What are the main causes of homelessness?",
        "How does mental health relate to homelessness?",
        "What role does housing affordability play?",
        "Are most homeless people employed?",
        "What solutions are most effective?"
    ];

    return (
        <section className="py-12" aria-labelledby="education-heading">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 id="education-heading" className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#2D3E35' }}>
                        Understanding Homelessness
                    </h2>
                    <p className="text-lg text-gray-600">
                        Learn about the real causes and data behind homelessness
                    </p>
                </div>

                {/* Chat Interface */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header Bar */}
                    <div className="p-4 text-white" style={{ background: 'linear-gradient(135deg, #5D8A7A, #7BA05B)' }}>
                        <div className="font-bold text-lg">📚 Educational Assistant</div>
                        <div className="text-sm opacity-90">Fact-based, data-driven explanations</div>
                    </div>

                    {/* Messages */}
                    <div className="h-96 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: '#F5F2E8' }}>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-3xl rounded-lg p-3 ${msg.role === 'user'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-white text-gray-800 shadow'
                                        }`}
                                    style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)' } : {}}
                                >
                                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white rounded-lg p-3 shadow">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Questions (only show if few messages) */}
                    {messages.length <= 1 && (
                        <div className="px-4 py-2 border-t" style={{ backgroundColor: '#F5F2E8' }}>
                            <div className="text-xs text-gray-500 font-medium mb-2">Quick questions:</div>
                            <div className="flex flex-wrap gap-2">
                                {quickQuestions.map((q, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setInput(q)}
                                        className="px-3 py-1.5 rounded-full text-sm border-2 hover:shadow-md transition-all"
                                        style={{ borderColor: '#7BA05B', color: '#7BA05B' }}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-4 border-t bg-white">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask a question about homelessness..."
                                className="flex-1 px-4 py-2 border-2 rounded-full focus:outline-none"
                                style={{ borderColor: '#D4C5A0' }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="px-6 py-2 rounded-full text-white font-medium"
                                style={{
                                    background: input.trim() && !isLoading
                                        ? 'linear-gradient(135deg, #7BA05B, #5D8A7A)'
                                        : '#ccc'
                                }}
                            >
                                Ask
                            </button>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-4 text-center text-sm text-gray-500">
                    ℹ️ Information provided is for educational purposes and backed by research data
                </div>
            </div>
        </section>
    );
};

export default EducationalChatbot;
