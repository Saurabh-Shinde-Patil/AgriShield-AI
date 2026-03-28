import cropRules from '../data/cropRules.js';
import pestDatabase from '../data/pestDatabase.js';
import Advisory from '../models/Advisory.js';

/**
 * Generate smart advisory based on prediction results
 */
export function generateAdvisory(prediction) {
  const { cropType, pestRisk, diseaseRisk, pestScore, diseaseScore, primaryPests, primaryDiseases, weatherSnapshot } = prediction;
  
  const overallRisk = pestScore > diseaseScore ? pestRisk : diseaseRisk;
  const riskType = pestScore > diseaseScore ? 'pest' : (diseaseScore > pestScore ? 'disease' : 'both');

  const recommendations = [];

  // Preventive measures
  recommendations.push(...getPreventiveMeasures(overallRisk, cropType));

  // IPM techniques
  recommendations.push(...getIPMRecommendations(primaryPests, primaryDiseases));

  // Organic solutions
  recommendations.push(...getOrganicSolutions(overallRisk));

  // Chemical recommendations (only for High risk)
  if (overallRisk === 'High') {
    recommendations.push(...getChemicalRecommendations(primaryPests, primaryDiseases, cropType));
  }

  // Weather-specific advice
  const weatherAdvisory = getWeatherAdvisory(weatherSnapshot);

  // Spray schedule
  const spraySchedule = getSpraySchedule(overallRisk, cropType, weatherSnapshot, primaryPests, primaryDiseases);

  // Profit impact estimation
  const profitImpact = estimateProfitImpact(overallRisk, pestScore, diseaseScore);

  // Generate voice text
  const voiceText = generateVoiceText(cropType, overallRisk, recommendations.slice(0, 3), weatherAdvisory);

  return {
    cropType,
    riskLevel: overallRisk,
    riskType,
    recommendations,
    spraySchedule,
    profitImpact,
    weatherAdvisory,
    voiceText,
    language: 'en'
  };
}

function getPreventiveMeasures(riskLevel, cropType) {
  const measures = [
    {
      category: 'preventive',
      title: 'Regular Field Monitoring',
      description: 'Scout your fields at least twice a week. Check undersides of leaves, stems, and soil for early signs of pests or disease.',
      priority: riskLevel === 'High' ? 'high' : 'medium',
      timing: 'Ongoing - every 3-4 days'
    },
    {
      category: 'preventive',
      title: 'Proper Water Management',
      description: 'Maintain optimal irrigation. Avoid waterlogging as it promotes fungal diseases. Ensure proper drainage in fields.',
      priority: 'medium',
      timing: 'During irrigation cycles'
    }
  ];

  if (riskLevel === 'High' || riskLevel === 'Medium') {
    measures.push({
      category: 'preventive',
      title: 'Nutrient Management',
      description: 'Avoid excess nitrogen fertilization which makes plants susceptible to pests. Maintain balanced NPK ratio.',
      priority: 'high',
      timing: 'Before next fertilizer application'
    });
  }

  if (riskLevel === 'High') {
    measures.push({
      category: 'preventive',
      title: 'Create Buffer Zones',
      description: 'Plant trap crops or border crops around the field to act as pest barriers. Marigold works well as a trap crop.',
      priority: 'high',
      timing: 'Immediate - within next 3 days'
    });
  }

  return measures;
}

function getIPMRecommendations(pests, diseases) {
  const recs = [];
  const techniques = pestDatabase.ipmTechniques;

  // Add monitoring techniques
  recs.push({
    category: 'ipm',
    title: techniques[0].name,
    description: techniques[0].description,
    priority: 'high',
    timing: 'Install immediately'
  });

  if (pests.length > 0) {
    // Biological control for pests
    const bioTech = techniques.find(t => t.type === 'biological');
    if (bioTech) {
      recs.push({
        category: 'ipm',
        title: bioTech.name,
        description: bioTech.description,
        priority: 'high',
        timing: 'Within 3 days of pest detection'
      });
    }
  }

  // Cultural practices
  const culturalTech = techniques.filter(t => t.type === 'cultural').slice(0, 2);
  culturalTech.forEach(tech => {
    recs.push({
      category: 'ipm',
      title: tech.name,
      description: tech.description,
      priority: 'medium',
      timing: 'Ongoing practice'
    });
  });

  return recs;
}

function getOrganicSolutions(riskLevel) {
  const solutions = pestDatabase.organicSolutions;
  const count = riskLevel === 'High' ? 3 : 2;
  
  return solutions.slice(0, count).map(sol => ({
    category: 'organic',
    title: sol.name,
    description: sol.description,
    priority: riskLevel === 'High' ? 'high' : 'medium',
    timing: `Apply as ${sol.application} treatment`
  }));
}

