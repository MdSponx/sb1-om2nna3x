import React, { createContext, useContext } from 'react';
import { app, analytics, db, storage, auth } from '../../lib/firebase';
import { FirebaseContextType } from './types';

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const value: FirebaseContextType = {
    app,
    analytics,
    db,
    storage,
    auth,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}