import Prediction from '../models/Prediction.js';

// @desc    Get active alerts for a location
// @route   GET /api/alerts/:lat/:lng
// @access  Public
export const getAlerts = async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const alerts = [];

    // Check recent high-risk predictions nearby
    const recentPredictions = await Prediction.find({
      lat: { $gte: parseFloat(lat) - 1, $lte: parseFloat(lat) + 1 },
      lng: { $gte: parseFloat(lng) - 1, $lte: parseFloat(lng) + 1 },
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }).sort({ createdAt: -1 }).limit(5);

    recentPredictions.forEach(pred => {
      if (pred.pestRisk === 'High') {
        alerts.push({
          type: 'pest',
          severity: 'high',
          title: `High Pest Risk Alert - ${pred.cropType}`,
          message: `High pest risk detected for ${pred.cropType}. ${pred.primaryPests.length > 0 ? `Watch for ${pred.primaryPests[0].name}.` : ''} Take immediate preventive action.`,
          timestamp: pred.createdAt
        });
      }
      if (pred.diseaseRisk === 'High') {
        alerts.push({
          type: 'disease',
          severity: 'high',
          title: `High Disease Risk Alert - ${pred.cropType}`,
          message: `High disease risk detected for ${pred.cropType}. ${pred.primaryDiseases.length > 0 ? `Watch for ${pred.primaryDiseases[0].name}.` : ''} Monitor closely and apply preventive measures.`,
          timestamp: pred.createdAt
        });
      }
      if (pred.pestRisk === 'Medium' || pred.diseaseRisk === 'Medium') {
        alerts.push({
          type: 'general',
          severity: 'medium',
          title: `Moderate Risk Advisory - ${pred.cropType}`,
          message: `Moderate risk conditions detected for ${pred.cropType}. Continue regular monitoring and maintain IPM practices.`,
          timestamp: pred.createdAt
        });
      }
    });

    // If no DB-based alerts, provide weather-based demo alerts
    if (alerts.length === 0) {
      alerts.push({
        type: 'info',
        severity: 'low',
        title: 'No Active Alerts',
        message: 'No immediate pest or disease threats detected for your area. Continue regular monitoring.',
        timestamp: new Date()
      });
    }

    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch alerts' });
  }
};
