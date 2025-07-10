import React from 'react';
import './MethodSelector.css';

const MethodSelector = ({ method, onChange }) => {
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

  return (
    <select 
      className="method-selector"
      value={method}
      onChange={(e) => onChange(e.target.value)}
    >
      {methods.map(m => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>
  );
};

export default MethodSelector; 