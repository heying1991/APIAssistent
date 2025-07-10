import React, { useState, useEffect } from 'react';
import { X, Folder, Plus } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import './SaveDialog.css';

const SaveDialog = ({ isOpen, onClose, onSave, request, showToast }) => {
  const { language } = useSettings();
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [apiName, setApiName] = useState('');
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadCollections();
      generateApiName();
    }
  }, [isOpen, request.url]);

  const loadCollections = () => {
    const savedCollections = JSON.parse(localStorage.getItem('apiCollections') || '[]');
    setCollections(savedCollections);
    if (savedCollections.length > 0) {
      setSelectedCollection(savedCollections[0].id.toString());
    }
  };

  const generateApiName = () => {
    if (!request.url) return;
    
    try {
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/').filter(Boolean);
      const name = pathParts[pathParts.length - 1] || 'API';
      setApiName(name);
    } catch {
      setApiName('API');
    }
  };

  const handleSave = () => {
    if (!apiName.trim()) {
      showToast(language === 'zh' ? '请输入API名称' : 'Please enter API name', 'error');
      return;
    }

    if (showNewCollection) {
      if (!newCollectionName.trim()) {
        showToast(language === 'zh' ? '请输入集合名称' : 'Please enter collection name', 'error');
        return;
      }
      
      // 创建新集合和API
      const newApi = {
        id: Date.now(),
        name: apiName,
        method: request.method,
        url: request.url,
        headers: request.headers,
        params: request.params,
        body: request.body,
        bodyType: request.bodyType,
        createdAt: new Date().toISOString()
      };
      
      const newCollection = {
        id: Date.now(),
        name: newCollectionName,
        requests: [newApi]
      };
      
      const updatedCollections = [...collections, newCollection];
      localStorage.setItem('apiCollections', JSON.stringify(updatedCollections));
    } else {
      // 保存到现有集合
      const updatedCollections = collections.map(collection => {
        if (collection.id.toString() === selectedCollection) {
          const newApi = {
            id: Date.now(),
            name: apiName,
            method: request.method,
            url: request.url,
            headers: request.headers,
            params: request.params,
            body: request.body,
            bodyType: request.bodyType,
            createdAt: new Date().toISOString()
          };
          
          return {
            ...collection,
            requests: [...(collection.requests || []), newApi]
          };
        }
        return collection;
      });
      
      localStorage.setItem('apiCollections', JSON.stringify(updatedCollections));
    }

    onSave();
    onClose();
  };

  const handleCreateNewCollection = () => {
    setShowNewCollection(true);
    setSelectedCollection('');
    setNewCollectionName('');
  };

  const handleBackToExisting = () => {
    setShowNewCollection(false);
    if (collections.length > 0) {
      setSelectedCollection(collections[0].id.toString());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="save-dialog-overlay">
      <div className="save-dialog">
        <div className="save-dialog-header">
          <h3>{language === 'zh' ? '保存API' : 'Save API'}</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="save-dialog-content">
          <div className="form-group">
            <label>{language === 'zh' ? 'API名称' : 'API Name'}</label>
            <input
              type="text"
              value={apiName}
              onChange={(e) => setApiName(e.target.value)}
              placeholder={language === 'zh' ? '输入API名称' : 'Enter API name'}
              className="api-name-input"
            />
          </div>

          {!showNewCollection ? (
            <div className="form-group">
              <label>{language === 'zh' ? '选择集合' : 'Select Collection'}</label>
              {collections.length === 0 ? (
                <div className="no-collections">
                  <p>{language === 'zh' ? '暂无集合' : 'No collections yet'}</p>
                  <button 
                    className="btn btn-primary"
                    onClick={handleCreateNewCollection}
                  >
                    <Plus size={16} />
                    {language === 'zh' ? '创建新集合' : 'Create New Collection'}
                  </button>
                </div>
              ) : (
                <div className="collection-selector">
                  <select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="collection-select"
                  >
                    {collections.map(collection => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name} ({(collection.requests || []).length} APIs)
                      </option>
                    ))}
                  </select>
                  <button 
                    className="btn btn-secondary"
                    onClick={handleCreateNewCollection}
                  >
                    <Plus size={16} />
                    {language === 'zh' ? '新建集合' : 'New Collection'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="form-group">
              <label>{language === 'zh' ? '新集合名称' : 'New Collection Name'}</label>
              <div className="new-collection-input">
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder={language === 'zh' ? '输入集合名称' : 'Enter collection name'}
                  className="collection-name-input"
                />
                <button 
                  className="btn btn-outline"
                  onClick={handleBackToExisting}
                >
                  {language === 'zh' ? '返回' : 'Back'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="save-dialog-actions">
          <button className="btn btn-outline" onClick={onClose}>
            {language === 'zh' ? '取消' : 'Cancel'}
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            {language === 'zh' ? '保存' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveDialog; 