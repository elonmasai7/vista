import React, { createContext, useState } from 'react';

const AIInsightsContext = createContext();

export const AIInsightsProvider = ({ children }) => {
  const [insights, setInsights] = useState([]);

  const generateInsights = async (data) => {
    // Mock insights generation
    setInsights([{ id: 1, text: "Sample insight" }]);
  };

  return (
    <AIInsightsContext.Provider value={{ insights, generateInsights }}>
      {children}
    </AIInsightsContext.Provider>
  );
};

export const useAIInsights = () => useContext(AIInsightsContext);