import React from 'react';
import { useSettings } from '../context/SettingsContext';
import './UrlInput.css';

const UrlInput = ({ url, onChange }) => {
  const { language } = useSettings();

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault(); // 阻止默认的Tab行为
      onChange('http://127.0.0.1:80');
    }
  };

  return (
    <div className="url-input-container">
      <input
        type="text"
        className="url-input"
        placeholder={language === 'zh' ? '输入请求URL (例如: https://127.0.0.1:8080)' : 'Enter request URL (e.g., https://127.0.0.1:8080)'}
        value={url}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default UrlInput; 