import express from 'express';
import { reverseGeocodeLocation, searchLocation } from '../controllers/locationController.js';

const router = express.Router();

// GET /api/location/reverse/:lat/:lng - Reverse geocode
router.get('/reverse/:lat/:lng', reverseGeocodeLocation);

// GET /api/location/search?q=query - Search locations
router.get('/search', searchLocation);

export default router;
