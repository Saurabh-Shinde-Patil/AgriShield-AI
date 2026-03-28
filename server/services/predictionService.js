import cropRules from '../data/cropRules.js';
import pestDatabase from '../data/pestDatabase.js';
import Prediction from '../models/Prediction.js';
import { RISK_THRESHOLDS, PREDICTION_VALIDITY_MS } from '../config/constants.js';

/**
 * Generate pest & disease risk prediction based on environmental conditions
 * Uses rule-based thresholds from FAO/ICAR models
 */
export function generatePrediction(params) {
  const {
    temperature,
    humidity,
    soilMoisture = 50,
    rainfall = 0,
    windSpeed = 5,
    cropType,
    locationState = ''
  } = params;

  const crop = cropRules[cropType.toLowerCase()];
  if (!crop) {
    return getDefaultPrediction(temperature, humidity, rainfall, soilMoisture, windSpeed, cropType);
  }

  // Calculate pest risk
  const pestResults = evaluateRisks(crop.pests, { temperature, humidity, soilMoisture, rainfall, windSpeed });
  
  // Calculate disease risk
  const diseaseResults = evaluateRisks(crop.diseases, { temperature, humidity, soilMoisture, rainfall, windSpeed });

  // Regional modifier
  const regionData = pestDatabase.regions[locationState.toLowerCase()] || {};
  const regionMultiplier = regionData.riskMultiplier || 1.0;

  const pestScore = Math.min(100, Math.round(pestResults.score * regionMultiplier));
  const diseaseScore = Math.min(100, Math.round(diseaseResults.score * regionMultiplier));

  const pestRisk = scoreToLevel(pestScore);
  const diseaseRisk = scoreToLevel(diseaseScore);

  // Build contributing factors
  const factors = [];
  if (humidity > 75) factors.push({ parameter: 'Humidity', value: humidity, impact: 'High', contribution: 'High humidity promotes fungal growth and pest breeding' });
  else if (humidity > 55) factors.push({ parameter: 'Humidity', value: humidity, impact: 'Medium', contribution: 'Moderate humidity can support pest activity' });
  else factors.push({ parameter: 'Humidity', value: humidity, impact: 'Low', contribution: 'Low humidity reduces disease pressure' });

  if (temperature > 32) factors.push({ parameter: 'Temperature', value: temperature, impact: 'High', contribution: 'High temperature accelerates pest reproduction cycles' });
  else if (temperature > 22) factors.push({ parameter: 'Temperature', value: temperature, impact: 'Medium', contribution: 'Warm temperature is favorable for most pests' });
  else factors.push({ parameter: 'Temperature', value: temperature, impact: 'Low', contribution: 'Cool temperature slows pest development' });

  if (rainfall > 10) factors.push({ parameter: 'Rainfall', value: rainfall, impact: 'High', contribution: 'Heavy rainfall creates conditions for disease outbreaks' });
  else if (rainfall > 3) factors.push({ parameter: 'Rainfall', value: rainfall, impact: 'Medium', contribution: 'Moderate rainfall supports moisture-loving pathogens' });
  else factors.push({ parameter: 'Rainfall', value: rainfall, impact: 'Low', contribution: 'Low rainfall reduces fungal disease risk' });

  if (soilMoisture > 70) factors.push({ parameter: 'Soil Moisture', value: soilMoisture, impact: 'High', contribution: 'Waterlogged soil promotes root diseases' });
  else if (soilMoisture > 40) factors.push({ parameter: 'Soil Moisture', value: soilMoisture, impact: 'Medium', contribution: 'Adequate soil moisture, moderate risk' });
  else factors.push({ parameter: 'Soil Moisture', value: soilMoisture, impact: 'Low', contribution: 'Dry soil may stress plants but reduces soil pathogens' });

  return {
    cropType: crop.displayName || cropType,
    pestRisk,
    diseaseRisk,
    pestScore,
    diseaseScore,
    primaryPests: pestResults.triggered.map(p => ({ name: p.name, probability: Math.round(p.matchScore * 100) })),
    primaryDiseases: diseaseResults.triggered.map(d => ({ name: d.name, probability: Math.round(d.matchScore * 100) })),
    factors,
    weatherSnapshot: { temp: temperature, humidity, rainfall, windSpeed, soilMoisture },
    inputSource: 'combined'
  };
}

/**
 * Evaluate how well current conditions match pest/disease trigger rules.
 * Returns a normalized score (0–100) and the top matching threats.
 */
