/**
 * Type Definitions and Interfaces
 * Provides JSDoc type definitions for TypeScript-like type safety in JavaScript
 */

/**
 * @typedef {Object} HomelessStats
 * @property {number} totalHomeless - Total count of homeless individuals
 * @property {number} sheltered - Count of sheltered individuals
 * @property {number} unsheltered - Count of unsheltered individuals
 * @property {number} families - Count of families
 * @property {number} veterans - Count of veterans
 * @property {number} youth - Count of youth under 25
 * @property {number} chronicHomeless - Count of chronically homeless
 * @property {string} lastUpdated - ISO timestamp of last update
 * @property {number} [shelteredPercent] - Percentage of sheltered (calculated)
 * @property {number} [unshelteredPercent] - Percentage of unsheltered (calculated)
 */

/**
 * @typedef {Object} HistoricalDataPoint
 * @property {string} year - Year as string (e.g., "2024")
 * @property {number} total - Total homeless count
 * @property {number} sheltered - Sheltered count
 * @property {number} unsheltered - Unsheltered count
 * @property {string} [month] - Month for monthly data (e.g., "January")
 */

/**
 * @typedef {Object} BedAvailability
 * @property {number} total - Total bed capacity
 * @property {number} available - Available beds
 * @property {number} occupied - Occupied beds
 * @property {number} occupancyRate - Occupancy rate percentage
 * @property {Object} breakdown - Breakdown by type
 * @property {number} breakdown.emergency - Emergency beds
 * @property {number} breakdown.transitional - Transitional beds
 * @property {number} breakdown.permanent - Permanent supportive housing beds
 * @property {string} lastUpdated - ISO timestamp
 */

/**
 * @typedef {Object} Coordinates
 * @property {number} lat - Latitude
 * @property {number} lng - Longitude
 */

/**
 * @typedef {Object} Resource
 * @property {number} id - Unique identifier
 * @property {string} name - Resource name
 * @property {string} type - Type: "shelter" | "food" | "clinic" | "services"
 * @property {string} address - Full street address
 * @property {Coordinates} coordinates - GPS coordinates
 * @property {string} phone - Contact phone number
 * @property {string} hours - Operating hours
 * @property {string[]} services - Array of services offered
 * @property {number} [capacity] - Total capacity (for shelters)
 * @property {number} [available] - Currently available spots
 * @property {boolean} isOpen - Whether currently open
 * @property {string} [website] - Website URL
 * @property {string} [email] - Contact email
 */

/**
 * @typedef {Object} ForecastData
 * @property {string} date - ISO date string
 * @property {number} predictedTotal - Predicted total homeless
 * @property {number} predictedSheltered - Predicted sheltered
 * @property {number} predictedUnsheltered - Predicted unsheltered
 * @property {number} predictedBedDemand - Predicted bed demand
 * @property {number} [confidenceLower] - Lower confidence bound
 * @property {number} [confidenceUpper] - Upper confidence bound
 * @property {number} [actualTotal] - Actual value if available
 */

/**
 * @typedef {Object} ImpactMetrics
 * @property {number} peopleHelped - People helped this month
 * @property {number} backpacksDistributed - Backpacks distributed
 * @property {number} mealsServed - Meals served
 * @property {string} lastUpdated - ISO timestamp
 * @property {Object} [breakdown] - Monthly breakdown
 */

/**
 * @typedef {Object} WeatherAlert
 * @property {string} id - Alert identifier
 * @property {string} type - Alert type (e.g., "Cold Warning", "Heat Advisory")
 * @property {string} severity - "Extreme" | "Severe" | "Moderate" | "Minor"
 * @property {string} description - Alert description
 * @property {string} starts - ISO timestamp when alert starts
 * @property {string} ends - ISO timestamp when alert ends
 * @property {boolean} isActive - Whether alert is currently active
 */

/**
 * @typedef {Object} AnalyticsEvent
 * @property {string} event - Event name
 * @property {string} category - Event category
 * @property {string} [label] - Event label
 * @property {number} [value] - Event value
 * @property {string} timestamp - ISO timestamp
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether request succeeded
 * @property {*} data - Response data
 * @property {string} [error] - Error message if failed
 * @property {string} timestamp - ISO timestamp
 */

/**
 * @typedef {Object} DashboardState
 * @property {HomelessStats} currentStats - Current statistics
 * @property {HistoricalDataPoint[]} historicalData - Historical trend data
 * @property {BedAvailability} bedAvailability - Bed availability data
 * @property {Resource[]} resources - List of resources
 * @property {ForecastData[]} forecastData - Forecast predictions
 * @property {ImpactMetrics} impactMetrics - Impact metrics
 * @property {WeatherAlert[]} weatherAlerts - Active weather alerts
 * @property {boolean} isLoading - Whether data is loading
 * @property {string} [error] - Error message if any
 */

/**
 * @typedef {Object} FilterOptions
 * @property {string[]} types - Resource types to filter
 * @property {string} searchQuery - Search query string
 * @property {Coordinates} [centerLocation] - Center location for proximity search
 * @property {number} [radius] - Search radius in kilometers
 */

/**
 * @typedef {Object} ExportOptions
 * @property {string} format - "png" | "pdf"
 * @property {string} filename - Output filename
 * @property {string[]} [includeCharts] - Chart IDs to include
 * @property {boolean} [includeMap] - Whether to include map
 */

/**
 * @typedef {Object} ThemeConfig
 * @property {string} mode - "light" | "dark"
 * @property {Object} colors - Color palette
 * @property {boolean} enableAnimations - Whether animations are enabled
 * @property {boolean} enableStars - Whether star background is enabled
 */

// Export empty object to make this a module
export {};
