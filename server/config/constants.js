/**
 * Application-wide constants
 * Centralized configuration values — no more magic numbers scattered in code.
 *
 * FUTURE: Hardware sensor integration can add sensor-specific
 * thresholds and calibration constants here.
 */

// ── Risk Scoring Thresholds ──────────────────────────────────────
export const RISK_THRESHOLDS = {
  HIGH: 60,
  MEDIUM: 35,
};

// ── Weather & Cache ──────────────────────────────────────────────
export const WEATHER_CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes
export const WEATHER_CACHE_RADIUS = 0.01;                 // ~1km lat/lng tolerance

// ── Database Timeouts ────────────────────────────────────────────
export const DB_TIMEOUTS = {
  SERVER_SELECTION_MS: 15000,
  SOCKET_MS: 45000,
  CONNECT_MS: 10000,
};

// ── File Upload ──────────────────────────────────────────────────
export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,         // 5 MB
  ALLOWED_MIMETYPES: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ],
};

// ── Request Body Limits ──────────────────────────────────────────
export const REQUEST_BODY_LIMIT = '10mb';

// ── Prediction ───────────────────────────────────────────────────
export const PREDICTION_VALIDITY_MS = 24 * 60 * 60 * 1000; // 24 hours

// ── Alerts ───────────────────────────────────────────────────────
export const ALERT_LOOKBACK_MS = 24 * 60 * 60 * 1000;       // 24 hours
export const ALERT_RADIUS = 1;                                // ±1 degree lat/lng

// ── Hardware Sensor Config (Future) ──────────────────────────────
// When IoT/hardware sensors are integrated, add their config here:
//
// export const SENSOR_CONFIG = {
//   POLLING_INTERVAL_MS: 5 * 60 * 1000,   // 5 minutes
//   TEMPERATURE_RANGE: { min: -10, max: 55 },
//   HUMIDITY_RANGE: { min: 0, max: 100 },
//   SOIL_MOISTURE_RANGE: { min: 0, max: 100 },
//   SUPPORTED_PROTOCOLS: ['mqtt', 'http', 'websocket'],
// };
