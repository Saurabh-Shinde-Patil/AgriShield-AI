// Regional pest history and agro-climatic zone data
const pestDatabase = {
  regions: {
    maharashtra: {
      commonPests: ['Pink Bollworm', 'Fall Armyworm', 'Whitefly'],
      commonDiseases: ['Fusarium Wilt', 'Bacterial Blight'],
      agroZone: 'Western Plateau and Hills',
      riskMultiplier: 1.1
    },
    punjab: {
      commonPests: ['Aphids', 'Stem Borer', 'Termites'],
      commonDiseases: ['Yellow Rust', 'Karnal Bunt', 'Powdery Mildew'],
      agroZone: 'Trans-Gangetic Plains',
      riskMultiplier: 1.0
    },
    karnataka: {
      commonPests: ['Brown Plant Hopper', 'Fruit Borer', 'Leaf Miner'],
      commonDiseases: ['Blast Disease', 'Late Blight', 'Leaf Curl'],
      agroZone: 'Southern Plateau and Hills',
      riskMultiplier: 1.05
    },
    'uttar pradesh': {
      commonPests: ['Stem Borer', 'Aphids', 'Top Borer'],
      commonDiseases: ['Rust', 'Smut', 'Red Rot'],
      agroZone: 'Upper & Middle Gangetic Plains',
      riskMultiplier: 1.0
    },
    'tamil nadu': {
      commonPests: ['Brown Plant Hopper', 'Leaf Folder', 'Whitefly'],
      commonDiseases: ['Blast Disease', 'Sheath Blight', 'Leaf Curl Virus'],
      agroZone: 'East Coast Plains and Hills',
      riskMultiplier: 1.1
    },
    'west bengal': {
      commonPests: ['Stem Borer', 'Brown Plant Hopper', 'Gall Midge'],
      commonDiseases: ['Sheath Blight', 'Bacterial Leaf Blight', 'Blast'],
      agroZone: 'Lower Gangetic Plains',
      riskMultiplier: 1.15
    },
    'madhya pradesh': {
      commonPests: ['Stem Fly', 'Fall Armyworm', 'Pod Borer'],
      commonDiseases: ['Soybean Rust', 'Yellow Mosaic', 'Anthracnose'],
      agroZone: 'Central Plateau and Hills',
      riskMultiplier: 1.0
    },
    rajasthan: {
      commonPests: ['Termites', 'Aphids', 'White Grub'],
      commonDiseases: ['Downy Mildew', 'Ergot', 'Smut'],
      agroZone: 'Western Dry Region',
      riskMultiplier: 0.85
    },
    gujarat: {
      commonPests: ['Pink Bollworm', 'Whitefly', 'American Bollworm'],
      commonDiseases: ['Bacterial Blight', 'Alternaria Leaf Spot'],
      agroZone: 'Gujarat Plains and Hills',
      riskMultiplier: 1.05
    },
    andhra_pradesh: {
      commonPests: ['Brown Plant Hopper', 'Fruit Borer', 'Thrips'],
      commonDiseases: ['Blast', 'Bacterial Leaf Blight', 'Early Blight'],
      agroZone: 'East Coast Plains and Hills',
      riskMultiplier: 1.1
    }
  },

  // IPM (Integrated Pest Management) techniques
  ipmTechniques: [
    { name: 'Pheromone Traps', description: 'Install species-specific pheromone traps at 5/ha for monitoring and mass trapping.', type: 'monitoring' },
    { name: 'Light Traps', description: 'Install light traps at 1/ha to monitor and attract nocturnal pests.', type: 'monitoring' },
    { name: 'Yellow Sticky Traps', description: 'Place 10-15 yellow sticky traps per hectare for whitefly and aphid monitoring.', type: 'monitoring' },
    { name: 'Trichogramma Release', description: 'Release Trichogramma egg parasitoids at 1.5 lakh/ha for borer control.', type: 'biological' },
    { name: 'Neem Oil Spray', description: 'Spray 5% Neem Seed Kernel Extract (NSKE) at first sign of pest incidence.', type: 'organic' },
    { name: 'Crop Rotation', description: 'Rotate crops to break pest and disease cycles. Avoid same crop family.', type: 'cultural' },
    { name: 'Intercropping', description: 'Plant trap crops or repellent crops between main crop rows.', type: 'cultural' },
    { name: 'Field Sanitation', description: 'Remove and destroy crop residues, weed hosts, and volunteer plants.', type: 'cultural' },
    { name: 'Trichoderma Treatment', description: 'Apply Trichoderma viride at 2.5 kg/ha mixed with FYM for soil-borne disease control.', type: 'biological' },
    { name: 'Pseudomonas Treatment', description: 'Seed treat with Pseudomonas fluorescens at 10g/kg seed for disease suppression.', type: 'biological' }
  ],

  // General organic solutions
  organicSolutions: [
    { name: 'Neem Cake', description: 'Apply neem cake at 250 kg/ha as soil amendment to reduce soil pests.', application: 'soil' },
    { name: 'Panchagavya', description: 'Spray 3% Panchagavya solution for plant growth and pest resistance.', application: 'foliar' },
    { name: 'Dashparni Ark', description: 'Use Dashparni extract (10-leaf extract) as organic pesticide spray.', application: 'foliar' },
    { name: 'Jeevamrutha', description: 'Apply Jeevamrutha solution for soil health and beneficial microorganism growth.', application: 'soil' },
    { name: 'Cow Urine Spray', description: 'Spray 10% cow urine solution for pest deterrence and plant nutrition.', application: 'foliar' },
    { name: 'Beauveria bassiana', description: 'Spray Beauveria bassiana at 5g/L as biological insecticide for soft-bodied insects.', application: 'foliar' }
  ]
};

module.exports = pestDatabase;
