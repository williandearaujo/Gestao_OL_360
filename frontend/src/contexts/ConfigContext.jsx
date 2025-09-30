import React, { createContext, useContext, useState } from 'react';

const ConfigContext = createContext();

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig deve ser usado dentro de ConfigProvider');
  }
  return context;
};

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    theme: 'light',
    apiUrl: 'http://localhost:8000',
    fallbackMode: true
  });

  const updateConfig = (updates) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const value = {
    config,
    updateConfig,

    // Aliases úteis
    apiUrl: config.apiUrl,
    theme: config.theme,
    fallbackMode: config.fallbackMode
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};
