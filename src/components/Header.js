import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Send, Zap, TestTube, Folder, Cog, Bug, Search, Activity, Shield, CheckCircle, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { getTranslation } from '../locales/translations';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const { language } = useSettings();

  // 使用固定的logo图标
  const getLogoIcon = () => {
    return <Shield className="logo-icon" />;
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          {getLogoIcon()}
          <h1>{getTranslation(language, 'appTitle')}</h1>
        </div>
        
        <nav className="nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <Zap size={18} />
            {getTranslation(language, 'requestBuilder')}
          </Link>
          <Link 
            to="/history" 
            className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
          >
            <Clock size={18} />
            {getTranslation(language, 'history')}
          </Link>
          <Link 
            to="/collections" 
            className={`nav-link ${location.pathname === '/collections' ? 'active' : ''}`}
          >
            <Folder size={18} />
            {getTranslation(language, 'collections')}
          </Link>
          <Link 
            to="/settings" 
            className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
          >
            <Cog size={18} />
            {getTranslation(language, 'settings')}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header; 