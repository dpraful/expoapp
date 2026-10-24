import React from 'react'
const dataset = []
const NotificationContext = React.createContext(dataset)
export const NotificationProvider = NotificationContext.Provider
export default NotificationContext