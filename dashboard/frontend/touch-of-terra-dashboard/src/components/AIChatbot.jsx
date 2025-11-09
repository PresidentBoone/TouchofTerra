import { useState, useRef, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m the Touch of Terra assistant. I can help you:\n\n• Find shelter tonight\n• Learn about volunteer opportunities\n• Understand homelessness data\n\nHow can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { text: 'I need shelter tonight', icon: '🏠' },
    { text: 'How can I volunteer?', icon: '🤝' },
    { text: 'Show me the data', icon: '📊' },
    { text: 'Find food banks', icon: '🍽️' }
  ];

  const handleSend = async (message = input) => {
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Simulate AI response (replace with actual Claude API call in production)
      const response = await generateResponse(message);

      setTimeout(() => {
        const assistantMessage = {
          role: 'assistant',
          content: response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again or contact us directly at touchofterralouisville@gmail.com',
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }
  };

  const generateResponse = async (message) => {
    const lowerMessage = message.toLowerCase();

    // Shelter inquiry
    if (lowerMessage.includes('shelter') || lowerMessage.includes('housing') || lowerMessage.includes('sleep')) {
      return `🏠 **Need Shelter Tonight?**\n\nHere are immediate options in Louisville:\n\n**1. Wayside Christian Mission**\n📍 432 E Jefferson St\n📞 (502) 584-3711\n⏰ 24/7 Emergency Shelter\n\n**2. The Healing Place**\n📍 1020 W Market St\n📞 (502) 585-4848\n⏰ 24/7 (78 beds available)\n\n**3. Louisville Rescue Mission**\n📍 1015 S Hancock St\n📞 (502) 636-0771\n⏰ 24/7 (32 beds available)\n\n💡 Tip: Call ahead to confirm availability. Click the "Resource Map" tab above to see all shelter locations.`;
    }

    // Volunteer inquiry
    if (lowerMessage.includes('volunteer') || lowerMessage.includes('help out')) {
      return `🤝 **Thank you for wanting to help!**\n\nWe have several volunteer opportunities:\n\n✓ **Backpack Distribution**: Help us distribute care packages\n✓ **Data Collection**: Assist with community surveys\n✓ **Event Support**: Help at fundraising events\n✓ **Administrative**: Backend support and outreach\n\nClick the "Volunteer Signup" button in the Coming Soon banner at the top of the Dashboard to get started!\n\nYou can also email us directly: touchofterralouisville@gmail.com`;
    }

    // Food inquiry
    if (lowerMessage.includes('food') || lowerMessage.includes('meal') || lowerMessage.includes('hungry')) {
      return `🍽️ **Food Resources in Louisville:**\n\n**1. Dare to Care Food Bank**\n📍 6500 Strawberry Ln\n📞 (502) 966-3821\n⏰ Mon-Fri 9am-4pm\n\n**2. St. Vincent de Paul**\n📍 1015 S Jackson St\n📞 (502) 637-4771\n⏰ Mon-Sat 9am-3pm\n\nMany shelters also provide meals! Check the Resource Map tab for more locations.`;
    }

    // Data/statistics inquiry
    if (lowerMessage.includes('data') || lowerMessage.includes('statistic') || lowerMessage.includes('number')) {
      return `📊 **Louisville Homelessness Data (2024):**\n\n• **Total Homeless**: 1,157 individuals\n• **Sheltered**: 680 (59%)\n• **Unsheltered**: 477 (41%)\n• **Available Beds**: 145 out of 850 total\n\n📈 **5-Year Trend**: +16% increase since 2020\n\nKey factors:\n- Rising rent costs (+27% since 2020)\n- Eviction rate up 23%\n- Average rent: $950/mo (outpacing wages)\n\nScroll down on the Dashboard tab to see interactive charts and detailed breakdowns!`;
    }

    // Medical/clinic inquiry
    if (lowerMessage.includes('medical') || lowerMessage.includes('doctor') || lowerMessage.includes('clinic') || lowerMessage.includes('health')) {
      return `🏥 **Medical Resources:**\n\n**Family Health Centers - Phoenix**\n📍 1147 S 28th St\n📞 (502) 774-8631\n⏰ Mon-Fri 8am-5pm\n💊 Services: Medical, Dental, Behavioral Health\n\nMany shelters also offer basic healthcare services. Visit the Resource Map for more options!`;
    }

    // Donation inquiry
    if (lowerMessage.includes('donat') || lowerMessage.includes('give') || lowerMessage.includes('contribute')) {
      return `💝 **Thank you for your generosity!**\n\nWhile our online donation portal is launching soon, you can currently support Touch of Terra by:\n\n✓ **Email us**: touchofterralouisville@gmail.com\n✓ **Donate supplies**: Backpacks, hygiene kits, blankets\n✓ **Partner with us**: Corporate or nonprofit partnerships\n\n**Impact Examples:**\n• $25 = 5 meals\n• $50 = 1 backpack with essentials\n• $100 = Emergency shelter for 1 week\n\nStay tuned for our online giving portal!`;
    }

    // Default response
    return `I understand you're asking about "${message}". \n\nI can help you with:\n\n🏠 **Immediate shelter needs** - "I need shelter tonight"\n🍽️ **Food resources** - "Where can I find food?"\n🤝 **Volunteer opportunities** - "How can I help?"\n📊 **Data and statistics** - "Show me the data"\n🏥 **Medical services** - "I need healthcare"\n\nOr feel free to ask me anything about Touch of Terra and homelessness in Louisville!\n\nFor immediate assistance, call 211 (Kentucky Crisis Hotline) available 24/7.`;
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-tot-teal to-tot-green-primary rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center z-50 animate-bounce"
        >
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col z-50 border-2 border-tot-green-primary/20 animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-tot-teal to-tot-green-primary p-5 rounded-t-3xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold">Touch of Terra AI</h3>
                <p className="text-white/80 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                  Always here to help
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-tot-beige/30">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-tot-teal to-tot-green-primary text-white'
                      : 'bg-white text-tot-text-dark shadow-tot-medium border border-tot-green-sage/20'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-white/60' : 'text-tot-text-light'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-tot-text-dark shadow-tot-medium border border-tot-green-sage/20 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-tot-green-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-tot-green-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-tot-green-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-tot-green-sage/20 bg-white">
              <p className="text-xs text-tot-text-light mb-2">Quick actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(action.text)}
                    className="text-xs px-3 py-2 bg-tot-beige hover:bg-tot-green-primary/10 rounded-lg text-tot-text-dark font-medium transition-all border border-tot-green-sage/20 hover:border-tot-green-primary/40"
                  >
                    {action.icon} {action.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-tot-green-sage/20 bg-white rounded-b-3xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-3 border-2 border-tot-green-sage/20 rounded-xl focus:border-tot-green-primary focus:ring-2 focus:ring-tot-green-primary/20 outline-none transition-all text-sm"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="px-4 py-3 bg-gradient-to-r from-tot-teal to-tot-green-primary text-white rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-tot-medium"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatbot;
