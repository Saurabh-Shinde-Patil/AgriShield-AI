/**
 * Simulated image-based disease detection
 * In production, replace with a real ML model (TensorFlow/PyTorch)
 */

const diseaseDatabase = [
  {
    name: 'Leaf Blast',
    crops: ['rice'],
    symptoms: 'Diamond-shaped lesions on leaves with gray or white centers',
    confidence: 0.87,
    action: 'Apply Tricyclazole 75WP at 0.6g/L. Remove and burn infected leaves.'
  },
  {
    name: 'Early Blight',
    crops: ['tomato', 'potato'],
    symptoms: 'Concentric ring pattern (target-like) brown spots on older leaves',
    confidence: 0.82,
    action: 'Spray Mancozeb 75WP at 2.5g/L. Maintain adequate spacing for air circulation.'
  },
  {
    name: 'Late Blight',
    crops: ['tomato', 'potato'],
    symptoms: 'Water-soaked dark brown lesions on leaves, white mold on undersides',
    confidence: 0.91,
    action: 'Apply Metalaxyl + Mancozeb. Destroy all infected plant parts immediately.'
  },
  {
    name: 'Bacterial Leaf Blight',
    crops: ['rice'],
    symptoms: 'Yellow to white lesions along leaf veins, wilting from tip',
    confidence: 0.79,
    action: 'Spray Streptocycline (500 ppm). Avoid excess nitrogen fertilization.'
  },
  {
    name: 'Leaf Curl Virus',
    crops: ['tomato', 'cotton'],
    symptoms: 'Upward curling and thickening of leaves, stunted growth',
    confidence: 0.84,
    action: 'Control whitefly vectors with Imidacloprid. Remove infected plants.'
  },
  {
    name: 'Powdery Mildew',
    crops: ['wheat', 'cotton', 'soybean'],
    symptoms: 'White powdery coating on leaves, stems, and pods',
    confidence: 0.88,
    action: 'Apply Sulphur 80WP at 3g/L. Ensure proper spacing and ventilation.'
  },
  {
    name: 'Rust Disease',
    crops: ['wheat', 'soybean'],
    symptoms: 'Orange-brown pustules on leaves and stems',
    confidence: 0.85,
    action: 'Apply Propiconazole 25EC at 1ml/L. Switch to rust-resistant varieties next season.'
  },
  {
    name: 'Fusarium Wilt',
    crops: ['cotton', 'tomato'],
    symptoms: 'Yellowing and wilting of leaves on one side, browning of vascular tissue',
    confidence: 0.76,
    action: 'Apply Trichoderma viride to soil. Practice crop rotation with non-host crops.'
  },
  {
    name: 'Downy Mildew',
    crops: ['maize', 'soybean'],
    symptoms: 'Yellowish-green stripes on leaves, white downy growth on undersides',
    confidence: 0.81,
    action: 'Seed treatment with Metalaxyl. Remove and destroy infected plants.'
  },
  {
    name: 'Anthracnose',
    crops: ['soybean', 'maize'],
    symptoms: 'Dark, sunken lesions on stems, pods, and leaves',
    confidence: 0.78,
    action: 'Apply Carbendazim at 1g/L. Use certified disease-free seeds.'
  }
];

/**
 * Analyze uploaded crop image for disease detection
 * Returns simulated results based on crop type
 */
export function analyzeImage(cropType, imageName) {
  // Filter diseases relevant to the crop
  const cropLower = (cropType || '').toLowerCase();
  let relevantDiseases = diseaseDatabase.filter(d =>
    d.crops.some(c => cropLower.includes(c))
  );

  if (relevantDiseases.length === 0) {
    relevantDiseases = diseaseDatabase.slice(0, 3);
  }

  // Simulate detection - pick a primary disease
  const primary = relevantDiseases[Math.floor(Math.random() * relevantDiseases.length)];
  const secondary = relevantDiseases.find(d => d.name !== primary.name);

  const results = {
    detected: true,
    primary: {
      disease: primary.name,
      confidence: Math.round((primary.confidence + (Math.random() * 0.1 - 0.05)) * 100) / 100,
      symptoms: primary.symptoms,
      action: primary.action
    },
    secondary: secondary ? {
      disease: secondary.name,
      confidence: Math.round((secondary.confidence * 0.6 + (Math.random() * 0.1)) * 100) / 100,
      symptoms: secondary.symptoms,
      action: secondary.action
    } : null,
    imageName,
    cropType,
    analysisTimestamp: new Date()
  };

  return results;
}
