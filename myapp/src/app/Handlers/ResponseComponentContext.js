import React, { createContext, useContext, useState } from 'react';

// Creating a context with default values
const ResponseComponentContext = createContext({
    responseJSON: {
        "consultation": [],
        "consultationEdit": {},
    },
    setResponseJSON: () => { },  // Default setter (to be updated by provider)
});

// Creating the provider component
export const ResponseComponentProvider = ({ children }) => {
    const [responseJSON, setResponseJSON] = useState({
        "consultation": [],
        "consultationEdit": {},
    });
    const [dashData, setDashData] = useState();

    return (
        <ResponseComponentContext.Provider value={{ responseJSON, setResponseJSON, dashData, setDashData }}>
            {children}
        </ResponseComponentContext.Provider>
    );
};
// Custom Hook for Using Context (Optional)
export const useDataContext = () => {
    return useContext(ResponseComponentContext);
};
export default ResponseComponentContext;


