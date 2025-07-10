import React, { useState } from 'react';
import { Clock, FileText, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import './ResponseViewer.css';

const ResponseViewer = ({ response }) => {
  const { language } = useSettings();
  const [activeTab, setActiveTab] = useState('body');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    if (response && response.data) {
      const headersText = formatHeaders(response.headers);
      const bodyText = response.data;
      const copyText = headersText + '\n\n' + bodyText;
      navigator.clipboard.writeText(copyText).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 1200);
      });
    }
  };

  const formatResponseData = (data) => {
    try {
      // 尝试解析为JSON
      const parsed = JSON.parse(data);
      return JSON.stringify(parsed, null, 2);
    } catch {
      // 如果不是JSON，直接返回原数据
      return data;
    }
  };

  const getStatusColor = (status) => {
    // 确保状态码是数字类型
    const statusNum = parseInt(status, 10);
    if (statusNum === 0) return '#dc3545'; // 错误状态
    if (statusNum >= 200 && statusNum < 300) return '#28a745';
    if (statusNum >= 300 && statusNum < 400) return '#ffc107';
    if (statusNum >= 400 && statusNum < 500) return '#fd7e14';
    if (statusNum >= 500) return '#dc3545';
    return '#6c757d';
  };

  const formatHeaders = (headers) => {
    return Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  };

  return (
    <div className="response-viewer">
      {/* 去掉顶部 response-header 区域 */}

      {/* 无论是否有response都显示标签页 */}
      <div className="response-tabs">
        <div className="tab-container">
          <button 
            className={`tab active`}
            style={{cursor: 'default'}}
          >
            {language === 'zh' ? '响应' : 'Response'}
          </button>
        </div>
        <div className="tab-content">
          <div className="response-body">
            {!response ? (
              <div className="no-response">
                <p>{language === 'zh' ? '点击发送按钮开始请求' : 'Click send button to start request'}</p>
              </div>
            ) : (
              <>
                <div style={{display: 'flex', alignItems: 'center', gap: 24, marginBottom: 8, justifyContent: 'flex-end'}}>
                  <span style={{color: getStatusColor(response.status), fontWeight: 600, fontSize: 15}}>
                    {parseInt(response.status, 10) === 0 ? 'ERROR' : response.status} {response.statusText}
                  </span>
                  <span style={{color: '#888', fontSize: 13}}>{response.time}ms</span>
                  {response.size && (
                    <span style={{color: '#888', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 8}}>
                      {response.size} bytes
                      <button
                        onClick={handleCopy}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#888',
                          cursor: 'pointer',
                          padding: 0,
                          marginLeft: 4,
                          display: 'inline-flex',
                          alignItems: 'center',
                          fontSize: 14
                        }}
                        title={copySuccess ? (language === 'zh' ? '已复制' : 'Copied!') : (language === 'zh' ? '复制响应体' : 'Copy response body')}
                      >
                        <Copy size={16} />
                      </button>
                    </span>
                  )}
                </div>
                <pre className="headers-data" style={{marginBottom: 16, height: 80, maxHeight: 120, overflow: 'auto'}}>{formatHeaders(response.headers)}</pre>
                <pre className="response-data" style={{height: '220px', maxHeight: '320px', overflow: 'auto'}}>
                  {formatResponseData(response.data)}
                </pre>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseViewer; 