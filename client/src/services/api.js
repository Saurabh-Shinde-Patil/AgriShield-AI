const API_BASE = import.meta.env.VITE_API_URL || '';

async function fetchJSON(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'API error');
  return data.data;
}

export async function getWeather(lat, lng) {
  return fetchJSON(`/weather/${lat}/${lng}`);
}

export async function submitPrediction(payload) {
  return fetchJSON('/predict', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getPredictionHistory(limit = 20) {
  return fetchJSON(`/predict/history?limit=${limit}`);
}

export async function getPrediction(id) {
  return fetchJSON(`/predict/${id}`);
}

export async function getAdvisory(predictionId) {
  return fetchJSON(`/advisory/${predictionId}`);
}

export async function generateAdvisory(data) {
  return fetchJSON('/advisory/generate', { method: 'POST', body: JSON.stringify(data) });
}

export async function submitEnvironmentalData(data) {
  return fetchJSON('/environmental', { method: 'POST', body: JSON.stringify(data) });
}

export async function getEnvironmentalHistory(limit = 20) {
  return fetchJSON(`/environmental/history?limit=${limit}`);
}

export async function reverseGeocode(lat, lng) {
  return fetchJSON(`/location/reverse/${lat}/${lng}`);
}

export async function searchLocations(query) {
  return fetchJSON(`/location/search?q=${encodeURIComponent(query)}`);
}

export async function analyzeImage(file, cropType) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('cropType', cropType);
  const res = await fetch(`${API_BASE}/analyze-image`, { method: 'POST', body: formData });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'API error');
  return data.data;
}

export async function chatbotQuery(message) {
  return fetchJSON('/chatbot', { method: 'POST', body: JSON.stringify({ message }) });
}

export async function getAlerts(lat, lng) {
  return fetchJSON(`/alerts/${lat}/${lng}`);
}
