import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const ACTION_LABELS = {
  start: '使用開始',
  end: '返却完了',
  maintenance: 'メンテナンス設定'
};

const ACTION_MESSAGES = {
  start: '使用を開始します。お名前を入力してください。',
  end: '返却処理を実行します。よろしいですか？',
  maintenance: 'メンテナンス状態を切り替えます。よろしいですか？'
};

const ForkliftStatusModal = ({ show, onHide, forklift, action, onConfirm }) => {
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (action === 'start' && !userName.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onConfirm(userName);
      setUserName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {forklift?.id} - {ACTION_LABELS[action]}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{ACTION_MESSAGES[action]}</p>
          
          {action === 'start' && (
            <Form.Group className="mb-3">
              <Form.Label>お名前</Form.Label>
              <Form.Control
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="お名前を入力"
                required
                autoFocus
              />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
            キャンセル
          </Button>
          <Button 
            variant={action === 'end' ? 'danger' : 'primary'} 
            type="submit"
            disabled={isSubmitting || (action === 'start' && !userName.trim())}
          >
            {isSubmitting ? '処理中...' : '確定'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ForkliftStatusModal;
