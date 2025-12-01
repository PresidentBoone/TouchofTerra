// Chatbot Natural Language Understanding Service
// Uses OpenAI GPT to understand user intents and extract entities

// Intent types
export const IntentType = {
    FIND_SHELTER: 'find_shelter',
    FIND_FOOD: 'find_food',
    FIND_HEALTHCARE: 'find_healthcare',
    HOUSING_ASSISTANCE: 'housing_assistance',
    EMERGENCY_CRISIS: 'emergency_crisis',
    GENERAL_INFO: 'general_info',
    NAVIGATION_HELP: 'navigation_help'
};

// Crisis keywords that trigger immediate escalation
const CRISIS_KEYWORDS = [
    'tonight', 'now', 'emergency', 'urgent', 'nowhere to go',
    'sleeping outside', 'no food', 'domestic violence',
    'abuse', 'danger', 'unsafe', 'help me', 'freezing',
    'cold', 'hungry', 'starving'
];

/**
 * Analyze user message to extract intent, entities, and urgency
 * @param {string} message - User's message
 * @param {Object} context - User context (location, demographics, etc.)
 * @returns {Promise<Object>} NLU result with intent, entities, urgency
 */
export async function analyzeIntent(message, context = {}) {
    // Check for crisis keywords first
    const lowerMessage = message.toLowerCase();
    const isCrisis = CRISIS_KEYWORDS.some(keyword => lowerMessage.includes(keyword));

    // For now, use keyword-based classification
    // TODO: Integrate OpenAI API when key is available
    const result = keywordBasedClassification(message, isCrisis);

    return result;
}

/**
 * Fallback keyword-based classification
 * @param {string} message 
 * @param {boolean} isCrisis 
 * @returns {Object}
 */
function keywordBasedClassification(message, isCrisis) {
    const lower = message.toLowerCase();

    let intent = IntentType.GENERAL_INFO;
    let urgency = 'medium';
    const entities = {};

    // Intent detection
    if (lower.includes('shelter') || lower.includes('bed') || lower.includes('sleep') || lower.includes('stay')) {
        intent = IntentType.FIND_SHELTER;
    } else if (lower.includes('food') || lower.includes('meal') || lower.includes('eat') || lower.includes('hungry')) {
        intent = IntentType.FIND_FOOD;
    } else if (lower.includes('doctor') || lower.includes('health') || lower.includes('clinic') || lower.includes('medical')) {
        intent = IntentType.FIND_HEALTHCARE;
    } else if (lower.includes('housing') || lower.includes('apartment') || lower.includes('rent') || lower.includes('home')) {
        intent = IntentType.HOUSING_ASSISTANCE;
    } else if (lower.includes('crisis') || lower.includes('emergency') || lower.includes('danger')) {
        intent = IntentType.EMERGENCY_CRISIS;
    }

    // Entity extraction
    if (lower.includes('family') || lower.includes('kids') || lower.includes('children')) {
        entities.hasFamily = true;
    }
    if (lower.includes('pet') || lower.includes('dog') || lower.includes('cat')) {
        entities.hasPets = true;
    }
    if (lower.includes('veteran')) {
        entities.isVeteran = true;
    }

    // Timeframe detection
    if (lower.includes('now') || lower.includes('tonight') || lower.includes('immediately')) {
        entities.timeframe = 'now';
        urgency = 'high';
    } else if (lower.includes('today')) {
        entities.timeframe = 'today';
        urgency = 'high';
    }

    // Override urgency if crisis detected
    if (isCrisis || intent === IntentType.EMERGENCY_CRISIS) {
        urgency = 'crisis';
    }

    return {
        intent,
        entities,
        urgency,
        confidence: 0.7 // Keyword matching has medium confidence
    };
}

/**
 * OpenAI-based analysis (requires API key)
 * @param {string} message 
 * @param {Object} context 
 * @returns {Promise<Object>}
 */
export async function analyzeWithOpenAI(message, context) {
    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
        console.warn('OpenAI API key not configured, using fallback classification');
        return keywordBasedClassification(message, false);
    }

    try {
        const systemPrompt = `You are an NLU system for a homelessness resource chatbot in Louisville, Kentucky.
Analyze the user's message and extract:
1. Intent: ${Object.values(IntentType).join(', ')}
2. Entities: location, service type, demographic info, timeframe
3. Urgency level: low, medium, high, or crisis

Context: ${context ? JSON.stringify(context) : 'none'}

Respond ONLY in JSON format: { "intent": string, "entities": object, "urgency": string, "confidence": number }`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                temperature: 0.3,
                max_tokens: 200
            })
        });

        const data = await response.json();
        const result = JSON.parse(data.choices[0].message.content);

        return result;
    } catch (error) {
        console.error('OpenAI API error:', error);
        // Fallback to keyword-based
        return keywordBasedClassification(message, false);
    }
}
