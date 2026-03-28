// Crop-specific pest and disease threshold rules based on FAO/ICAR models
const cropRules = {
  rice: {
    displayName: 'Rice (Paddy)',
    pests: [
      {
        name: 'Brown Plant Hopper',
        conditions: { humidityMin: 75, tempMin: 25, tempMax: 35, rainfallMin: 5 },
        weight: 0.9,
        solutions: ['Neem oil spray', 'Drain paddy fields periodically', 'Use resistant varieties like IR36']
      },
      {
        name: 'Stem Borer',
        conditions: { humidityMin: 60, tempMin: 20, tempMax: 32 },
        weight: 0.8,
        solutions: ['Light traps', 'Release Trichogramma parasitoids', 'Remove dead hearts']
      },
      {
        name: 'Leaf Folder',
        conditions: { humidityMin: 70, tempMin: 22, tempMax: 35, rainfallMin: 3 },
        weight: 0.7,
        solutions: ['Avoid excess nitrogen', 'Use Bacillus thuringiensis spray', 'Maintain field hygiene']
      }
    ],
    diseases: [
      {
        name: 'Blast Disease',
        conditions: { humidityMin: 80, tempMin: 20, tempMax: 30, rainfallMin: 5 },
        weight: 0.95,
        solutions: ['Use resistant varieties', 'Apply Tricyclazole', 'Balanced nitrogen fertilization']
      },
      {
        name: 'Sheath Blight',
        conditions: { humidityMin: 85, tempMin: 25, tempMax: 32 },
        weight: 0.85,
        solutions: ['Reduce plant density', 'Apply Validamycin', 'Remove infected plant debris']
      },
      {
        name: 'Bacterial Leaf Blight',
        conditions: { humidityMin: 70, tempMin: 25, tempMax: 35, rainfallMin: 10 },
        weight: 0.8,
        solutions: ['Use certified seeds', 'Avoid clipping seedlings', 'Spray Streptocycline']
      }
    ]
  },
  wheat: {
    displayName: 'Wheat',
    pests: [
      {
        name: 'Aphids',
        conditions: { humidityMin: 50, tempMin: 15, tempMax: 28 },
        weight: 0.85,
        solutions: ['Spray Neem seed extract', 'Release ladybird beetles', 'Avoid late sowing']
      },
      {
        name: 'Termites',
        conditions: { humidityMax: 40, tempMin: 25, tempMax: 38, soilMoistureMax: 30 },
        weight: 0.7,
        solutions: ['Treat seeds with Chlorpyrifos', 'Irrigate fields regularly', 'Add organic matter to soil']
      }
    ],
    diseases: [
      {
        name: 'Rust (Yellow/Brown)',
        conditions: { humidityMin: 70, tempMin: 10, tempMax: 25, rainfallMin: 3 },
        weight: 0.9,
        solutions: ['Use rust-resistant varieties', 'Apply Propiconazole', 'Timely sowing']
      },
      {
        name: 'Powdery Mildew',
        conditions: { humidityMin: 60, tempMin: 15, tempMax: 25 },
        weight: 0.8,
        solutions: ['Apply sulphur spray', 'Ensure proper spacing', 'Use resistant varieties']
      },
      {
        name: 'Karnal Bunt',
        conditions: { humidityMin: 75, tempMin: 18, tempMax: 24, rainfallMin: 5 },
        weight: 0.75,
        solutions: ['Use certified seed', 'Treat seeds with Thiram', 'Avoid excessive irrigation during flowering']
      }
    ]
  },
  cotton: {
    displayName: 'Cotton',
    pests: [
      {
        name: 'Pink Bollworm',
        conditions: { humidityMin: 60, tempMin: 25, tempMax: 35 },
        weight: 0.95,
        solutions: ['Use Bt cotton varieties', 'Install pheromone traps', 'Destroy crop residues after harvest']
      },
      {
        name: 'Whitefly',
        conditions: { humidityMin: 50, tempMin: 28, tempMax: 38 },
        weight: 0.85,
        solutions: ['Yellow sticky traps', 'Spray Neem oil', 'Avoid excessive nitrogen']
      },
      {
        name: 'American Bollworm',
        conditions: { humidityMin: 55, tempMin: 20, tempMax: 32, rainfallMax: 5 },
        weight: 0.9,
        solutions: ['Release Trichogramma', 'HaNPV biological spray', 'Bird perches in field']
      }
    ],
    diseases: [
      {
        name: 'Bacterial Blight',
        conditions: { humidityMin: 80, tempMin: 25, tempMax: 35, rainfallMin: 10 },
        weight: 0.85,
        solutions: ['Use resistant varieties', 'Seed treatment with Streptocycline', 'Remove infected plants']
      },
      {
        name: 'Fusarium Wilt',
        conditions: { humidityMin: 60, tempMin: 25, tempMax: 33, soilMoistureMin: 60 },
        weight: 0.8,
        solutions: ['Crop rotation', 'Use wilt-resistant varieties', 'Soil treatment with Trichoderma']
      }
    ]
  },
  tomato: {
    displayName: 'Tomato',
    pests: [
      {
        name: 'Fruit Borer (Helicoverpa)',
        conditions: { humidityMin: 50, tempMin: 20, tempMax: 32 },
        weight: 0.9,
        solutions: ['Install pheromone traps', 'Spray HaNPV', 'Release Trichogramma']
      },
      {
        name: 'Whitefly',
        conditions: { humidityMin: 45, tempMin: 25, tempMax: 38 },
        weight: 0.85,
        solutions: ['Yellow sticky traps', 'Neem oil spray', 'Mulching to reduce population']
      },
      {
        name: 'Leaf Miner',
        conditions: { humidityMin: 40, tempMin: 22, tempMax: 35 },
        weight: 0.7,
        solutions: ['Remove infested leaves', 'Use Neem-based pesticides', 'Biological control with parasitoids']
      }
    ],
    diseases: [
      {
        name: 'Early Blight',
        conditions: { humidityMin: 70, tempMin: 20, tempMax: 30, rainfallMin: 3 },
        weight: 0.9,
        solutions: ['Apply Mancozeb', 'Mulching', 'Avoid overhead irrigation']
      },
      {
        name: 'Late Blight',
        conditions: { humidityMin: 85, tempMin: 15, tempMax: 22, rainfallMin: 5 },
        weight: 0.95,
        solutions: ['Apply Metalaxyl + Mancozeb', 'Destroy infected plants', 'Use resistant varieties']
      },
      {
        name: 'Leaf Curl Virus',
        conditions: { humidityMin: 50, tempMin: 25, tempMax: 35 },
        weight: 0.85,
        solutions: ['Control whitefly vectors', 'Use ToLCV-resistant varieties', 'Remove infected plants early']
      }
    ]
  },
  potato: {
    displayName: 'Potato',
    pests: [
      {
        name: 'Potato Tuber Moth',
        conditions: { humidityMin: 40, tempMin: 20, tempMax: 35 },
        weight: 0.85,
        solutions: ['Deep planting', 'Hilling to cover tubers', 'Pheromone traps']
      },
      {
        name: 'Aphids',
        conditions: { humidityMin: 50, tempMin: 15, tempMax: 28 },
        weight: 0.8,
        solutions: ['Neem oil spray', 'Yellow pan traps', 'Ladybird beetles release']
      }
    ],
    diseases: [
      {
        name: 'Late Blight',
        conditions: { humidityMin: 85, tempMin: 12, tempMax: 22, rainfallMin: 5 },
        weight: 0.95,
        solutions: ['Apply Cymoxanil + Mancozeb', 'Use resistant varieties', 'Destroy volunteer plants']
      },
      {
        name: 'Early Blight',
        conditions: { humidityMin: 60, tempMin: 20, tempMax: 30 },
        weight: 0.8,
        solutions: ['Apply Mancozeb', 'Maintain adequate nutrition', 'Crop rotation']
      }
    ]
  },
  sugarcane: {
    displayName: 'Sugarcane',
    pests: [
      {
        name: 'Top Borer',
        conditions: { humidityMin: 70, tempMin: 25, tempMax: 35 },
        weight: 0.9,
        solutions: ['Light traps', 'Release Trichogramma', 'Remove dead hearts']
      },
      {
        name: 'Woolly Aphid',
        conditions: { humidityMin: 60, tempMin: 20, tempMax: 30, rainfallMax: 5 },
        weight: 0.8,
        solutions: ['Spray Dimethoate', 'Detrash lower leaves', 'Biological control with Dipha aphidivora']
      }
    ],
    diseases: [
      {
        name: 'Red Rot',
        conditions: { humidityMin: 80, tempMin: 25, tempMax: 32, rainfallMin: 10 },
        weight: 0.9,
        solutions: ['Use resistant varieties', 'Treat setts with fungicide', 'Avoid waterlogging']
      },
      {
        name: 'Smut',
        conditions: { humidityMin: 55, tempMin: 25, tempMax: 35 },
        weight: 0.75,
        solutions: ['Use resistant varieties', 'Hot air treatment of setts', 'Remove infected clumps']
      }
    ]
  },
  maize: {
    displayName: 'Maize (Corn)',
    pests: [
      {
        name: 'Fall Armyworm',
        conditions: { humidityMin: 60, tempMin: 22, tempMax: 35 },
        weight: 0.95,
        solutions: ['Spray Emamectin Benzoate', 'Release Trichogramma', 'Apply Neem oil early']
      },
      {
        name: 'Stem Borer',
        conditions: { humidityMin: 55, tempMin: 20, tempMax: 32 },
        weight: 0.8,
        solutions: ['Crop rotation', 'Remove crop stubbles', 'Biological control agents']
      }
    ],
    diseases: [
      {
        name: 'Turcicum Leaf Blight',
        conditions: { humidityMin: 75, tempMin: 18, tempMax: 27, rainfallMin: 5 },
        weight: 0.85,
        solutions: ['Use resistant hybrids', 'Apply Mancozeb', 'Avoid monoculture']
      },
      {
        name: 'Maydis Leaf Blight',
        conditions: { humidityMin: 80, tempMin: 22, tempMax: 30, rainfallMin: 8 },
        weight: 0.8,
        solutions: ['Use tolerant varieties', 'Balanced fertilization', 'Remove crop debris']
      }
    ]
  },
  soybean: {
    displayName: 'Soybean',
    pests: [
      {
        name: 'Stem Fly',
        conditions: { humidityMin: 60, tempMin: 22, tempMax: 32 },
        weight: 0.85,
        solutions: ['Seed treatment with Thiamethoxam', 'Timely sowing', 'Intercropping with sorghum']
      },
      {
        name: 'Leaf Eating Caterpillar',
        conditions: { humidityMin: 65, tempMin: 20, tempMax: 30, rainfallMin: 5 },
        weight: 0.8,
        solutions: ['Spray Quinalphos', 'Hand picking in early stages', 'Use Bt-based biopesticide']
      }
    ],
    diseases: [
      {
        name: 'Rust',
        conditions: { humidityMin: 80, tempMin: 18, tempMax: 28, rainfallMin: 5 },
        weight: 0.9,
        solutions: ['Apply Hexaconazole', 'Use tolerant varieties', 'Timely sowing']
      },
      {
        name: 'Yellow Mosaic Virus',
        conditions: { humidityMin: 55, tempMin: 25, tempMax: 35 },
        weight: 0.85,
        solutions: ['Control whitefly', 'Use resistant varieties', 'Rogue out infected plants']
      }
    ]
  }
};

module.exports = cropRules;
