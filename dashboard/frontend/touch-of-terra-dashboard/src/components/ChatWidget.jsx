import React, { useState, useEffect, useRef } from 'react';
import { analyzeIntent } from '../services/chatbotNLU';
import { matchResources, generateResponse } from '../services/resourceMatcher';
import { useLanguage } from '../context/LanguageContext';

const MessageRole = {
    USER: 'user',
    ASSISTANT: 'assistant',
    SYSTEM: 'system'
};

const ChatWidget = ({ resources }) => {
    const { t } = useLanguage(); // New line
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]); // Changed to empty array
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen]); // Added isTyping, isOpen to dependencies

    // Add initial assistant message using t()
    useEffect(() => {
        if (t && messages.length === 0) { // Only add if messages are empty and t is available
            setMessages([{
                id: '1',
                role: MessageRole.ASSISTANT,
                content: t('chat.initialMessage'),
                timestamp: new Date()
            }]);
        }
    }, [t, messages.length]);


    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => console.log('Location access denied')
            );
        }
    }, []);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            role: MessageRole.USER,
            content: inputValue,
            timestamp: new Date()
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            const nluResult = await analyzeIntent(inputValue, {
                location: userLocation
            });

            const matchedResources = matchResources(
                resources || [],
                nluResult,
                { location: userLocation }
            );

            const responseText = generateResponse(inputValue, nluResult, matchedResources);

            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                role: MessageRole.ASSISTANT,
                content: responseText,
                timestamp: new Date(),
                resources: matchedResources,
                urgency: nluResult.urgency
            };

            setMessages((prev) => [...prev, assistantMessage]);

            if (nluResult.urgency === 'crisis') {
                setTimeout(() => {
                    alert(t('chat.crisisAlert')); // Used t()
                }, 1000);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                role: MessageRole.ASSISTANT,
                content: t('chat.errorMessage'), // Used t()
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const quickReplies = [ // New quickReplies definition
        t('chat.quick.shelter'),
        t('chat.quick.food'),
        t('chat.quick.medical')
    ];

    const handleFeedback = (messageId, isPositive) => {
        setMessages(prev => prev.map(msg =>
            msg.id === messageId
                ? { ...msg, feedback: isPositive ? 'positive' : 'negative' }
                : msg
        ));
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-[1000] w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl transition-all hover:scale-110"
                style={{
                    background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)',
                    border: '3px solid rgba(255, 255, 255, 0.3)'
                }}
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 z-[999] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    style={{
                        width: 'min(400px, calc(100vw - 3rem))',
                        height: 'min(600px, calc(100vh - 8rem))',
                        border: '2px solid rgba(123, 160, 91, 0.2)'
                    }}
                >
                    <div className="p-4 text-white" style={{ background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)' }}>
                        <div className="font-bold text-lg">{t('chat.title')}</div>
                        <div className="text-sm opacity-90">{t('chat.subtitle')}</div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: '#F5F2E8' }}>
                        {messages.map((message) => (
                            <ChatMessage
                                key={message.id}
                                message={message}
                                onFeedback={handleFeedback}
                                t={t} // Passed t()
                            />
                        ))}
                        {isTyping && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>

                    {messages.length <= 2 && (
                        <div className="px-4 py-2 space-y-2">
                            <div className="text-xs text-gray-500 font-medium">{t('chat.quick.options')}</div>
                            <div className="flex flex-wrap gap-2">
                                {quickReplies.map((reply, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setInputValue(reply);
                                            setTimeout(() => handleSendMessage(), 100);
                                        }}
                                        className="px-3 py-1.5 rounded-full text-sm border-2 hover:shadow-md"
                                        style={{ borderColor: '#7BA05B', color: '#7BA05B' }}
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="p-4 border-t bg-white">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder={t('chat.placeholder')}
                                className="flex-1 px-4 py-2 border-2 rounded-full focus:outline-none"
                                style={{ borderColor: '#D4C5A0' }}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim()}
                                className="px-6 py-2 rounded-full text-white font-medium"
                                style={{
                                    background: inputValue.trim() ? 'linear-gradient(135deg, #7BA05B, #5D8A7A)' : '#ccc'
                                }}
                            >
                                {t('chat.send')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const ChatMessage = ({ message, onFeedback, t }) => { // Added t to props
    const isUser = message.role === MessageRole.USER;

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${isUser ? 'rounded-br-none' : 'rounded-bl-none'}`}
                style={{
                    backgroundColor: isUser ? '#7BA05B' : 'white',
                    color: isUser ? 'white' : '#2D3E35',
                    border: isUser ? 'none' : '1px solid #e5e7eb'
                }}
            >
                <div className="text-sm leading-relaxed whitespace-pre-line">
                    {message.content}
                </div>

                {message.resources && message.resources.length > 0 && (
                    <div className="mt-3 space-y-2">
                        {message.resources.map((resource, idx) => (
                            <ResourceCard key={idx} resource={resource} t={t} />
                        ))}
                    </div>
                )}

                <div className={`text-xs mt-2 ${isUser ? 'text-white/70' : 'text-gray-400'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>

                {/* Feedback Buttons */}
                {!isUser && message.role === MessageRole.ASSISTANT && (
                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-2">
                        <span className="text-xs text-gray-400">{t('chat.helpful')}</span>
                        <button
                            onClick={() => onFeedback && onFeedback(message.id, true)}
                            className={`p-1 rounded hover:bg-gray-100 transition-colors ${message.feedback === 'positive' ? 'text-green-600' : 'text-gray-400'}`}
                            disabled={!!message.feedback}
                        >
                            👍
                        </button>
                        <button
                            onClick={() => onFeedback && onFeedback(message.id, false)}
                            className={`p-1 rounded hover:bg-gray-100 transition-colors ${message.feedback === 'negative' ? 'text-red-600' : 'text-gray-400'}`}
                            disabled={!!message.feedback}
                        >
                            👎
                        </button>
                        {message.feedback && (
                            <span className="text-xs text-gray-400 ml-1">{t('chat.thanks')}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const ResourceCard = ({ resource, t }) => {
    const distanceText = resource.distance ? `${(resource.distance / 1000).toFixed(1)} km away` : '';

    return (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-3 border border-green-200">
            <div className="font-bold text-gray-900 text-sm">{resource.name}</div>
            <div className="text-xs text-gray-600 mt-1">{resource.address}</div>

            {resource.phone && (
                <a href={`tel:${resource.phone}`} className="text-xs font-medium mt-2 inline-block" style={{ color: '#7BA05B' }}>
                    📞 {resource.phone}
                </a>
            )}

            {resource.available !== undefined && (
                <div className="text-xs font-semibold mt-1" style={{ color: '#7BA05B' }}>
                    ✓ {resource.available} beds available
                </div>
            )}

            {distanceText && (
                <div className="text-xs text-gray-500 mt-1">
                    📍 {distanceText}
                </div>
            )}
        </div>
    );
};

const TypingIndicator = () => (
    <div className="flex justify-start">
        <div className="rounded-2xl rounded-bl-none px-4 py-3 bg-white border shadow">
            <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
        </div>
    </div>
);

export default ChatWidget;
