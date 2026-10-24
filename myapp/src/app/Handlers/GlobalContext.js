import React, { createContext, useState, useContext } from 'react';

// Create a context
const AppContext = createContext();

// Custom hook to use context
export const useAppContext = () => {
  return useContext(AppContext);
};

// Context provider
export const AppProvider = ({ children }) => {
  const [registeredAccount, setRegisteredAccount] = useState(null);

  return (
    <AppContext.Provider value={{ registeredAccount, setRegisteredAccount }}>
      {children}
    </AppContext.Provider>
  );
};
