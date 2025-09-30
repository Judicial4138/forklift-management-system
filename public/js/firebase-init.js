// Firebaseの初期化
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  addDoc
} from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';

// Firebaseの設定をインポート
import firebaseConfig from '/firebase-config.js';

// Firebaseを初期化
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// エクスポートする関数
export {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  addDoc
};
