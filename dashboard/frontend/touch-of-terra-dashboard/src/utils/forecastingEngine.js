/**
 * Forecasting Engine
 * Simple time-series forecasting using linear regression and moving averages
 * Generates 3-month projections for homelessness metrics
 */

/**
 * Calculate linear regression coefficients
 * @param {Array} xValues - Independent variable (time indices)
 * @param {Array} yValues - Dependent variable (metric values)
 * @returns {Object} { slope, intercept, rSquared }
 */
const linearRegression = (xValues, yValues) => {
  const n = xValues.length;

  if (n === 0 || xValues.length !== yValues.length) {
    throw new Error('Invalid input for linear regression');
  }

  // Calculate means
  const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
  const yMean = yValues.reduce((sum, y) => sum + y, 0) / n;

  // Calculate slope and intercept
  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    const xDiff = xValues[i] - xMean;
    const yDiff = yValues[i] - yMean;
    numerator += xDiff * yDiff;
    denominator += xDiff * xDiff;
  }

  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = yMean - slope * xMean;

  // Calculate R-squared
  let ssRes = 0;
  let ssTot = 0;

  for (let i = 0; i < n; i++) {
    const predicted = slope * xValues[i] + intercept;
    ssRes += Math.pow(yValues[i] - predicted, 2);
    ssTot += Math.pow(yValues[i] - yMean, 2);
  }

  const rSquared = ssTot !== 0 ? 1 - ssRes / ssTot : 0;

  return { slope, intercept, rSquared };
};

/**
 * Calculate moving average
 * @param {Array} values - Array of values
 * @param {number} window - Window size (default: 3)
 * @returns {number} Moving average
 */
const movingAverage = (values, window = 3) => {
  if (values.length < window) return values[values.length - 1];

  const recentValues = values.slice(-window);
  return recentValues.reduce((sum, val) => sum + val, 0) / window;
};

/**
 * Calculate standard deviation
 * @param {Array} values - Array of values
 * @returns {number} Standard deviation
 */
const standardDeviation = (values) => {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.sqrt(variance);
};

/**
 * Extract metric values from historical data
 * @param {Array} historicalData - Array of historical data points
 * @param {string} metric - Metric name
 * @returns {Array} Array of values
 */
const extractMetricValues = (historicalData, metric) => {
  return historicalData.map((point) => {
    if (typeof point === 'object') {
      return point[metric] || point.total || point.value || 0;
    }
    return point;
  });
};

/**
 * Get date for forecast point
 * @param {string} lastDate - Last historical date
 * @param {number} monthsAhead - Months to add
 * @returns {string} ISO date string
 */
const getForecastDate = (lastDate, monthsAhead) => {
  const date = new Date(lastDate);
  date.setMonth(date.getMonth() + monthsAhead);
  return date.toISOString().split('T')[0];
};

/**
 * Generate forecast using linear regression
 * @param {Array} historicalData - Historical data points
 * @param {Object} options - Forecast options
 * @returns {Promise<Array>} Forecast data points
 */
export const generateForecast = async (historicalData, options = {}) => {
  const {
    monthsAhead = 3,
    metric = 'totalHomeless',
    includeConfidence = true,
    confidenceLevel = 0.95,
  } = options;

  if (!historicalData || historicalData.length < 3) {
    throw new Error('Insufficient historical data. Need at least 3 data points.');
  }

  try {
    // Extract metric values and create time indices
    const values = extractMetricValues(historicalData, metric);
    const timeIndices = Array.from({ length: values.length }, (_, i) => i);

    // Calculate linear regression
    const { slope, intercept, rSquared } = linearRegression(timeIndices, values);

    // Calculate moving average for comparison
    const ma = movingAverage(values, 3);

    // Calculate standard deviation for confidence intervals
    const stdDev = standardDeviation(values);

    // Get last date from historical data
    const lastPoint = historicalData[historicalData.length - 1];
    const lastDate = lastPoint.date || lastPoint.year || new Date().toISOString();

    // Generate forecast points
    const forecast = [];
    const lastIndex = timeIndices[timeIndices.length - 1];

    for (let i = 1; i <= monthsAhead; i++) {
      const futureIndex = lastIndex + i;

      // Linear regression prediction
      const lrPrediction = slope * futureIndex + intercept;

      // Moving average prediction (with trend adjustment)
      const trend = slope;
      const maPrediction = ma + trend * i;

      // Combine predictions (weighted average: 70% LR, 30% MA)
      const combinedPrediction = Math.round(lrPrediction * 0.7 + maPrediction * 0.3);

      // Calculate confidence intervals
      const zScore = confidenceLevel === 0.95 ? 1.96 : 1.645;
      const confidenceMargin = zScore * stdDev * Math.sqrt(1 + 1 / values.length);

      const forecastPoint = {
        date: getForecastDate(lastDate, i),
        month: i,
        predictedTotal: Math.max(0, combinedPrediction),
        method: 'combined_regression_ma',
        rSquared: parseFloat(rSquared.toFixed(4)),
      };

      if (includeConfidence) {
        forecastPoint.confidenceLower = Math.max(0, Math.round(combinedPrediction - confidenceMargin));
        forecastPoint.confidenceUpper = Math.round(combinedPrediction + confidenceMargin);
        forecastPoint.confidenceLevel = confidenceLevel;
      }

      // Add trend indicator
      forecastPoint.trend = slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable';
      forecastPoint.trendPercent = lastPoint[metric] ? ((combinedPrediction - lastPoint[metric]) / lastPoint[metric] * 100).toFixed(1) : 0;

      forecast.push(forecastPoint);
    }

    return forecast;
  } catch (error) {
    console.error('Forecasting error:', error);
    throw error;
  }
};

