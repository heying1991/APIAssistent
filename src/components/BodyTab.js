import React from 'react';
import { useSettings } from '../context/SettingsContext';
import './BodyTab.css';

const BodyTab = ({ body, bodyType, onChange }) => {
  const { language } = useSettings();

  const handleBodyChange = (newBody) => {
    onChange(newBody, bodyType);
  };

  const handleTypeChange = (newType) => {
    onChange(body, newType);
  };

  const getPlaceholder = () => {
    switch (bodyType) {
      case 'json':
        return `{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}`;
      case 'form':
        return `name=John Doe&email=john@example.com&age=30`;
      case 'xml':
        return `<user>\n  <name>John Doe</name>\n  <email>john@example.com</email>\n  <age>30</age>\n</user>`;
      default:
        return language === 'zh' ? '输入请求体内容...' : 'Enter request body content...';
    }
  };

  return (
    <div className="body-tab">
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <div className="body-type-selector">
          <label>{language === 'zh' ? '类型:' : 'Type:'}</label>
          <select 
            value={bodyType} 
            onChange={(e) => handleTypeChange(e.target.value)}
            className="body-type-select"
          >
            <option value="json">JSON</option>
            <option value="form">Form Data</option>
            <option value="xml">XML</option>
            <option value="text">Text</option>
          </select>
        </div>
      </div>

      <div className="body-content">
        <textarea
          className="body-textarea"
          placeholder={getPlaceholder()}
          value={body}
          onChange={(e) => handleBodyChange(e.target.value)}
          rows={15}
        />
      </div>

      {/* 移除请求体模板 template-buttons 模块 */}
    </div>
  );
};

export default BodyTab; 