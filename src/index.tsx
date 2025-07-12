import React from 'react';
import ReactDOM from 'react-d@/client';
import App from @/App';
import { AppProvider } from @/contex@/AppContext';
import { HashRouter } from 'react-router-dom';
import @/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <AppProvider>
        <Ap@/>
     @/AppProvider>
   @/HashRouter>
 @/React.StrictMode>
);
