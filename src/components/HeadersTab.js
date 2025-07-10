import React, { useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import './HeadersTab.css';

const HeadersTab = ({ headers, onChange }) => {
  const { language } = useSettings();
  const listRef = useRef(null);
  // 移除 contextMenu 相关 state

  const updateHeader = (index, field, value) => {
    const newHeaders = [...headers];
    // 确保数组长度足够
    while (newHeaders.length <= index) {
      // 只在新增空行时用 defaultHeaders 补齐，否则用空对象
      newHeaders.push(defaultHeaders[newHeaders.length] ? { ...defaultHeaders[newHeaders.length] } : { key: '', value: '', enabled: false });
    }
    
    // 只更新指定字段，不影响其他字段
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    onChange(newHeaders);
  };



  const toggleHeader = (index) => {
    const newHeaders = [...headers];
    // 确保数组长度足够
    while (newHeaders.length <= index) {
      // 只在新增空行时用 defaultHeaders 补齐，否则用空对象
      newHeaders.push(defaultHeaders[newHeaders.length] ? { ...defaultHeaders[newHeaders.length] } : { key: '', value: '', enabled: false });
    }
    
    // 只切换 enabled，不重置其他内容
    newHeaders[index] = { ...newHeaders[index], enabled: !newHeaders[index].enabled };
    onChange(newHeaders);
  };

  // 确保headers至少有8行，不足时用默认值填充
  const rowCount = 10;
  const userAgent = typeof window !== 'undefined' && window.navigator ? window.navigator.userAgent : '';
  const defaultHeaders = [
    { key: 'Content-Type', value: 'application/json', enabled: true },
    { key: 'Accept', value: '*/*', enabled: false },
    { key: 'User-Agent', value: userAgent, enabled: false },
    { key: 'Accept-Encoding', value: 'gzip, deflate, br', enabled: false },
    { key: 'Connection', value: 'keep-alive', enabled: false },
    { key: 'Origin', value: 'https://mock.postman.com', enabled: false },
    { key: 'Host', value: '<calculated when request is sent>', enabled: false },
    { key: 'Content-Length', value: '<calculated when request is sent>', enabled: false }
  ];

  let displayHeaders = [];
  const minRows = 10;
  for (let i = 0; i < minRows; i++) {
    if (i < headers.length) {
      displayHeaders.push(headers[i]);
    } else if (defaultHeaders[i]) {
      displayHeaders.push({ ...defaultHeaders[i] });
    } else {
      displayHeaders.push({ key: '', value: '', enabled: false });
    }
  }

  // 移除 handleContextMenu、handleAddRow、handleCloseMenu

  return (
    <div className="headers-tab" onClick={() => {}}>
      <div className="headers-list" ref={listRef} style={{marginTop: 0, paddingTop: 0}}>
        {/* 移除Key/Value表头 */}
        {displayHeaders.map((header, index) => (
          <div key={index} className="header-row" style={{minHeight: 32, alignItems: 'center', borderBottom: '1px solid #eee', padding: 0, margin: 0}}>
            <div className="header-controls" style={{width: 40, minWidth: 40, padding: 0, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <input
                type="checkbox"
                checked={header.enabled}
                onChange={() => toggleHeader(index)}
                className="header-checkbox"
                style={{margin: 0, width: 16, height: 16}}
              />
            </div>
            <input
              type="text"
              className="header-key"
              value={header.key}
              onChange={(e) => updateHeader(index, 'key', e.target.value)}
              style={{fontSize: 13, height: 28, padding: '0 6px', border: 'none', outline: 'none', background: 'none', minWidth: 120}}
              placeholder={header.key ? '' : (language === 'zh' ? '请求头名称 (例如: Content-Type)' : 'Header name (e.g., Content-Type)')}
            />
            <input
              type="text"
              className="header-value"
              value={header.value}
              onChange={(e) => updateHeader(index, 'value', e.target.value)}
              style={{fontSize: 13, height: 28, padding: '0 6px', border: 'none', outline: 'none', background: 'none', minWidth: 180}}
              placeholder={header.value ? '' : (language === 'zh' ? '请求头值 (例如: application/json)' : 'Header value (e.g., application/json)')}
            />
          </div>
        ))}
      </div>
      {/* 移除右键菜单渲染部分 */}
    </div>
  );
};

export default HeadersTab; 