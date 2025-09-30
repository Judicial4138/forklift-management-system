// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'your_api_key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'your_project_id.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'your_project_id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'your_project_id.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'your_messaging_sender_id',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'your_app_id'
};

// 環境変数が正しく設定されているか確認
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(
  varName => !import.meta.env[varName] || import.meta.env[varName].includes('your_')
);

if (missingVars.length > 0) {
  console.error('以下の環境変数が正しく設定されていません:', missingVars.join(', '));
  console.error('プロジェクトのルートに .env ファイルを作成し、Firebaseの設定を追加してください。');
}

export default firebaseConfig;
