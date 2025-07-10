import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import Header from './components/Header';
import RequestBuilder from './components/RequestBuilder';
import History from './components/History';
import Collections from './components/Collections';
import Settings from './components/Settings';
import './App.css';

function App() {
  return (
    <SettingsProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<RequestBuilder />} />
            <Route path="/history" element={<History />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App; 