/**
 * Generate bed demand forecast based on occupancy trends
 * @param {Array} historicalBedData - Historical bed availability data
 * @param {number} monthsAhead - Months to forecast
 * @returns {Promise<Array>} Bed demand forecast
 */
export const generateBedDemandForecast = async (historicalBedData, monthsAhead = 3) => {
  if (!historicalBedData || historicalBedData.length < 3) {
    throw new Error('Insufficient bed data for forecasting');
  }

  try {
    // Extract occupancy rates
    const occupancyRates = historicalBedData.map((point) =>
      parseFloat(point.occupancyRate || point.occupied / point.total * 100 || 0)
    );

    const timeIndices = Array.from({ length: occupancyRates.length }, (_, i) => i);
    const { slope, intercept } = linearRegression(timeIndices, occupancyRates);

    const forecast = [];
    const lastIndex = timeIndices[timeIndices.length - 1];
    const lastPoint = historicalBedData[historicalBedData.length - 1];
    const lastDate = lastPoint.date || new Date().toISOString();

    for (let i = 1; i <= monthsAhead; i++) {
      const futureIndex = lastIndex + i;
      const predictedOccupancy = Math.max(0, Math.min(100, slope * futureIndex + intercept));
      const predictedBedDemand = Math.round((lastPoint.total || 850) * (predictedOccupancy / 100));

      forecast.push({
        date: getForecastDate(lastDate, i),
        month: i,
        predictedBedDemand,
        predictedOccupancyRate: parseFloat(predictedOccupancy.toFixed(1)),
        status: predictedOccupancy > 90 ? 'critical' : predictedOccupancy > 75 ? 'high' : 'moderate',
      });
    }

    return forecast;
  } catch (error) {
    console.error('Bed demand forecasting error:', error);
    throw error;
  }
};

/**
 * Generate multi-metric forecast (total, sheltered, unsheltered)
 * @param {Array} historicalData - Historical data with multiple metrics
 * @param {number} monthsAhead - Months to forecast
 * @returns {Promise<Object>} Multi-metric forecast
 */
export const generateMultiMetricForecast = async (historicalData, monthsAhead = 3) => {
  const metrics = ['totalHomeless', 'sheltered', 'unsheltered'];
  const forecasts = {};

  for (const metric of metrics) {
    try {
      forecasts[metric] = await generateForecast(historicalData, {
        monthsAhead,
        metric,
        includeConfidence: true,
      });
    } catch (error) {
      console.error(`Error forecasting ${metric}:`, error);
      forecasts[metric] = [];
    }
  }

  // Combine into unified forecast
  const combined = [];
  for (let i = 0; i < monthsAhead; i++) {
    combined.push({
      date: forecasts.totalHomeless[i]?.date,
      month: i + 1,
      predictedTotal: forecasts.totalHomeless[i]?.predictedTotal || 0,
      predictedSheltered: forecasts.sheltered[i]?.predictedTotal || 0,
      predictedUnsheltered: forecasts.unsheltered[i]?.predictedTotal || 0,
      confidenceLower: forecasts.totalHomeless[i]?.confidenceLower,
      confidenceUpper: forecasts.totalHomeless[i]?.confidenceUpper,
      trend: forecasts.totalHomeless[i]?.trend,
    });
  }

  return combined;
};

export default {
  generateForecast,
  generateBedDemandForecast,
  generateMultiMetricForecast,
};
