import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { firebaseConfig } from './config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

// Initialize collections
exort const DB_COLLECTIONS = {
  FORKLIFTS: 'forklifts',
  RESERVATIONS: 'reservations',
  USAGE_HISTORY: 'usageHistory',
  USERS: 'users'
};

// Initialize default forklifts data
export const DEFAULT_FORKLIFTS = [
  { id: 'F-30', status: 'available', currentUser: '', lastStartTime: null },
  { id: 'F-31', status: 'available', currentUser: '', lastStartTime: null },
  { id: 'F-32', status: 'available', currentUser: '', lastStartTime: null }
];

export { database };
