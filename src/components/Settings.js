import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { getTranslation } from '../locales/translations';
import './Settings.css';

const Settings = () => {
  const { language, setLanguage, theme, setTheme, autoSave, setAutoSave } = useSettings();

  const languages = [
    { code: 'zh', name: getTranslation(language, 'chinese'), flag: '🇨🇳' },
    { code: 'en', name: getTranslation(language, 'english'), flag: '🇺🇸' }
  ];

  const themes = [
    { id: 'light', name: getTranslation(language, 'light'), icon: '☀️', description: language === 'zh' ? '明亮清晰的界面' : 'Bright and clear interface' },
    { id: 'dark', name: getTranslation(language, 'dark'), icon: '🌙', description: language === 'zh' ? '护眼的深色界面' : 'Eye-friendly dark interface' },
    { id: 'color', name: language === 'zh' ? '酷炫色彩' : 'Colorful', icon: '🦄', description: language === 'zh' ? '酷炫霓虹色' : 'Cyber neon' },
    { id: 'wuxia', name: getTranslation(language, 'wuxia'), icon: '⚡', description: language === 'zh' ? '极致清冷科技风' : 'Ultra cold tech style' }
  ];

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
  };

  const handleThemeChange = (themeId) => {
    setTheme(themeId);
  };

  const handleAutoSaveChange = (checked) => {
    setAutoSave(checked);
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>{getTranslation(language, 'settings')}</h2>
        <p>{language === 'zh' ? '自定义你的API测试平台体验' : 'Customize your API testing experience'}</p>
      </div>

      <div className="settings-content">
        {/* 语言设置 */}
        <div className="settings-section">
          <div className="section-header">
            <h3>{getTranslation(language, 'language')}</h3>
            <p>{language === 'zh' ? '选择你偏好的界面语言' : 'Choose your preferred interface language'}</p>
          </div>
          
          <div className="language-options">
            {languages.map((lang) => (
              <div
                key={lang.code}
                className={`language-option ${language === lang.code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <div className="language-flag">{lang.flag}</div>
                <div className="language-info">
                  <div className="language-name">{lang.name}</div>
                  <div className="language-code">{lang.code.toUpperCase()}</div>
                </div>
                {language === lang.code && (
                  <div className="language-check">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 主题设置 */}
        <div className="settings-section">
          <div className="section-header">
            <h3>{getTranslation(language, 'theme')}</h3>
            <p>{language === 'zh' ? '选择你喜欢的界面主题' : 'Choose your preferred interface theme'}</p>
          </div>
          
          <div className="theme-options">
            {themes.map((themeOption) => (
              <div
                key={themeOption.id}
                className={`theme-option ${theme === themeOption.id ? 'active' : ''}`}
                onClick={() => handleThemeChange(themeOption.id)}
              >
                <div className="theme-icon">{themeOption.icon}</div>
                <div className="theme-info">
                  <div className="theme-name">{themeOption.name}</div>
                  <div className="theme-description">{themeOption.description}</div>
                </div>
                {theme === themeOption.id && (
                  <div className="theme-check">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 其他设置 */}
        <div className="settings-section">
          <div className="section-header">
            <h3>{language === 'zh' ? '其他设置' : 'Other Settings'}</h3>
            <p>{language === 'zh' ? '更多个性化选项' : 'More customization options'}</p>
          </div>
          
          <div className="other-settings">
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-name">{getTranslation(language, 'autoSave')}</div>
                <div className="setting-description">{language === 'zh' ? '自动保存请求历史' : 'Automatically save request history'}</div>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={autoSave}
                  onChange={(e) => handleAutoSaveChange(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 