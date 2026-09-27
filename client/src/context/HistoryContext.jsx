import React, { createContext, useContext, useState, useEffect } from 'react';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [recentFiles, setRecentFiles] = useState(() => {
    try {
      const saved = localStorage.getItem('cyberpointak_recent_files');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cyberpointak_recent_files', JSON.stringify(recentFiles));
    } catch (e) {
      console.error("Failed to save recent files to localStorage", e);
    }
  }, [recentFiles]);

  const addRecentFile = (item) => {
    const newItem = {
      id: Date.now().toString(),
      name: item.name,
      toolName: item.toolName || "PDF Tool",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      size: item.size || "Processed",
      downloadUrl: item.downloadUrl || null,
      fileData: item.fileData || null, // Blob URL if retained
    };
    setRecentFiles(prev => [newItem, ...prev.slice(0, 19)]); // keep last 20
  };

  const removeRecentFile = (id) => {
    setRecentFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearHistory = () => {
    setRecentFiles([]);
  };

  return (
    <HistoryContext.Provider value={{ recentFiles, addRecentFile, removeRecentFile, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);
