import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'zh';
  });
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  
  const [autoSave, setAutoSave] = useState(() => {
    const saved = localStorage.getItem('autoSave');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // 保存设置到localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('autoSave', JSON.stringify(autoSave));
  }, [autoSave]);

  // 应用主题
  const applyTheme = (themeName) => {
    const root = document.documentElement;
    
    // 设置data-theme属性
    root.setAttribute('data-theme', themeName);
    
    // 同时保持向后兼容性，设置CSS变量
    if (themeName === 'dark') {
      root.style.setProperty('--bg-primary', '#0a0a0a');
      root.style.setProperty('--bg-secondary', '#1a1a1a');
      root.style.setProperty('--bg-tertiary', '#262626');
      root.style.setProperty('--bg-quaternary', '#333333');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#cccccc');
      root.style.setProperty('--text-muted', '#666666');
      root.style.setProperty('--border-color', '#333333');
      root.style.setProperty('--border-light', '#404040');
      root.style.setProperty('--accent-color', '#00d4ff');
      root.style.setProperty('--accent-hover', '#00b8e6');
      root.style.setProperty('--accent-light', 'rgba(0, 212, 255, 0.1)');
      root.style.setProperty('--shadow', '0 4px 12px rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--shadow-hover', '0 8px 24px rgba(0, 0, 0, 0.4)');
      root.style.setProperty('--shadow-dark', '0 6px 16px rgba(0, 0, 0, 0.5)');
      root.style.setProperty('--success-color', '#00ff88');
      root.style.setProperty('--success-hover', '#00cc6a');
      root.style.setProperty('--danger-color', '#ff4757');
      root.style.setProperty('--danger-hover', '#ff3742');
      root.style.setProperty('--warning-color', '#ffa502');
      root.style.setProperty('--warning-hover', '#ff9500');
      root.style.setProperty('--info-color', '#3742fa');
      root.style.setProperty('--info-hover', '#2f3542');
      root.style.setProperty('--code-bg', '#1e1e1e');
      root.style.setProperty('--code-border', '#333333');
      root.style.setProperty('--modal-overlay', 'rgba(0, 0, 0, 0.7)');
      root.style.setProperty('--scrollbar-thumb', '#555555');
      root.style.setProperty('--scrollbar-track', '#2a2a2a');
    } else if (themeName === 'color') {
      root.style.setProperty('--bg-primary', '#18122B');
      root.style.setProperty('--bg-secondary', '#1a1536');
      root.style.setProperty('--bg-tertiary', '#221a3a');
      root.style.setProperty('--bg-quaternary', '#2d2150');
      root.style.setProperty('--text-primary', '#c084fc');
      root.style.setProperty('--text-secondary', '#a3a3ff');
      root.style.setProperty('--text-muted', '#7a7aff');
      // 线条用低调深色
      root.style.setProperty('--border-color', '#23244a');
      root.style.setProperty('--border-light', '#23244a');
      root.style.setProperty('--accent-color', '#a259ff');
      root.style.setProperty('--accent-hover', '#ff00cc');
      root.style.setProperty('--accent-light', 'rgba(162,89,255,0.18)');
      // 取消发光
      root.style.setProperty('--shadow', 'none');
      root.style.setProperty('--shadow-hover', 'none');
      root.style.setProperty('--shadow-dark', 'none');
      root.style.setProperty('--success-color', '#39ff14');
      root.style.setProperty('--success-hover', '#00ffb8');
      root.style.setProperty('--danger-color', '#ff00cc');
      root.style.setProperty('--danger-hover', '#ff2d95');
      root.style.setProperty('--warning-color', '#ffe156');
      root.style.setProperty('--warning-hover', '#ffd700');
      root.style.setProperty('--info-color', '#00fff7');
      root.style.setProperty('--info-hover', '#ff00cc');
      root.style.setProperty('--code-bg', '#1a1536');
      root.style.setProperty('--code-border', '#23244a');
      root.style.setProperty('--modal-overlay', 'rgba(0,0,0,0.85)');
      root.style.setProperty('--scrollbar-thumb', '#a259ff');
      root.style.setProperty('--scrollbar-track', '#221a3a');
      // 酷炫渐变背景
      root.style.setProperty('--cyber-gradient', 'linear-gradient(90deg, #00fff7 0%, #ff00cc 100%)');
    } else if (themeName === 'wuxia') {
      // 科技风主题 - 极致清冷
      root.style.setProperty('--bg-primary', '#050a14');
      root.style.setProperty('--bg-secondary', '#0f1a2e');
      root.style.setProperty('--bg-tertiary', '#1a2a42');
      root.style.setProperty('--bg-quaternary', '#253a56');
      root.style.setProperty('--text-primary', '#cce7ff');
      root.style.setProperty('--text-secondary', '#99c2e6');
      root.style.setProperty('--text-muted', '#6680a3');
      root.style.setProperty('--border-color', '#1e3a5f');
      root.style.setProperty('--border-light', '#2d4a73');
      root.style.setProperty('--accent-color', '#00d4ff');
      root.style.setProperty('--accent-hover', '#00b8e6');
      root.style.setProperty('--accent-light', 'rgba(0,212,255,0.12)');
      root.style.setProperty('--shadow', '0 4px 12px rgba(30,58,95,0.4)');
      root.style.setProperty('--shadow-hover', '0 8px 24px rgba(30,58,95,0.5)');
      root.style.setProperty('--shadow-dark', '0 6px 16px rgba(30,58,95,0.6)');
      root.style.setProperty('--success-color', '#00e6cc');
      root.style.setProperty('--success-hover', '#00b8a3');
      root.style.setProperty('--danger-color', '#ff4d6d');
      root.style.setProperty('--danger-hover', '#ff3352');
      root.style.setProperty('--warning-color', '#00d4ff');
      root.style.setProperty('--warning-hover', '#00b8e6');
      root.style.setProperty('--info-color', '#80d4ff');
      root.style.setProperty('--info-hover', '#00d4ff');
      root.style.setProperty('--code-bg', '#0f1a2e');
      root.style.setProperty('--code-border', '#1e3a5f');
      root.style.setProperty('--modal-overlay', 'rgba(5,10,20,0.85)');
      root.style.setProperty('--scrollbar-thumb', '#00d4ff');
      root.style.setProperty('--scrollbar-track', '#1a2a42');
      // 极致清冷科技渐变背景
      root.style.setProperty('--wuxia-gradient', 'linear-gradient(135deg, #cce7ff 0%, #00d4ff 50%, #001a33 100%)');
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8f9fa');
      root.style.setProperty('--bg-tertiary', '#ffffff');
      root.style.setProperty('--bg-quaternary', '#f1f3f4');
      root.style.setProperty('--text-primary', '#333333');
      root.style.setProperty('--text-secondary', '#666666');
      root.style.setProperty('--text-muted', '#999999');
      root.style.setProperty('--border-color', '#e9ecef');
      root.style.setProperty('--border-light', '#f0f0f0');
      root.style.setProperty('--accent-color', '#007bff');
      root.style.setProperty('--accent-hover', '#0056b3');
      root.style.setProperty('--accent-light', 'rgba(0, 123, 255, 0.1)');
      root.style.setProperty('--shadow', '0 2px 8px rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--shadow-hover', '0 4px 16px rgba(0, 0, 0, 0.15)');
      root.style.setProperty('--shadow-dark', '0 4px 12px rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--success-color', '#28a745');
      root.style.setProperty('--success-hover', '#1e7e34');
      root.style.setProperty('--danger-color', '#dc3545');
      root.style.setProperty('--danger-hover', '#c82333');
      root.style.setProperty('--warning-color', '#ffc107');
      root.style.setProperty('--warning-hover', '#e0a800');
      root.style.setProperty('--info-color', '#17a2b8');
      root.style.setProperty('--info-hover', '#138496');
      root.style.setProperty('--code-bg', '#f8f9fa');
      root.style.setProperty('--code-border', '#e9ecef');
      root.style.setProperty('--modal-overlay', 'rgba(0, 0, 0, 0.5)');
      root.style.setProperty('--scrollbar-thumb', '#c1c1c1');
      root.style.setProperty('--scrollbar-track', '#f1f1f1');
    }
  };

  const value = {
    language,
    setLanguage,
    theme,
    setTheme,
    autoSave,
    setAutoSave
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}; 