import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, RotateCcw, MoreVertical, Play } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { getTranslation } from '../locales/translations';
import ConfirmDialog from './ConfirmDialog';
import './History.css';

const History = () => {
  const navigate = useNavigate();
  const { language } = useSettings();
  const [history, setHistory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [listWidth, setListWidth] = useState(600); // 默认列表宽度
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, itemId: null });
  
  // 确认对话框状态
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'warning'
  });

  useEffect(() => {
    loadHistory();
    
    // 点击其他地方关闭右键菜单
    const handleClickOutside = () => {
      setContextMenu({ show: false, x: 0, y: 0, itemId: null });
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const loadHistory = () => {
    const savedHistory = JSON.parse(localStorage.getItem('apiHistory') || '[]');
    setHistory(savedHistory);
  };

  const clearHistory = () => {
    setConfirmDialog({
      isOpen: true,
      title: language === 'zh' ? '确认清空' : 'Confirm Clear',
      message: language === 'zh' ? '确定要清空所有历史记录吗？此操作无法撤销。' : 'Are you sure you want to clear all history? This action cannot be undone.',
      onConfirm: () => {
        localStorage.removeItem('apiHistory');
        setHistory([]);
        setSelectedItem(null);
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null, type: 'warning' });
      },
      type: 'danger'
    });
  };

  const deleteHistoryItem = (itemId) => {
    setConfirmDialog({
      isOpen: true,
      title: language === 'zh' ? '确认删除' : 'Confirm Delete',
      message: language === 'zh' ? '确定要删除这条历史记录吗？' : 'Are you sure you want to delete this history record?',
      onConfirm: () => {
        const updatedHistory = history.filter(item => item.id !== itemId);
        localStorage.setItem('apiHistory', JSON.stringify(updatedHistory));
        setHistory(updatedHistory);
        
        // 如果删除的是当前选中的项目，清空选中状态
        if (selectedItem?.id === itemId) {
          setSelectedItem(null);
        }
        setContextMenu({ show: false, x: 0, y: 0, itemId: null });
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null, type: 'warning' });
      },
      type: 'danger'
    });
  };

  const handleContextMenu = (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      itemId: itemId
    });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US');
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return '#28a745';
    if (status >= 300 && status < 400) return '#ffc107';
    if (status >= 400 && status < 500) return '#fd7e14';
    if (status >= 500) return '#dc3545';
    return '#6c757d';
  };

  const handleRetry = (historyItem) => {
    // 将历史记录数据存储到localStorage，供RequestBuilder使用
    const retryData = {
      method: historyItem.method,
      url: historyItem.url,
      headers: historyItem.headers || [],
      params: historyItem.params || [],
      body: historyItem.body || '',
      bodyType: historyItem.bodyType || 'json'
    };
    
    localStorage.setItem('retryRequestData', JSON.stringify(retryData));
    
    // 跳转到请求构建器页面
    navigate('/');
  };

  // 拉伸开始
  const handleResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Resize start'); // 调试日志
    
    const startX = e.clientX;
    const startWidth = listWidth;
    
    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const newWidth = startWidth + deltaX;
      
      // 限制最小和最大宽度
      const minWidth = 200;
      const maxWidth = 800;
      
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setListWidth(newWidth);
        console.log('New width:', newWidth); // 调试日志
      }
    };

    const handleMouseUp = () => {
      console.log('Resize end'); // 调试日志
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="history-page">
      <div className="history-header" style={{display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-start'}}>
        <h2 style={{margin: 0}}>{language === 'zh' ? '请求历史' : 'Request History'}</h2>
        <button 
          className="btn btn-danger plain-clear-btn"
          onClick={clearHistory}
          style={{minWidth: 64, height: 36, borderRadius: 28, background: '#232323', color: '#ff4d4f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, border: '2px solid #222', boxShadow: 'none', padding: '0 12px', margin: 0, gap: 8}}
          title={language === 'zh' ? '清空全部' : 'Clear All'}
          aria-label={language === 'zh' ? '清空全部' : 'Clear All'}
        >
          <Trash2 size={18} />
          <span style={{color: '#ff4d4f', fontWeight: 600, fontSize: 15}}>{language === 'zh' ? '清空全部' : 'Clear All'}</span>
        </button>
      </div>

      <div className="history-content">
        <div 
          className="history-list"
          style={{ width: `${listWidth}px` }}
        >
          {history.length === 0 ? (
            <div className="empty-history">
              <p>{language === 'zh' ? '暂无历史记录' : 'No history records'}</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id} 
                className={`history-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
                onClick={() => setSelectedItem(item)}
                onContextMenu={(e) => handleContextMenu(e, item.id)}
              >
                <div className="history-item-content">
                  <div className="method-badge" style={{ 
                    backgroundColor: getStatusColor(item.response?.status || 0) 
                  }}>
                    {item.method}
                  </div>
                  <div className="history-url">{item.url}</div>
                  <div className="history-time">{formatTimestamp(item.timestamp)}</div>
                </div>
                <div className="history-item-actions">
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContextMenu(e, item.id);
                    }}
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div 
          className="resize-handle"
          onMouseDown={handleResizeStart}
        />

        {selectedItem && (
          <div className="history-detail">
            <div className="detail-header" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', minHeight: 0, background: '#232323', marginBottom: 12}}>
              <span style={{fontSize: 16, fontWeight: 600, color: '#fff', margin: 0, flex: 1, textAlign: 'left', lineHeight: 1}}>{language === 'zh' ? '请求详情' : 'Request Details'}</span>
              <button 
                className="btn btn-primary"
                onClick={() => handleRetry(selectedItem)}
                title={language === 'zh' ? '执行' : 'Execute'}
                aria-label={language === 'zh' ? '执行' : 'Execute'}
                style={{minWidth: 36, height: 36, borderRadius: 12, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#232323', color: '#00d4ff', padding: 0, margin: 0, boxShadow: 'none', border: 'none', transition: 'background 0.2s'}}
                onMouseOver={e => e.currentTarget.style.background = '#181818'}
                onMouseOut={e => e.currentTarget.style.background = '#232323'}
              >
                <Play size={18} />
              </button>
            </div>

            <div className="detail-content">
              <div className="detail-section">
                <h4>{language === 'zh' ? '请求信息' : 'Request Info'}</h4>
                <div className="detail-item">
                  <strong>{language === 'zh' ? '方法:' : 'Method:'}</strong> {selectedItem.method}
                </div>
                <div className="detail-item">
                  <strong>URL:</strong> {selectedItem.url}
                </div>
                <div className="detail-item">
                  <strong>{language === 'zh' ? '时间:' : 'Time:'}</strong> {formatTimestamp(selectedItem.timestamp)}
                </div>
              </div>

              {selectedItem.headers && selectedItem.headers.length > 0 && (
                <div className="detail-section">
                  <h4>{getTranslation(language, 'headers')}</h4>
                  {selectedItem.headers.map((header, index) => (
                    <div key={index} className="detail-item">
                      <strong>{header.key}:</strong> {header.value}
                    </div>
                  ))}
                </div>
              )}

              {selectedItem.params && selectedItem.params.length > 0 && (
                <div className="detail-section">
                  <h4>{getTranslation(language, 'params')}</h4>
                  {selectedItem.params.map((param, index) => (
                    <div key={index} className="detail-item">
                      <strong>{param.key}:</strong> {param.value}
                    </div>
                  ))}
                </div>
              )}

              {selectedItem.body && (
                <div className="detail-section">
                  <h4>{getTranslation(language, 'body')}</h4>
                  <div className="detail-item">
                    <pre>{selectedItem.body}</pre>
                  </div>
                </div>
              )}

              {selectedItem.response && (
                <div className="detail-section">
                  <h4>{language === 'zh' ? '响应信息' : 'Response Info'}</h4>
                  <div className="detail-item">
                    <strong>{language === 'zh' ? '状态:' : 'Status:'}</strong> {selectedItem.response.status} {selectedItem.response.statusText}
                  </div>
                  <div className="detail-item">
                    <strong>{language === 'zh' ? '响应头:' : 'Response Headers:'}</strong>
                    <pre>{JSON.stringify(selectedItem.response.headers, null, 2)}</pre>
                  </div>
                  <div className="detail-item">
                    <strong>{language === 'zh' ? '响应体:' : 'Response Body:'}</strong>
                    <pre>{selectedItem.response.data}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!selectedItem && (
          <div className="history-detail empty">
            <div className="empty-detail">
            </div>
          </div>
        )}
      </div>

      {/* 右键菜单 */}
      {contextMenu.show && (
        <div 
          className="context-menu"
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="context-menu-item"
            onClick={() => deleteHistoryItem(contextMenu.itemId)}
          >
            <Trash2 size={16} />
            {language === 'zh' ? '删除' : 'Delete'}
          </button>
        </div>
      )}

      {/* 确认对话框 */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null, type: 'warning' })}
        type={confirmDialog.type}
      />
    </div>
  );
};

export default History; 