function getChemicalRecommendations(pests, diseases, cropType) {
  const recs = [];
  const crop = cropRules[cropType.toLowerCase()];

  if (crop) {
    // Get solutions from matched pests/diseases
    const allThreats = [...(crop.pests || []), ...(crop.diseases || [])];
    const matchedThreats = allThreats.filter(t => 
      [...pests, ...diseases].some(p => p.name === t.name)
    );

    matchedThreats.slice(0, 2).forEach(threat => {
      const chemSolution = threat.solutions.find(s => 
        !s.toLowerCase().includes('neem') && 
        !s.toLowerCase().includes('trap') && 
        !s.toLowerCase().includes('release')
      );
      if (chemSolution) {
        recs.push({
          category: 'chemical',
          title: `Targeted Treatment: ${threat.name}`,
          description: chemSolution + '. Use as last resort and follow recommended dosage strictly.',
          priority: 'high',
          timing: 'Only if pest/disease exceeds Economic Threshold Level (ETL)'
        });
      }
    });
  }

  if (recs.length === 0) {
    recs.push({
      category: 'chemical',
      title: 'Consult Agricultural Expert',
      description: 'Given the high risk level, consult your local agricultural extension officer for specific chemical recommendations suited to your region.',
      priority: 'high',
      timing: 'As soon as possible'
    });
  }

  return recs;
}

function getWeatherAdvisory(weather) {
  const parts = [];

  if (weather.rainfall > 10) {
    parts.push('⚠️ Heavy rainfall expected. Avoid spraying pesticides as they will wash away. Ensure proper field drainage.');
  } else if (weather.rainfall > 3) {
    parts.push('🌧 Moderate rainfall expected. Schedule spraying for dry windows. Monitor for post-rain disease outbreaks.');
  }

  if (weather.humidity > 80) {
    parts.push('💧 Very high humidity detected. Ideal conditions for fungal diseases. Increase monitoring frequency.');
  }

  if (weather.temp > 35) {
    parts.push('🌡 Extreme heat conditions. Spray only during early morning or late evening. Increase irrigation frequency.');
  } else if (weather.temp < 15) {
    parts.push('❄️ Cool conditions. Some pests may be less active but fungal spores can persist.');
  }

  if (weather.windSpeed > 15) {
    parts.push('💨 High wind speed. Do not spray, as drift will reduce effectiveness and damage neighboring crops.');
  }

  return parts.join(' ') || '✅ Weather conditions are moderate. Follow standard crop protection practices.';
}

function getSpraySchedule(riskLevel, cropType, weather, pests, diseases) {
  if (riskLevel === 'Low') {
    return {
      recommended: false,
      pesticide: 'None required',
      dosage: 'N/A',
      timing: 'No spraying needed. Continue monitoring.',
      area: 'N/A',
      precautions: ['Continue regular field scouting', 'Maintain IPM practices']
    };
  }

  const crop = cropRules[cropType.toLowerCase()];
  let pesticide = 'Neem oil (5%)';
  let dosage = '5 ml/L of water';

  if (riskLevel === 'High' && crop) {
    const primaryThreat = [...(crop.pests || []), ...(crop.diseases || [])]
      .find(t => [...pests, ...diseases].some(p => p.name === t.name));
    if (primaryThreat) {
      const chemSol = primaryThreat.solutions.find(s => s.includes('Apply') || s.includes('Spray'));
      if (chemSol) {
        pesticide = chemSol;
        dosage = 'As per product label recommendation';
      }
    }
  }

  return {
    recommended: true,
    pesticide,
    dosage,
    timing: weather.rainfall > 5 
      ? 'Wait for dry period (at least 6 hours without rain) before spraying' 
      : 'Early morning (6-9 AM) or late evening (4-6 PM)',
    area: 'Focus on hotspot areas identified during scouting',
    precautions: [
      'Wear protective clothing (mask, gloves, goggles)',
      'Do not spray against wind direction',
      'Maintain recommended spray height (45-60 cm)',
      'Keep 24-hour re-entry interval',
      'Do not eat, drink or smoke during application'
    ]
  };
}

function estimateProfitImpact(riskLevel, pestScore, diseaseScore) {
  const avgRisk = (pestScore + diseaseScore) / 2;

  if (riskLevel === 'High') {
    return {
      estimatedSavings: 15000,
      pesticideReduction: 30,
      yieldImprovement: 20
    };
  } else if (riskLevel === 'Medium') {
    return {
      estimatedSavings: 8000,
      pesticideReduction: 45,
      yieldImprovement: 12
    };
  }
  return {
    estimatedSavings: 3000,
    pesticideReduction: 60,
    yieldImprovement: 5
  };
}

function generateVoiceText(cropType, riskLevel, topRecs, weatherAdvisory) {
  let text = `AgriShield AI Advisory for ${cropType}. `;
  text += `Current risk level is ${riskLevel}. `;

  if (riskLevel === 'High') {
    text += 'Immediate attention required. ';
  }

  topRecs.forEach((rec, i) => {
    text += `Recommendation ${i + 1}: ${rec.title}. ${rec.description} `;
  });

  text += weatherAdvisory.replace(/[⚠️🌧💧🌡❄️💨✅]/g, '');

  return text;
}

/**
 * Save advisory to database
 */
export async function saveAdvisory(advisoryData, predictionId) {
  const advisory = new Advisory({
    ...advisoryData,
    predictionId
  });
  return await advisory.save();
}
