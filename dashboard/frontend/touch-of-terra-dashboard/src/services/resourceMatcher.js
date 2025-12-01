// Resource Matching Algorithm
// Matches user needs to available resources based on intent, context, and proximity

import { IntentType } from './chatbotNLU';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Object} coord1 - {lat, lng}
 * @param {Object} coord2 - {lat, lng}
 * @returns {number} Distance in meters
 */
function calculateDistance(coord1, coord2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (coord1.lat * Math.PI) / 180;
    const φ2 = (coord2.lat * Math.PI) / 180;
    const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const Δλ = ((coord2.lng - coord1.lng) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

/**
 * Match resources to user needs
 * @param {Array} allResources - All available resources
 * @param {Object} nluResult - NLU analysis result
 * @param {Object} userContext - User context including location
 * @returns {Array} Top matched resources
 */
export function matchResources(allResources, nluResult, userContext = {}) {
    const matches = [];

    for (const resource of allResources) {
        let score = 0;
        const reasons = [];

        // 1. Intent matching (highest priority)
        const intentScore = calculateIntentScore(resource, nluResult.intent);
        score += intentScore.score;
        reasons.push(...intentScore.reasons);

        // 2. Urgency filter
        if (nluResult.urgency === 'crisis' || nluResult.urgency === 'high') {
            // Prioritize 24/7 or currently open resources
            if (resource.is_24_7 || resource.open_now) {
                score += 30;
                reasons.push('Open now for immediate help');
            } else {
                score -= 50; // Significantly deprioritize closed resources
            }
        }

        // 3. Entity/demographic matching
        const entityScore = calculateEntityScore(resource, nluResult.entities);
        score += entityScore.score;
        reasons.push(...entityScore.reasons);

        // 4. Distance-based scoring (if user location available)
        if (userContext.location && resource.latitude && resource.longitude) {
            const distance = calculateDistance(
                userContext.location,
                { lat: resource.latitude, lng: resource.longitude }
            );

            const distanceKm = (distance / 1000).toFixed(1);

            if (distance < 2000) {
                // Within 2km
                score += 20;
                reasons.push(`Very close (${distanceKm}km away)`);
            } else if (distance < 5000) {
                // Within 5km
                score += 10;
                reasons.push(`Nearby (${distanceKm}km away)`);
            } else if (distance > 10000) {
                score -= 10; // Penalize distant resources
            }
        }

        // 5. Availability (for shelters)
        if (resource.capacity && resource.available > 0) {
            score += 15;
            reasons.push(`${resource.available} beds available`);
        } else if (resource.capacity && resource.available === 0) {
            score -= 20;
            reasons.push('Currently at capacity');
        }

        // 6. Verified resources get small boost
        if (resource.verified) {
            score += 5;
        }

        matches.push({
            resource,
            score,
            reasons,
            distance: userContext.location && resource.latitude ?
                calculateDistance(userContext.location, {
                    lat: resource.latitude,
                    lng: resource.longitude
                }) : null
        });
    }

    // Sort by score (highest first) and return top 5
    matches.sort((a, b) => b.score - a.score);

    return matches
        .filter((m) => m.score > 0) // Only positive scores
        .slice(0, 5) // Top 5 matches
        .map((m) => ({
            ...m.resource,
            matchScore: m.score,
            matchReasons: m.reasons,
            distance: m.distance
        }));
}

/**
 * Calculate intent-based score
 * @param {Object} resource 
 * @param {string} intent 
 * @returns {Object} {score, reasons}
 */
function calculateIntentScore(resource, intent) {
    const reasons = [];
    let score = 0;

    const categoryMapping = {
        [IntentType.FIND_SHELTER]: ['Emergency Shelter', 'Shelter'],
        [IntentType.FIND_FOOD]: ['Food Bank', 'Food Pantry', 'Meals'],
        [IntentType.FIND_HEALTHCARE]: ['Health Clinic', 'Medical', 'Mental Health'],
        [IntentType.HOUSING_ASSISTANCE]: ['Housing Assistance', 'Supportive Housing'],
        [IntentType.EMERGENCY_CRISIS]: ['Emergency Shelter', 'Crisis Services'],
    };

    const relevantCategories = categoryMapping[intent] || [];

    for (const category of relevantCategories) {
        if (resource.category === category || resource.services?.includes(category)) {
            score += 40;
            reasons.push(`Provides ${category.toLowerCase()}`);
            break; // Only count primary match
        }
    }

    return { score, reasons };
}

/**
 * Calculate entity/demographic score
 * @param {Object} resource 
 * @param {Object} entities 
 * @returns {Object} {score, reasons}
 */
function calculateEntityScore(resource, entities) {
    const reasons = [];
    let score = 0;

    if (entities.hasFamily && resource.family_friendly) {
        score += 25;
        reasons.push('Family-friendly');
    }

    if (entities.hasPets && resource.pet_friendly) {
        score += 20;
        reasons.push('Pet-friendly');
    }

    if (entities.isVeteran && resource.veteran_services) {
        score += 25;
        reasons.push('Veteran services available');
    }

    return { score, reasons };
}

/**
 * Generate chatbot response with matched resources
 * @param {string} userMessage 
 * @param {Object} nluResult 
 * @param {Array} matchedResources 
 * @returns {string}
 */
export function generateResponse(userMessage, nluResult, matchedResources) {
    const { intent, urgency } = nluResult;

    let response = '';

    // Crisis handling
    if (urgency === 'crisis') {
        response = `🚨 **I understand you need urgent help.** Please call 211 immediately for emergency assistance (available 24/7).\n\n`;

        if (matchedResources.length > 0) {
            response += `Here are the nearest resources open now:\n\n`;
        }
    } else if (urgency === 'high') {
        response = `I found ${matchedResources.length} resource(s) available soon:\n\n`;
    } else {
        // Normal responses based on intent
        const intentResponses = {
            [IntentType.FIND_SHELTER]: `I found ${matchedResources.length} shelter(s) that might help:\n\n`,
            [IntentType.FIND_FOOD]: `Here are ${matchedResources.length} food resource(s) nearby:\n\n`,
            [IntentType.FIND_HEALTHCARE]: `I found ${matchedResources.length} health service(s):\n\n`,
            [IntentType.HOUSING_ASSISTANCE]: `Here are ${matchedResources.length} housing assistance resource(s):\n\n`,
            [IntentType.GENERAL_INFO]: `I found ${matchedResources.length} resource(s) that might help:\n\n`,
        };

        response = intentResponses[intent] || `Here's what I found:\n\n`;
    }

    // Add resources with details
    if (matchedResources.length === 0) {
        response += `I couldn't find any matching resources right now. Please call 211 at (877) 564-4357 for personalized assistance, or try being more specific about what you need.\n\n`;
    }

    return response;
}
