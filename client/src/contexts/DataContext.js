import React, { createContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [dataSources, setDataSources] = useState([]);
  const [activeDataset, setActiveDataset] = useState(null);

  return (
    <DataContext.Provider value={{
      dataSources,
      activeDataset,
      loadDataset: (data) => setActiveDataset(data)
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);