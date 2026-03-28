import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LocationWeather from './pages/LocationWeather';
import ManualInput from './pages/ManualInput';
import PredictionResults from './pages/PredictionResults';
import AdvisoryPage from './pages/AdvisoryPage';
import HistoryAnalytics from './pages/HistoryAnalytics';
import RiskMapPage from './pages/RiskMapPage';
import ImageDetection from './pages/ImageDetection';
import ChatbotPage from './pages/ChatbotPage';
import ProfitDashboard from './pages/ProfitDashboard';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/weather" element={<LocationWeather />} />
          <Route path="/input" element={<ManualInput />} />
          <Route path="/prediction" element={<PredictionResults />} />
          <Route path="/advisory" element={<AdvisoryPage />} />
          <Route path="/history" element={<HistoryAnalytics />} />
          <Route path="/risk-map" element={<RiskMapPage />} />
          <Route path="/detect" element={<ImageDetection />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/profit" element={<ProfitDashboard />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
