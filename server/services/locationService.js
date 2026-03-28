const fetch = require('node-fetch');

const API_KEY = process.env.OPENWEATHER_API_KEY;

/**
 * Reverse geocode coordinates to location name
 */
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${API_KEY}`
    );

    if (!res.ok) {
      return getDemoLocation(lat, lng);
    }

    const data = await res.json();
    if (data && data.length > 0) {
      return {
        name: data[0].name || 'Unknown',
        state: data[0].state || '',
        country: data[0].country || 'IN',
        lat,
        lng
      };
    }
    return getDemoLocation(lat, lng);
  } catch (err) {
    console.error('Reverse geocode error:', err.message);
    return getDemoLocation(lat, lng);
  }
}

function getDemoLocation(lat, lng) {
  // Return a reasonable default for demo
  const locations = [
    { name: 'Pune', state: 'Maharashtra', lat: 18.52, lng: 73.85 },
    { name: 'Nagpur', state: 'Maharashtra', lat: 21.14, lng: 79.08 },
    { name: 'Ludhiana', state: 'Punjab', lat: 30.90, lng: 75.85 },
    { name: 'Mysore', state: 'Karnataka', lat: 12.29, lng: 76.63 },
    { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.84, lng: 80.94 },
    { name: 'Indore', state: 'Madhya Pradesh', lat: 22.71, lng: 75.85 }
  ];

  // Find nearest demo location
  let nearest = locations[0];
  let minDist = Infinity;
  locations.forEach(loc => {
    const dist = Math.sqrt(Math.pow(lat - loc.lat, 2) + Math.pow(lng - loc.lng, 2));
    if (dist < minDist) { minDist = dist; nearest = loc; }
  });

  return {
    name: nearest.name,
    state: nearest.state,
    country: 'IN',
    lat,
    lng
  };
}

/**
 * Search locations by name
 */
async function searchLocation(query) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)},IN&limit=5&appid=${API_KEY}`
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.map(item => ({
      name: item.name,
      state: item.state || '',
      country: item.country,
      lat: item.lat,
      lng: item.lon
    }));
  } catch (err) {
    console.error('Location search error:', err.message);
    return [];
  }
}

module.exports = { reverseGeocode, searchLocation };
