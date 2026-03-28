const cropRules = require('../data/cropRules');
const pestDatabase = require('../data/pestDatabase');

/**
 * Chatbot service for agricultural queries
 * Uses keyword matching and context for responses
 */

const knowledgeBase = {
  greetings: {
    keywords: ['hello', 'hi', 'hey', 'namaste', 'good morning', 'good evening'],
    response: '🌱 Namaste! I\'m AgriShield AI, your farming assistant. Ask me anything about pest control, crop diseases, weather effects, or farming practices. How can I help you today?'
  },
  pestGeneral: {
    keywords: ['pest', 'insect', 'bug', 'worm', 'caterpillar', 'aphid', 'borer'],
    response: 'Pest management is crucial for crop protection. Here are key principles:\n\n1. **Monitor regularly** - Scout fields twice a week\n2. **Use IPM approach** - Combine biological, cultural, and chemical methods\n3. **Biological control** - Release beneficial insects like Trichogramma\n4. **Organic first** - Start with Neem oil (5% NSKE) before chemicals\n5. **Threshold-based spraying** - Only spray when pest population exceeds ETL\n\nTell me your specific crop and pest for detailed advice!'
  },
  diseaseGeneral: {
    keywords: ['disease', 'fungus', 'blight', 'rust', 'wilt', 'mildew', 'rot', 'infection'],
    response: 'Crop diseases can be managed effectively:\n\n1. **Prevention** - Use resistant varieties and certified seeds\n2. **Field hygiene** - Remove and destroy infected plants\n3. **Water management** - Avoid waterlogging, ensure proper drainage\n4. **Fungicide schedule** - Apply preventive fungicides during high-risk weather\n5. **Organic options** - Trichoderma viride and Pseudomonas fluorescens\n\nSpecify your crop for targeted disease management advice!'
  },
  weather: {
    keywords: ['weather', 'rain', 'temperature', 'humidity', 'forecast', 'climate'],
    response: 'Weather plays a critical role in pest/disease risk:\n\n🌡 **Hot & Dry (>35°C, low humidity)** → Insect pest risk increases\n💧 **Warm & Humid (25-30°C, >80% RH)** → Fungal disease risk HIGH\n🌧 **Heavy Rain** → Avoid spraying, check for waterlogging\n💨 **High Wind** → Do not spray pesticides\n\nUse our Weather page to get real-time forecasts and risk windows!'
  },
  organic: {
    keywords: ['organic', 'natural', 'neem', 'biological', 'bio', 'eco'],
    response: 'Organic pest and disease management options:\n\n🌿 **Neem-based**: NSKE 5% spray effective against 200+ pests\n🐛 **Biological Control**: Trichogramma, Beauveria bassiana, Trichoderma\n🌱 **Botanical**: Dashparni Ark, Panchagavya spray\n🐄 **Traditional**: Cow urine spray (10%), Jeevamrutha\n🌻 **Cultural**: Trap cropping with marigold, crop rotation\n\nThese methods are safe, sustainable, and often more cost-effective!'
  },
  spraying: {
    keywords: ['spray', 'pesticide', 'dosage', 'timing', 'when to spray', 'how much'],
    response: 'Smart spraying guidelines:\n\n⏰ **Best Time**: Early morning (6-9 AM) or late evening (4-6 PM)\n🌧 **Rain Check**: Don\'t spray if rain expected within 6 hours\n💨 **Wind**: Avoid spraying when wind speed > 10 km/h\n📏 **Nozzle Height**: Maintain 45-60 cm from crop canopy\n💊 **Dosage**: Always follow product label, don\'t over-apply\n🛡 **Safety**: Wear mask, gloves, goggles during application\n\nUse our Precision Spraying feature for exact dosage calculations!'
  },
  crops: {
    keywords: ['crop', 'agriculture', 'farming', 'cultivation', 'grow', 'plant', 'sow'],
    response: 'I can provide specific guidance for these crops:\n\n🌾 Rice | 🌿 Wheat | 🌿 Cotton | 🍅 Tomato\n🥔 Potato | 🌿 Sugarcane | 🌽 Maize | 🫘 Soybean\n\nTell me which crop you\'re growing and I\'ll provide detailed pest/disease management advice!'
  },
  soil: {
    keywords: ['soil', 'moisture', 'irrigation', 'water', 'drainage'],
    response: 'Soil and water management tips:\n\n💧 **Optimal moisture**: 40-60% for most crops\n🚿 **Irrigation**: Drip/sprinkler > flood irrigation\n🏞 **Drainage**: Essential to prevent root rot\n🌱 **Soil health**: Add organic matter, use Trichoderma\n📊 **Monitor**: Check soil moisture before irrigating\n\nUse our manual input form to log soil moisture for better predictions!'
  }
};

// Crop-specific responses
function getCropSpecificResponse(message) {
  const msgLower = message.toLowerCase();
  
  for (const [cropKey, cropData] of Object.entries(cropRules)) {
    if (msgLower.includes(cropKey)) {
      const pestNames = cropData.pests.map(p => p.name).join(', ');
      const diseaseNames = cropData.diseases.map(d => d.name).join(', ');
      
      let response = `📋 **${cropData.displayName} Guide**\n\n`;
      response += `🐛 **Common Pests**: ${pestNames}\n\n`;
      response += `🦠 **Common Diseases**: ${diseaseNames}\n\n`;
      
      // Add solutions for primary pest and disease
      const topPest = cropData.pests[0];
      const topDisease = cropData.diseases[0];
      
      response += `**Top Pest - ${topPest.name}**:\n`;
      topPest.solutions.forEach(s => { response += `• ${s}\n`; });
      response += `\n**Top Disease - ${topDisease.name}**:\n`;
      topDisease.solutions.forEach(s => { response += `• ${s}\n`; });
      
      response += '\nUse our Prediction Engine for real-time risk assessment!';
      return response;
    }
  }
  return null;
}

function processQuery(message) {
  const msgLower = message.toLowerCase();

  // Check crop-specific first
  const cropResponse = getCropSpecificResponse(message);
  if (cropResponse) return { response: cropResponse, type: 'crop_specific' };

  // Check knowledge base
  for (const [key, entry] of Object.entries(knowledgeBase)) {
    if (entry.keywords.some(kw => msgLower.includes(kw))) {
      return { response: entry.response, type: key };
    }
  }

  // Default response
  return {
    response: '🤔 I\'m not sure about that specific query. Here\'s what I can help with:\n\n• 🐛 **Pest management** - Ask about specific pests\n• 🦠 **Disease control** - Disease identification and treatment\n• 🌦 **Weather impact** - How weather affects your crops\n• 🌿 **Organic solutions** - Eco-friendly pest control\n• 💊 **Spraying advice** - When, how, and how much to spray\n• 🌾 **Crop-specific guide** - Mention any crop name\n\nTry asking: "How to control pests in cotton?" or "What diseases affect rice?"',
    type: 'default'
  };
}

module.exports = { processQuery };
