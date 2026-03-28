import React, { createContext, useContext, useState, useEffect } from 'react';
import { reverseGeocode } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [location, setLocation] = useState({ lat: 18.52, lng: 73.85, name: 'Pune', state: 'Maharashtra' });
  const [weather, setWeather] = useState(null);
  const [latestPrediction, setLatestPrediction] = useState(null);
  const [latestAdvisory, setLatestAdvisory] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const locData = await reverseGeocode(latitude, longitude);
            setLocation({ lat: latitude, lng: longitude, name: locData.name, state: locData.state });
          } catch {
            setLocation(prev => ({ ...prev, lat: latitude, lng: longitude }));
          }
        },
        () => console.log('Geolocation not available, using default location')
      );
    }
  }, []);

  return (
    <AppContext.Provider value={{
      location, setLocation,
      weather, setWeather,
      latestPrediction, setLatestPrediction,
      latestAdvisory, setLatestAdvisory,
      alerts, setAlerts,
      loading, setLoading,
      darkMode, setDarkMode
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
