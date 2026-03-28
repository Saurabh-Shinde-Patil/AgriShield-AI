/**
 * API Service — Client-side HTTP client
 *
 * All API calls go through this module.
 * In development: Vite proxy forwards /api/* to the backend.
 * In production:  VITE_API_URL points to the Render backend URL.
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Generic JSON fetch with error handling.
 * All successful API responses follow: { success: true, data: ... }
 */
async function fetchJSON(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error || 'API request failed');
  }

  return data.data;
}

// ── Weather ──────────────────────────────────────────────────────

/** Fetch current weather + forecast for coordinates. */
export async function getWeather(lat, lng) {
  return fetchJSON(`/api/weather/${lat}/${lng}`);
}

// ── Predictions ──────────────────────────────────────────────────

/** Submit environmental data and generate a prediction. */
export async function submitPrediction(payload) {
  return fetchJSON('/api/predict', { method: 'POST', body: JSON.stringify(payload) });
}

/** Get prediction history with optional limit. */
export async function getPredictionHistory(limit = 20) {
  return fetchJSON(`/api/predict/history?limit=${limit}`);
}

/** Get a single prediction by ID. */
export async function getPrediction(id) {
  return fetchJSON(`/api/predict/${id}`);
}

// ── Advisory ─────────────────────────────────────────────────────

/** Get advisory for a previously saved prediction. */
export async function getAdvisory(predictionId) {
  return fetchJSON(`/api/advisory/${predictionId}`);
}

/** Generate advisory from inline prediction data (no DB lookup). */
export async function generateAdvisory(data) {
  return fetchJSON('/api/advisory/generate', { method: 'POST', body: JSON.stringify(data) });
}

// ── Environmental Data ───────────────────────────────────────────

/** Submit environmental / sensor data. */
export async function submitEnvironmentalData(data) {
  return fetchJSON('/api/environmental', { method: 'POST', body: JSON.stringify(data) });
}

/** Get environmental data history. */
export async function getEnvironmentalHistory(limit = 20) {
  return fetchJSON(`/api/environmental/history?limit=${limit}`);
}

// ── Location ─────────────────────────────────────────────────────

/** Reverse geocode lat/lng to a place name. */
export async function reverseGeocode(lat, lng) {
  return fetchJSON(`/api/location/reverse/${lat}/${lng}`);
}

/** Search locations by name. */
export async function searchLocations(query) {
  return fetchJSON(`/api/location/search?q=${encodeURIComponent(query)}`);
}

// ── Image Analysis ───────────────────────────────────────────────

/** Upload and analyze a crop image for disease detection. */
export async function analyzeImage(file, cropType) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('cropType', cropType);

  const res = await fetch(`${API_BASE}/api/analyze-image`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Image analysis failed');
  return data.data;
}

// ── Chatbot ──────────────────────────────────────────────────────

/** Send a query to the farming chatbot. */
export async function chatbotQuery(message) {
  return fetchJSON('/api/chatbot', { method: 'POST', body: JSON.stringify({ message }) });
}

// ── Alerts ───────────────────────────────────────────────────────

/** Get active pest/disease alerts for a location. */
export async function getAlerts(lat, lng) {
  return fetchJSON(`/api/alerts/${lat}/${lng}`);
}
