import React from 'react';
import { Send, Clock, FileText } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { getTranslation } from '../locales/translations';
import './RequestInfo.css';

const RequestInfo = ({ request, response, loading, error }) => {
  const { language } = useSettings();

  const formatHeaders = (headers) => {
    if (!headers || headers.length === 0) return language === 'zh' ? '无' : 'None';
    return headers
      .filter(header => header.key && header.value)
      .map(header => `${header.key}: ${header.value}`)
      .join('\n');
  };

  const formatParams = (params) => {
    if (!params || params.length === 0) return language === 'zh' ? '无' : 'None';
    return params
      .filter(param => param.key && param.value)
      .map(param => `${param.key}=${param.value}`)
      .join('\n');
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: '#28a745',
      POST: '#007bff',
      PUT: '#ffc107',
      DELETE: '#dc3545',
      PATCH: '#fd7e14',
      HEAD: '#6c757d',
      OPTIONS: '#6c757d'
    };
    return colors[method] || '#6c757d';
  };

  return (
    <div className="request-info">
      <div className="info-header">
        <h3>{language === 'zh' ? '请求信息' : 'Request Info'}</h3>
        <div className="request-status">
          {loading ? (
            <div className="status-loading">
              <Clock size={16} />
              <span>{language === 'zh' ? '发送中...' : 'Sending...'}</span>
            </div>
          ) : error ? (
            <div className="status-error">
              <Send size={16} />
              <span>{language === 'zh' ? '请求失败' : 'Request Failed'}</span>
            </div>
          ) : response ? (
            <div className="status-completed">
              <Send size={16} />
              <span>{language === 'zh' ? '请求完成' : 'Request Completed'}</span>
            </div>
          ) : (
            <div className="status-ready">
              <FileText size={16} />
              <span>{language === 'zh' ? '准备发送' : 'Ready to Send'}</span>
            </div>
          )}
        </div>
      </div>

      <div className="info-content">
        <div className="info-section">
          <h4>{language === 'zh' ? '基本信息' : 'Basic Info'}</h4>
          <div className="info-item">
            <strong>{language === 'zh' ? '方法:' : 'Method:'}</strong>
            <span 
              className="method-badge"
              style={{ backgroundColor: getMethodColor(request.method) }}
            >
              {request.method}
            </span>
          </div>
          <div className="info-item">
            <strong>URL:</strong>
            <span className="url-text">{request.url || (language === 'zh' ? '未设置' : 'Not set')}</span>
          </div>
        </div>

        {request.headers && request.headers.length > 0 && (
          <div className="info-section">
            <h4>{getTranslation(language, 'headers')}</h4>
            <pre className="info-data">{formatHeaders(request.headers)}</pre>
          </div>
        )}

        {request.params && request.params.length > 0 && (
          <div className="info-section">
            <h4>{getTranslation(language, 'params')}</h4>
            <pre className="info-data">{formatParams(request.params)}</pre>
          </div>
        )}

        {request.body && (
          <div className="info-section">
            <h4>{getTranslation(language, 'body')}</h4>
            <pre className="info-data">{request.body}</pre>
          </div>
        )}

        {error && (
          <div className="info-section">
            <h4>{language === 'zh' ? '错误信息' : 'Error Info'}</h4>
            <div className="info-item">
              <strong>{language === 'zh' ? '错误类型:' : 'Error Type:'}</strong>
              <span className="error-type">{error.type}</span>
            </div>
            <div className="info-item">
              <strong>{language === 'zh' ? '错误消息:' : 'Error Message:'}</strong>
              <span className="error-message">{error.message}</span>
            </div>
            {error.details && (
              <div className="info-item">
                <strong>{language === 'zh' ? '详细信息:' : 'Details:'}</strong>
                <pre className="error-details">{error.details}</pre>
              </div>
            )}
          </div>
        )}

        {response && (
          <div className="info-section">
            <h4>{language === 'zh' ? '响应信息' : 'Response Info'}</h4>
            <div className="info-item">
              <strong>{language === 'zh' ? '状态码:' : 'Status Code:'}</strong>
              <span className={`status-code ${response.status >= 200 && response.status < 300 ? 'success' : 'error'}`}>
                {response.status} {response.statusText}
              </span>
            </div>
            <div className="info-item">
              <strong>{language === 'zh' ? '响应时间:' : 'Response Time:'}</strong>
              <span>{response.time}ms</span>
            </div>
            {response.size && (
              <div className="info-item">
                <strong>{language === 'zh' ? '响应大小:' : 'Response Size:'}</strong>
                <span>{response.size} bytes</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestInfo; 