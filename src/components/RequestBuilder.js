import React, { useState, useEffect, useRef } from 'react';
import MethodSelector from './MethodSelector';
import UrlInput from './UrlInput';
import HeadersTab from './HeadersTab';
import ParamsTab from './ParamsTab';
import BodyTab from './BodyTab';
import ResponseViewer from './ResponseViewer';
import SaveDialog from './SaveDialog';
import Toast from './Toast';
import { useSettings } from '../context/SettingsContext';
import { getTranslation } from '../locales/translations';

import { Send, Clock, Save } from 'lucide-react';
import './RequestBuilder.css';

const RequestBuilder = () => {
  console.log('RequestBuilder component rendered'); // 调试日志
  const { language, autoSave, theme } = useSettings();
  
  const [request, setRequest] = useState({
    method: 'GET',
    url: '',
    headers: [],
    params: [],
    body: '',
    bodyType: 'json'
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('headers');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [leftWidth, setLeftWidth] = useState(50); // 左侧宽度百分比
  const dragging = useRef(false);

  // 检查是否有重试数据需要加载
  useEffect(() => {
    const retryData = localStorage.getItem('retryRequestData');
    if (retryData) {
      try {
        const parsedData = JSON.parse(retryData);
        setRequest(parsedData);
        // 清除重试数据，避免重复加载
        localStorage.removeItem('retryRequestData');
      } catch (error) {
        console.error('解析重试数据失败:', error);
        localStorage.removeItem('retryRequestData');
      }
    }
  }, []);

  // 拖拽事件
  const handleMouseDown = (e) => {
    dragging.current = true;
    document.body.style.cursor = 'col-resize';
  };
  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    const container = document.querySelector('.main-content');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    let percent = ((e.clientX - rect.left) / rect.width) * 100;
    percent = Math.max(20, Math.min(80, percent)); // 限制最小最大宽度
    setLeftWidth(percent);
  };
  const handleMouseUp = () => {
    dragging.current = false;
    document.body.style.cursor = '';
  };
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });

  const handleSendRequest = async () => {
    console.log('Send request clicked'); // 调试日志
    if (!request.url) {
      showToast(getTranslation(language, 'url'), 'warning');
      return;
    }

    // Colorful 主题蛋糕糖果小马雨效果
    if (theme === 'color') {
      createRainbowRain();
    }

    setLoading(true);
    setResponse(null);
    const startTime = Date.now();

    try {
      // 构建请求配置
      const config = {
        method: request.method,
        url: request.url,
        headers: {},
        timeout: 30000
      };

      // 添加请求头
      request.headers.forEach(header => {
        if (header.enabled && (header.key || header.value)) {
          if (header.key && header.value) {
            config.headers[header.key] = header.value;
          }
          // 如果key和value都为空，则不发送
        }
      });

      // 添加URL参数
      if (request.params.length > 0) {
        const url = new URL(request.url);
        request.params.forEach(param => {
          if (param.enabled && (param.key || param.value)) {
            if (param.key && param.value) {
              url.searchParams.append(param.key, param.value);
            }
            // 如果key和value都为空，则不发送
          }
        });
        config.url = url.toString();
      }

      // 添加请求体
      if (['POST', 'PUT', 'PATCH'].includes(request.method) && request.body) {
        if (request.bodyType === 'json') {
          config.headers['Content-Type'] = 'application/json';
          config.data = request.body;
        } else {
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          config.data = request.body;
        }
      }

      // 发送请求
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: config.data
      });

      const responseData = await response.text();
      const endTime = Date.now();

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        time: endTime - startTime,
        size: responseData.length
      });

      // 自动保存到历史记录
      if (autoSave) {
        const history = JSON.parse(localStorage.getItem('apiHistory') || '[]');
        const historyItem = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...request,
          response: {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            data: responseData,
            time: endTime - startTime,
            size: responseData.length
          }
        };
        
        history.unshift(historyItem);
        if (history.length > 100) {
          history.pop();
        }
        
        localStorage.setItem('apiHistory', JSON.stringify(history));
      }

    } catch (error) {
      console.error('Request failed:', error);
      const endTime = Date.now();
      
      // 设置错误响应信息
      setResponse({
        status: 0,
        statusText: 'Request Failed',
        headers: {},
        data: `Error: ${error.message}\n\nDetails:\n${error.stack || 'No stack trace available'}`,
        time: endTime - startTime,
        size: error.message.length,
        error: true
      });

      // 自动保存错误到历史记录
      if (autoSave) {
        const history = JSON.parse(localStorage.getItem('apiHistory') || '[]');
        const historyItem = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...request,
          response: {
            status: 0,
            statusText: 'Request Failed',
            headers: {},
            data: `Error: ${error.message}\n\nDetails:\n${error.stack || 'No stack trace available'}`,
            time: endTime - startTime,
            size: error.message.length,
            error: true
          }
        };
        
        history.unshift(historyItem);
        if (history.length > 100) {
          history.pop();
        }
        
        localStorage.setItem('apiHistory', JSON.stringify(history));
      }
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = (field, value) => {
    setRequest(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveToCollection = () => {
    if (!request.url) {
      showToast(language === 'zh' ? '请先输入URL' : 'Please enter URL first', 'warning');
      return;
    }
    setShowSaveDialog(true);
  };

  const handleSaveSuccess = () => {
    setToast({
      show: true,
      message: language === 'zh' ? 'API已成功保存到集合中' : 'API successfully saved to collection',
      type: 'success'
    });
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  const addHeader = () => {
    setRequest(prev => ({
      ...prev,
      headers: [...prev.headers, { key: '', value: '', enabled: true }]
    }));
  };

  // 蛋糕糖果小马动画效果
  const createRainbowRain = () => {
    const emojis = ['🍰', '🎂', '🧁', '🍪', '🍭', '🍬', '🍡', '🍩', '🦄', '🐴', '🦓', '🌈'];
    const container = document.querySelector('.request-builder');
    if (!container) return;

    for (let i = 0; i < 25; i++) {
      setTimeout(() => {
        const drop = document.createElement('div');
        drop.style.position = 'fixed';
        drop.style.left = Math.random() * window.innerWidth + 'px';
        drop.style.top = '-40px';
        drop.style.fontSize = Math.random() * 20 + 20 + 'px'; // 20-40px
        drop.style.pointerEvents = 'none';
        drop.style.zIndex = '9999';
        drop.style.animation = 'cakeRain 3s ease-in forwards';
        drop.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
        drop.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        document.body.appendChild(drop);
        
        setTimeout(() => {
          if (drop.parentNode) {
            drop.parentNode.removeChild(drop);
          }
        }, 3000);
      }, i * 80);
    }
  };

  return (
    <div className="request-builder">
      <div className="request-header">
        <div className="request-controls">
          <MethodSelector 
            method={request.method} 
            onChange={(method) => updateRequest('method', method)} 
          />
          <UrlInput 
            url={request.url} 
            onChange={(url) => updateRequest('url', url)}
          />
          <button 
            className="btn btn-primary send-btn"
            onClick={handleSendRequest}
            disabled={loading}
          >
            {loading ? <Clock size={16} /> : <Send size={16} />}
            {loading ? getTranslation(language, 'loading') : getTranslation(language, 'send')}
          </button>
          <button 
            className="btn btn-secondary save-btn"
            onClick={handleSaveToCollection}
            style={{ minWidth: '120px', padding: '10px 20px' }}
          >
            <Save size={16} />
            {language === 'zh' ? '保存' : 'Save'}
          </button>
        </div>
      </div>

      <div className="main-content">
        <div 
          className="request-section resize-handle-bar"
          style={{width: '50%', borderRight: '4px solid var(--border-color)'}}
        >
          {activeTab === 'headers' && (
            null
          )}
          <div className="request-tabs">
            <div className="tab-container">
              <button 
                className={`tab ${activeTab === 'headers' ? 'active' : ''}`}
                onClick={() => setActiveTab('headers')}
              >
                {getTranslation(language, 'headers')}
              </button>
              <button 
                className={`tab ${activeTab === 'params' ? 'active' : ''}`}
                onClick={() => setActiveTab('params')}
              >
                {getTranslation(language, 'params')}
              </button>
              <button 
                className={`tab ${activeTab === 'body' ? 'active' : ''}`}
                onClick={() => setActiveTab('body')}
              >
                {getTranslation(language, 'body')}
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'headers' && (
                <>
                  {/* 移除“Add header”按钮 */}
                  <HeadersTab 
                    headers={request.headers}
                    onChange={(headers) => updateRequest('headers', headers)}
                  />
                </>
              )}
              {activeTab === 'params' && (
                <ParamsTab 
                  params={request.params}
                  onChange={(params) => updateRequest('params', params)}
                />
              )}
              {activeTab === 'body' && (
                <BodyTab 
                  body={request.body}
                  bodyType={request.bodyType}
                  onChange={(body, bodyType) => {
                    updateRequest('body', body);
                    updateRequest('bodyType', bodyType);
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="response-section" style={{width: '50%'}}>
          <ResponseViewer response={response} />
        </div>
      </div>

      <SaveDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveSuccess}
        request={request}
        showToast={showToast}
      />

      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
        duration={4000}
      />
    </div>
  );
};

export default RequestBuilder; 