import React, { useRef, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import './ParamsTab.css';

const ParamsTab = ({ params, onChange }) => {
  const { language } = useSettings();
  const listRef = useRef(null);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, row: null });

  const addParam = () => {
    onChange([...params, { key: '', value: '', enabled: true }]);
  };

  const updateParam = (index, field, value) => {
    const newParams = [...params];
    newParams[index] = { ...newParams[index], [field]: value };
    onChange(newParams);
  };



  const toggleParam = (index) => {
    const newParams = [...params];
    newParams[index] = { ...newParams[index], enabled: !newParams[index].enabled };
    onChange(newParams);
  };

  // 初始化时直接渲染8行空的参数输入表格
  const rowCount = 10;
  const displayParams = params.length >= rowCount ? params : [
    ...params,
    ...Array(rowCount - params.length).fill({ key: '', value: '', enabled: false })
  ];

  // 移除 handleScroll

  // 新增右键菜单新增行
  const handleContextMenu = (e, row) => {
    e.preventDefault();
    setContextMenu({ show: true, x: e.clientX, y: e.clientY, row });
  };
  const handleAddRow = () => {
    if (params.length < 100) {
      const newParams = [...params, { key: '', value: '', enabled: false }];
      onChange(newParams);
    }
    setContextMenu({ show: false, x: 0, y: 0, row: null });
  };
  const handleCloseMenu = () => setContextMenu({ show: false, x: 0, y: 0, row: null });

  return (
    <div className="params-tab" onClick={handleCloseMenu}>
      {/* 移除参数区域的标题（URL参数） */}
      <div className="params-list" ref={listRef}>
        {displayParams.map((param, index) => (
          <div key={index} className="param-row" onContextMenu={e => handleContextMenu(e, index)}>
            <div className="param-controls">
              <input
                type="checkbox"
                checked={param.enabled}
                onChange={() => toggleParam(index)}
                className="param-checkbox"
                disabled={!param.key}
              />
            </div>
            <input
              type="text"
              className="param-key header-key"
              placeholder={language === 'zh' ? '参数名 (例如: page)' : 'Parameter name (e.g., page)'}
              value={param.key}
              onChange={(e) => updateParam(index, 'key', e.target.value)}
            />
            <input
              type="text"
              className="param-value"
              placeholder={language === 'zh' ? '参数值 (例如: 1)' : 'Parameter value (e.g., 1)'}
              value={param.value}
              onChange={(e) => updateParam(index, 'value', e.target.value)}
            />
          </div>
        ))}
      </div>
      {contextMenu.show && (
        <ul style={{position: 'fixed', top: contextMenu.y, left: contextMenu.x, zIndex: 9999, background: '#232323', color: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0008', padding: 0, margin: 0, listStyle: 'none', minWidth: 120}} onClick={e => e.stopPropagation()}>
          <li style={{padding: '10px 16px', cursor: 'pointer'}} onClick={handleAddRow}>{language === 'zh' ? '新增一行' : 'Add Row'}</li>
        </ul>
      )}
      {/* 移除常用参数 preset-params 模块 */}
    </div>
  );
};

export default ParamsTab; 