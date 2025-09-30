// Firebaseの設定
const firebaseConfig = {
  apiKey: "AIzaSyD5JSk0RYp_RFBwaLyrmuBu095FR66-Muc",
  authDomain: "forklift-management-syst-ff970.firebaseapp.com",
  databaseURL: "https://forklift-management-syst-ff970.firebaseio.com",
  projectId: "forklift-management-syst-ff970",
  storageBucket: "forklift-management-syst-ff970.firebasestorage.app",
  messagingSenderId: "799991848905",
  appId: "1:799991848905:web:bfefc9cc7a4fa900111218",
  measurementId: "G-TQD8CSKQ8P"
};

// 互換性バージョンで初期化（既存のコードと互換性あり）
firebase.initializeApp(firebaseConfig);

// FirestoreとRealtime Databaseの初期化
const db = firebase.firestore();
const realtimeDb = firebase.database();

// コレクション名の定義
const DB_COLLECTIONS = {
    FORKLIFTS: 'forklifts',
    RESERVATIONS: 'reservations',
    USAGE_HISTORY: 'usageHistory',
    USERS: 'users'
};

// フォークリフトのステータス定義
const FORKLIFT_STATUS = {
    AVAILABLE: '配車可能',
    IN_USE: '配車済み',
    MAINTENANCE: 'メンテナンス中'
};

// 行き先の選択肢
const DESTINATIONS = [
    '1・2号岸壁',
    '5・6号岸壁',
    '2PE',
    '3PE',
    '1号ドック',
    '2号ドック',
    '3号ドック'
];
