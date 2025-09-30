// ヘルパー関数: ステータスを日本語に変換
function getStatusText(status) {
  switch (status) {
    case 'available':
      return '配車可能';
    case 'in-use':
      return '配車中';
    case 'maintenance':
      return 'メンテナンス中';
    default:
      return status;
  }
}

// ヘルパー関数: 日時をフォーマット
function formatDateTime(date) {
  if (!(date instanceof Date)) {
    return '';
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

// ヘルパー関数: 時間をフォーマット
function formatTime(date) {
  if (!(date instanceof Date)) {
    return '';
  }
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
}

// ヘルパー関数: 日付をフォーマット
function formatDate(date) {
  if (!(date instanceof Date)) {
    return '';
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}${month}${day}`;
}

// ヘルパー関数: フォークリフトごとの色を取得
function getForkliftColor(forkliftId, isBorder = false) {
  const colors = {
    'F-30': isBorder ? '#0d6efd' : '#0d6efd', // 青色
    'F-31': isBorder ? '#198754' : '#198754', // 緑色
    'F-32': isBorder ? '#dc3545' : '#dc3545'  // 赤色
  };
  
  return colors[forkliftId] || (isBorder ? '#6c757d' : '#6c757d');
}

// トースト通知を表示
function showToast(type, message) {
  // 既存のトーストを削除
  const existingToasts = document.querySelectorAll('.toast-container');
  existingToasts.forEach(toast => toast.remove());
  
  // トーストのスタイルを定義
  const toast = document.createElement('div');
  toast.className = `toast-container position-fixed bottom-0 end-0 p-3`;
  toast.style.zIndex = '1100';
  
  // トーストの内容
  const toastContent = document.createElement('div');
  toastContent.className = `toast show`;
  toastContent.role = 'alert';
  toastContent.setAttribute('aria-live', 'assertive');
  toastContent.setAttribute('aria-atomic', 'true');
  
  // ヘッダー
  const toastHeader = document.createElement('div');
  toastHeader.className = 'toast-header';
  
  const toastTitle = document.createElement('strong');
  toastTitle.className = 'me-auto';
  toastTitle.textContent = type === 'success' ? '成功' : 'エラー';
  
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'btn-close';
  closeButton.setAttribute('data-bs-dismiss', 'toast');
  closeButton.setAttribute('aria-label', 'Close');
  
  toastHeader.appendChild(toastTitle);
  toastHeader.appendChild(closeButton);
  
  // ボディ
  const toastBody = document.createElement('div');
  toastBody.className = 'toast-body';
  toastBody.textContent = message;
  
  // スタイルを適用
  if (type === 'success') {
    toastContent.classList.add('bg-success', 'text-white');
  } else {
    toastContent.classList.add('bg-danger', 'text-white');
  }
  
  // 要素を組み立て
  toastContent.appendChild(toastHeader);
  toastContent.appendChild(toastBody);
  toast.appendChild(toastContent);
  
  // ドキュメントに追加
  document.body.appendChild(toast);
  
  // 5秒後に自動的に非表示にする
  setTimeout(() => {
    toast.remove();
  }, 5000);
  
  // 閉じるボタンのイベントリスナー
  closeButton.addEventListener('click', () => {
    toast.remove();
  });
}

// アプリケーションを初期化
document.addEventListener('DOMContentLoaded', () => {
  // Bootstrapのツールチップを有効化
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
  
  // アプリケーションを初期化
  initApp();
});