function evaluateRisks(rules, conditions) {
  let totalScore = 0;
  const triggered = [];

  rules.forEach(rule => {
    const matchScore = calculateMatchScore(rule.conditions, conditions);
    if (matchScore > 0.3) {
      const weightedScore = matchScore * rule.weight * 100;
      totalScore += weightedScore;
      triggered.push({ name: rule.name, matchScore: matchScore * rule.weight, solutions: rule.solutions });
    }
  });

  // Normalize score (max from any individual threat contributes most)
  const normalizedScore = Math.min(100, triggered.length > 0
    ? Math.max(...triggered.map(t => t.matchScore * 100)) * 0.6 + (totalScore / rules.length) * 0.4
    : totalScore / (rules.length || 1));

  triggered.sort((a, b) => b.matchScore - a.matchScore);

  return { score: normalizedScore, triggered: triggered.slice(0, 3) };
}

/**
 * Calculate how closely actual environmental conditions match
 * the trigger thresholds for a specific pest or disease.
 * Returns a value between 0 (no match) and 1 (perfect match).
 */
function calculateMatchScore(conditions, actual) {
  let matches = 0;
  let total = 0;

  if (conditions.tempMin !== undefined) {
    total++;
    if (actual.temperature >= conditions.tempMin) matches++;
    else matches += Math.max(0, 1 - (conditions.tempMin - actual.temperature) / 10);
  }
  if (conditions.tempMax !== undefined) {
    total++;
    if (actual.temperature <= conditions.tempMax) matches++;
    else matches += Math.max(0, 1 - (actual.temperature - conditions.tempMax) / 10);
  }
  if (conditions.humidityMin !== undefined) {
    total++;
    if (actual.humidity >= conditions.humidityMin) matches++;
    else matches += Math.max(0, 1 - (conditions.humidityMin - actual.humidity) / 20);
  }
  if (conditions.humidityMax !== undefined) {
    total++;
    if (actual.humidity <= conditions.humidityMax) matches++;
    else matches += Math.max(0, 1 - (actual.humidity - conditions.humidityMax) / 20);
  }
  if (conditions.rainfallMin !== undefined) {
    total++;
    if (actual.rainfall >= conditions.rainfallMin) matches++;
    else matches += Math.max(0, 1 - (conditions.rainfallMin - actual.rainfall) / 10);
  }
  if (conditions.rainfallMax !== undefined) {
    total++;
    if (actual.rainfall <= conditions.rainfallMax) matches++;
  }
  if (conditions.soilMoistureMin !== undefined) {
    total++;
    if (actual.soilMoisture >= conditions.soilMoistureMin) matches++;
  }
  if (conditions.soilMoistureMax !== undefined) {
    total++;
    if (actual.soilMoisture <= conditions.soilMoistureMax) matches++;
  }

  return total > 0 ? matches / total : 0;
}

/** Convert a numeric risk score to a human-readable level. */
function scoreToLevel(score) {
  if (score >= RISK_THRESHOLDS.HIGH) return 'High';
  if (score >= RISK_THRESHOLDS.MEDIUM) return 'Medium';
  return 'Low';
}

function getDefaultPrediction(temp, humidity, rainfall, soilMoisture, windSpeed, cropType) {
  let pestScore = 20;
  let diseaseScore = 20;

  if (humidity > 80 && temp >= 20 && temp <= 30) diseaseScore += 40;
  else if (humidity > 60) diseaseScore += 20;

  if (temp > 32 && humidity < 50) pestScore += 35;
  else if (temp > 25) pestScore += 15;

  if (rainfall > 10) { diseaseScore += 20; pestScore -= 10; }
  if (soilMoisture > 70) diseaseScore += 15;

  pestScore = Math.max(0, Math.min(100, pestScore));
  diseaseScore = Math.max(0, Math.min(100, diseaseScore));

  return {
    cropType,
    pestRisk: scoreToLevel(pestScore),
    diseaseRisk: scoreToLevel(diseaseScore),
    pestScore,
    diseaseScore,
    primaryPests: [{ name: 'General Insect Pests', probability: pestScore }],
    primaryDiseases: [{ name: 'General Crop Diseases', probability: diseaseScore }],
    factors: [
      { parameter: 'Temperature', value: temp, impact: temp > 30 ? 'High' : 'Medium', contribution: 'Temperature affects pest lifecycle speed' },
      { parameter: 'Humidity', value: humidity, impact: humidity > 70 ? 'High' : 'Medium', contribution: 'Humidity influences disease development' }
    ],
    weatherSnapshot: { temp, humidity, rainfall, windSpeed, soilMoisture },
    inputSource: 'combined'
  };
}

/**
 * Save prediction to database
 */
export async function savePrediction(predictionData, lat, lng, locationName) {
  const prediction = new Prediction({
    ...predictionData,
    lat,
    lng,
    locationName,
    validUntil: new Date(Date.now() + PREDICTION_VALIDITY_MS)
  });
  return await prediction.save();
}
