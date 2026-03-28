/**
 * Alerts Controller
 * Generates location-based pest & disease alerts from recent predictions.
 */
import Prediction from '../models/Prediction.js';
import { ALERT_LOOKBACK_MS, ALERT_RADIUS } from '../config/constants.js';

/**
 * @desc    Get active alerts for a location
 * @route   GET /api/alerts/:lat/:lng
 * @access  Public
 */
export const getAlerts = async (req, res) => {
  try {
    const lat = parseFloat(req.params.lat);
    const lng = parseFloat(req.params.lng);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ success: false, error: 'Invalid coordinates' });
    }

    const alerts = [];
    const lookbackDate = new Date(Date.now() - ALERT_LOOKBACK_MS);

    // Find recent high/medium-risk predictions near this location
    const recentPredictions = await Prediction.find({
      lat: { $gte: lat - ALERT_RADIUS, $lte: lat + ALERT_RADIUS },
      lng: { $gte: lng - ALERT_RADIUS, $lte: lng + ALERT_RADIUS },
      createdAt: { $gte: lookbackDate },
    }).sort({ createdAt: -1 }).limit(5);

    // Build alert objects from predictions
    recentPredictions.forEach(pred => {
      if (pred.pestRisk === 'High') {
        const pestName = pred.primaryPests.length > 0 ? pred.primaryPests[0].name : '';
        alerts.push({
          type: 'pest',
          severity: 'high',
          title: `High Pest Risk Alert — ${pred.cropType}`,
          message: `High pest risk detected for ${pred.cropType}.${pestName ? ` Watch for ${pestName}.` : ''} Take immediate preventive action.`,
          timestamp: pred.createdAt,
        });
      }

      if (pred.diseaseRisk === 'High') {
        const diseaseName = pred.primaryDiseases.length > 0 ? pred.primaryDiseases[0].name : '';
        alerts.push({
          type: 'disease',
          severity: 'high',
          title: `High Disease Risk Alert — ${pred.cropType}`,
          message: `High disease risk detected for ${pred.cropType}.${diseaseName ? ` Watch for ${diseaseName}.` : ''} Monitor closely and apply preventive measures.`,
          timestamp: pred.createdAt,
        });
      }

      if (pred.pestRisk === 'Medium' || pred.diseaseRisk === 'Medium') {
        alerts.push({
          type: 'general',
          severity: 'medium',
          title: `Moderate Risk Advisory — ${pred.cropType}`,
          message: `Moderate risk conditions detected for ${pred.cropType}. Continue regular monitoring and maintain IPM practices.`,
          timestamp: pred.createdAt,
        });
      }
    });

    // Default info alert when no threats detected
    if (alerts.length === 0) {
      alerts.push({
        type: 'info',
        severity: 'low',
        title: 'No Active Alerts',
        message: 'No immediate pest or disease threats detected for your area. Continue regular monitoring.',
        timestamp: new Date(),
      });
    }

    res.json({ success: true, data: alerts });
  } catch (error) {
    console.error('Alerts error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch alerts' });
  }
};
