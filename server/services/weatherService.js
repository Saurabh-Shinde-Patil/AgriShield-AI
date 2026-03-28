import fetch from 'node-fetch';
import WeatherLog from '../models/WeatherLog.js';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetch current weather + 5-day forecast from OpenWeatherMap
 * Results are cached in MongoDB for 30 minutes
 */
export async function getWeatherData(lat, lng) {
  // Check cache first
  const cached = await WeatherLog.findOne({
    lat: { $gte: lat - 0.01, $lte: lat + 0.01 },
    lng: { $gte: lng - 0.01, $lte: lng + 0.01 },
    expiresAt: { $gt: new Date() }
  }).sort({ fetchedAt: -1 });

  if (cached) {
    return cached;
  }

  // Fetch from OpenWeatherMap
  const [currentRes, forecastRes] = await Promise.all([
    fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`),
    fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`)
  ]);

  if (!currentRes.ok || !forecastRes.ok) {
    // Return demo data when API key is not set or invalid
    return generateDemoWeather(lat, lng);
  }

  const currentData = await currentRes.json();
  const forecastData = await forecastRes.json();

  // Process forecast into daily summaries
  const dailyForecast = processForecast(forecastData.list);

  const weatherLog = new WeatherLog({
    lat,
    lng,
    locationName: currentData.name || 'Unknown',
    current: {
      temp: currentData.main.temp,
      humidity: currentData.main.humidity,
      pressure: currentData.main.pressure,
      windSpeed: currentData.wind.speed,
      rainfall: currentData.rain ? currentData.rain['1h'] || currentData.rain['3h'] || 0 : 0,
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      feelsLike: currentData.main.feels_like,
      visibility: currentData.visibility
    },
    forecast: dailyForecast,
    fetchedAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000)
  });

  try {
    await weatherLog.save();
  } catch (e) {
    console.log('Weather cache save warning:', e.message);
  }

  return weatherLog;
}

function processForecast(forecastList) {
  const dailyMap = {};

  forecastList.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyMap[date]) {
      dailyMap[date] = {
        date: new Date(date),
        temps: [],
        humidities: [],
        rainfalls: [],
        windSpeeds: [],
        descriptions: [],
        icons: []
      };
    }
    dailyMap[date].temps.push(item.main.temp);
    dailyMap[date].humidities.push(item.main.humidity);
    dailyMap[date].rainfalls.push(item.rain ? item.rain['3h'] || 0 : 0);
    dailyMap[date].windSpeeds.push(item.wind.speed);
    dailyMap[date].descriptions.push(item.weather[0].description);
    dailyMap[date].icons.push(item.weather[0].icon);
  });

  return Object.values(dailyMap).map(day => ({
    date: day.date,
    tempMin: Math.min(...day.temps),
    tempMax: Math.max(...day.temps),
    humidity: Math.round(day.humidities.reduce((a, b) => a + b, 0) / day.humidities.length),
    rainfall: day.rainfalls.reduce((a, b) => a + b, 0),
    windSpeed: Math.round((day.windSpeeds.reduce((a, b) => a + b, 0) / day.windSpeeds.length) * 10) / 10,
    description: getMostFrequent(day.descriptions),
    icon: getMostFrequent(day.icons)
  })).slice(0, 7);
}

function getMostFrequent(arr) {
  const freq = {};
  arr.forEach(item => { freq[item] = (freq[item] || 0) + 1; });
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
}

export function generateDemoWeather(lat, lng) {
  const baseTemp = 28 + (Math.random() * 8 - 4);
  const baseHumidity = 65 + (Math.random() * 20 - 10);
  
  const forecast = [];
  for (let i = 0; i < 7; i++) {
    const dayTemp = baseTemp + (Math.random() * 6 - 3);
    forecast.push({
      date: new Date(Date.now() + i * 86400000),
      tempMin: Math.round((dayTemp - 3) * 10) / 10,
      tempMax: Math.round((dayTemp + 5) * 10) / 10,
      humidity: Math.round(baseHumidity + (Math.random() * 15 - 7)),
      rainfall: Math.round(Math.random() * 15 * 10) / 10,
      windSpeed: Math.round((3 + Math.random() * 8) * 10) / 10,
      description: ['clear sky', 'scattered clouds', 'light rain', 'overcast clouds'][Math.floor(Math.random() * 4)],
      icon: ['01d', '03d', '10d', '04d'][Math.floor(Math.random() * 4)]
    });
  }

  return {
    lat,
    lng,
    locationName: 'Demo Location',
    current: {
      temp: Math.round(baseTemp * 10) / 10,
      humidity: Math.round(baseHumidity),
      pressure: 1013,
      windSpeed: Math.round((5 + Math.random() * 10) * 10) / 10,
      rainfall: Math.round(Math.random() * 10 * 10) / 10,
      description: 'partly cloudy',
      icon: '02d',
      feelsLike: Math.round((baseTemp + 2) * 10) / 10,
      visibility: 10000
    },
    forecast,
    fetchedAt: new Date()
  };
}
