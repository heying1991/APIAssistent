import React, { useState, useEffect } from 'react';
import { Plus, Folder, FileText, Trash2, Edit, Play, AlertTriangle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';
import Toast from './Toast';
import './Collections.css';

const Collections = () => {
  const { language } = useSettings();
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  
  // 确认删除对话框状态
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(''); // 'collection' 或 'request'
  
  // Toast状态
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = () => {
    const savedCollections = JSON.parse(localStorage.getItem('apiCollections') || '[]');
    setCollections(savedCollections);
  };

  const saveCollections = (newCollections) => {
    localStorage.setItem('apiCollections', JSON.stringify(newCollections));
    setCollections(newCollections);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  const createCollection = () => {
    if (!newCollectionName.trim()) {
      showToast(language === 'zh' ? '请输入集合名称' : 'Please enter collection name', 'warning');
      return;
    }

    const newCollection = {
      id: Date.now(),
      name: newCollectionName,
      description: '',
      requests: [],
      createdAt: new Date().toISOString()
    };

    const newCollections = [...collections, newCollection];
    saveCollections(newCollections);
    setNewCollectionName('');
    setShowNewCollectionModal(false);
    showToast(language === 'zh' ? '集合创建成功' : 'Collection created successfully', 'success');
  };

  // 显示删除确认对话框
  const showDeleteConfirmation = (target, type) => {
    setDeleteTarget(target);
    setDeleteType(type);
    setShowDeleteConfirm(true);
  };

  // 执行删除操作
  const executeDelete = () => {
    if (deleteType === 'collection') {
      const updatedCollections = collections.filter(c => c.id !== deleteTarget.id);
      saveCollections(updatedCollections);
      if (selectedCollection?.id === deleteTarget.id) {
        setSelectedCollection(null);
      }
      showToast(language === 'zh' ? '集合删除成功' : 'Collection deleted successfully', 'success');
    } else if (deleteType === 'request') {
      const updatedCollections = collections.map(collection => {
        if (collection.id === selectedCollection.id) {
          return {
            ...collection,
            requests: collection.requests.filter(r => r.id !== deleteTarget.id)
          };
        }
        return collection;
      });
      saveCollections(updatedCollections);
      setSelectedCollection(updatedCollections.find(c => c.id === selectedCollection.id));
      showToast(language === 'zh' ? '请求删除成功' : 'Request deleted successfully', 'success');
    }
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
    setDeleteType('');
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return '#28a745';
    if (status >= 300 && status < 400) return '#ffc107';
    if (status >= 400 && status < 500) return '#fd7e14';
    if (status >= 500) return '#dc3545';
    return '#6c757d';
  };

  // 统一重试/执行逻辑
  const handleRetryOrExecute = (item) => {
    const retryData = {
      method: item.method,
      url: item.url,
      headers: item.headers || [],
      params: item.params || [],
      body: item.body || '',
      bodyType: item.bodyType || 'json'
    };
    localStorage.setItem('retryRequestData', JSON.stringify(retryData));
    navigate('/');
  };

  // 获取删除确认消息
  const getDeleteMessage = () => {
    if (deleteType === 'collection') {
      return language === 'zh' 
        ? `确定要删除集合 "${deleteTarget?.name}" 吗？此操作将删除集合中的所有请求，且无法恢复。`
        : `Are you sure you want to delete collection "${deleteTarget?.name}"? This will delete all requests in the collection and cannot be undone.`;
    } else if (deleteType === 'request') {
      return language === 'zh'
        ? `确定要从集合中删除请求 "${deleteTarget?.method} ${deleteTarget?.url}" 吗？`
        : `Are you sure you want to delete request "${deleteTarget?.method} ${deleteTarget?.url}" from the collection?`;
    }
    return '';
  };

  return (
    <div className="collections-page">
      <div className="collections-header" style={{display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-start'}}>
        <h2 style={{margin: 0}}>{language === 'zh' ? '集合管理' : 'Collections'}</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowNewCollectionModal(true)}
          style={{minWidth: 64, height: 36, borderRadius: 28, background: '#232323', color: '#00d4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, border: '2px solid #222', boxShadow: 'none', padding: '0 12px', margin: 0, gap: 8}}
        >
          <Plus size={18} />
          {language === 'zh' ? '新建集合' : 'New Collection'}
        </button>
      </div>

      <div className="collections-content">
        <div className="collections-list">
          {collections.length === 0 ? (
            <div className="empty-collections">
              <Folder size={48} />
              <p>{language === 'zh' ? '暂无集合，点击上方按钮创建' : 'No collections, click the button above to create'}</p>
            </div>
          ) : (
            collections.map((collection) => (
              <div 
                key={collection.id}
                className={`collection-item ${selectedCollection?.id === collection.id ? 'selected' : ''}`}
                onClick={() => setSelectedCollection(collection)}
              >
                <div className="collection-header">
                  <Folder size={20} />
                  <div className="collection-info">
                    <h4>{collection.name}</h4>
                    <p>{collection.requests.length} {language === 'zh' ? '个请求' : 'requests'}</p>
                  </div>
                  <button
                    className="btn btn-danger remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      showDeleteConfirmation(collection, 'collection');
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedCollection && (
          <div className="collection-detail">
            <div className="detail-header">
              <h3>{selectedCollection.name}</h3>
              {/* 移除编辑按钮 */}
            </div>

            <div className="requests-list">
              {selectedCollection.requests.length === 0 ? (
                <div className="empty-requests">
                  <FileText size={48} />
                  <p>{language === 'zh' ? '此集合暂无请求' : 'No requests in this collection'}</p>
                </div>
              ) : (
                selectedCollection.requests.map((request) => (
                  <div key={request.id} className="request-item">
                    <div className="request-info">
                      <div 
                        className="method-badge"
                        style={{ backgroundColor: getStatusColor(request.response?.status || 0) }}
                      >
                        {request.method}
                      </div>
                      {/* 新增API名称显示 */}
                      {request.name && (
                        <span className="api-name" style={{color: '#fff', fontWeight: 600, marginRight: 12, fontSize: 15}}>{request.name}</span>
                      )}
                      <div className="request-url">{request.url}</div>
                    </div>
                    <div className="request-actions">
                      <button className="btn btn-primary" onClick={() => handleRetryOrExecute(request)}>
                        <Play size={14} />
                        {language === 'zh' ? '执行' : 'Execute'}
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => showDeleteConfirmation(request, 'request')}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* 新建集合模态框 */}
      {showNewCollectionModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{language === 'zh' ? '新建集合' : 'New Collection'}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowNewCollectionModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <input
                type="text"
                placeholder={language === 'zh' ? '输入集合名称' : 'Enter collection name'}
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createCollection()}
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowNewCollectionModal(false)}
              >
                {language === 'zh' ? '取消' : 'Cancel'}
              </button>
              <button 
                className="btn btn-primary"
                onClick={createCollection}
              >
                {language === 'zh' ? '创建' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title={language === 'zh' ? '确认删除' : 'Confirm Delete'}
          message={getDeleteMessage()}
          onConfirm={executeDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setDeleteTarget(null);
            setDeleteType('');
          }}
          type="danger"
        />
      )}

      {/* Toast提示 */}
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

export default Collections; 