# フォークリフト配車アプリ

リアルタイムでフォークリフトの配車状況を管理するWebアプリケーションです。

## 機能

- フォークリフトのリアルタイムステータス表示
- 車両予約機能（ガントチャート表示）
- 作業計画書出力（Excel/PDF）
- モバイル対応（iPhone最適化）

## セットアップ

1. リポジトリをクローン
```bash
git clone <repository-url>
cd forklift-management-system
```

2. 依存パッケージをインストール
```bash
npm install
```

3. 環境変数を設定
`.env` ファイルを作成し、Firebaseの設定を追加します。

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

4. 開発サーバーを起動
```bash
npm run dev
```

5. 本番ビルド
```bash
npm run build
```

## デプロイ

このアプリはRender.comにデプロイするように設定されています。`render.yaml`ファイルが含まれており、GitHubリポジトリと連携することで自動デプロイが可能です。

## ライセンス

MIT
