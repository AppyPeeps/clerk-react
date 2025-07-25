import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ClerkProvider } from '@appypeeps/clerk-react';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY as string}
      clerkJSUrl={process.env.REACT_APP_CLERK_JS as string}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
);
