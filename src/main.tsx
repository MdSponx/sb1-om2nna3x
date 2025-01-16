import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import { FirebaseProvider } from './contexts/firebase';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FirebaseProvider>
      <AuthProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </AuthProvider>
    </FirebaseProvider>
  </StrictMode>
);