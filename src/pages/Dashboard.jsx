import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { ref, onValue, update } from 'firebase/database';
import { database, DB_COLLECTIONS } from '../firebase/init';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import ForkliftStatusModal from '../components/ForkliftStatusModal';

const STATUS_COLORS = {
  available: 'success',
  in_use: 'danger',
  maintenance: 'warning'
};

const STATUS_LABELS = {
  available: '配車可能',
  in_use: '配車済み',
  maintenance: 'メンテナンス中'
};

const Dashboard = () => {
  const [forklifts, setForklifts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedForklift, setSelectedForklift] = useState(null);
  const [action, setAction] = useState('');

  // Load forklifts data
  useEffect(() => {
    const forkliftsRef = ref(database, DB_COLLECTIONS.FORKLIFTS);
    
    const unsubscribe = onValue(forkliftsRef, (snapshot) => {
      const data = snapshot.val() || [];
      const forkliftsArray = Object.entries(data).map(([id, value]) => ({
        id,
        ...value
      }));
      setForklifts(forkliftsArray);
    });

    return () => unsubscribe();
  }, []);

  const handleAction = (forklift, actionType) => {
    setSelectedForklift(forklift);
    setAction(actionType);
    setShowModal(true);
  };

  const handleStatusUpdate = async (userName) => {
    try {
      const updates = {};
      const now = new Date().toISOString();
      
      if (action === 'start') {
        updates[`${selectedForklift.id}/status`] = 'in_use';
        updates[`${selectedForklift.id}/currentUser`] = userName;
        updates[`${selectedForklift.id}/lastStartTime`] = now;
        
        // Record usage history
        const historyRef = ref(database, `${DB_COLLECTIONS.USAGE_HISTORY}`);
        const newHistoryRef = push(historyRef);
        set(newHistoryRef, {
          forkliftId: selectedForklift.id,
          userName,
          startTime: now,
          endTime: null
        });
        
        toast.success(`${selectedForklift.id}の使用を開始しました`);
      } else if (action === 'end') {
        updates[`${selectedForklift.id}/status`] = 'available';
        updates[`${selectedForklift.id}/currentUser`] = '';
        
        // Update end time in usage history
        // This would require querying for the latest open record for this forklift
        // and updating its endTime
        
        toast.success(`${selectedForklift.id}を返却しました`);
      } else if (action === 'maintenance') {
        const newStatus = selectedForklift.status === 'maintenance' ? 'available' : 'maintenance';
        updates[`${selectedForklift.id}/status`] = newStatus;
        
        if (newStatus === 'maintenance') {
          updates[`${selectedForklift.id}/currentUser`] = 'メンテナンス';
          toast.info(`${selectedForklift.id}をメンテナンス中に設定しました`);
        } else {
          updates[`${selectedForklift.id}/currentUser`] = '';
          toast.info(`${selectedForklift.id}を配車可能に設定しました`);
        }
      }
      
      await update(ref(database, DB_COLLECTIONS.FORKLIFTS), updates);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('ステータスの更新中にエラーが発生しました');
    }
  };

  const formatLastUsed = (timestamp) => {
    if (!timestamp) return '未使用';
    return format(new Date(timestamp), 'yyyy/MM/dd HH:mm', { locale: ja });
  };

  return (
    <div>
      <h2 className="mb-4">フォークリフト配車状況</h2>
      
      <Row className="g-4">
        {forklifts.map((forklift) => (
          <Col key={forklift.id} md={4}>
            <Card className={`h-100 ${forklift.status === 'in_use' ? 'border-danger' : ''}`}>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{forklift.id}</h5>
                <Badge bg={STATUS_COLORS[forklift.status] || 'secondary'}>
                  {STATUS_LABELS[forklift.status] || forklift.status}
                </Badge>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="text-muted small">現在の使用者</div>
                  <div className="h5">
                    {forklift.currentUser || 'なし'}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-muted small">最終使用日時</div>
                  <div>{formatLastUsed(forklift.lastStartTime)}</div>
                </div>
              </Card.Body>
              <Card.Footer className="d-grid gap-2">
                {forklift.status === 'available' && (
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => handleAction(forklift, 'start')}
                  >
                    使用開始
                  </Button>
                )}
                {forklift.status === 'in_use' && (
                  <Button 
                    variant="success" 
                    size="lg"
                    onClick={() => handleAction(forklift, 'end')}
                  >
                    返却完了
                  </Button>
                )}
                <Button 
                  variant={forklift.status === 'maintenance' ? 'warning' : 'outline-secondary'}
                  onClick={() => handleAction(forklift, 'maintenance')}
                >
                  {forklift.status === 'maintenance' ? 'メンテナンス中' : 'メンテナンスに設定'}
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <ForkliftStatusModal
        show={showModal}
        onHide={() => setShowModal(false)}
        forklift={selectedForklift}
        action={action}
        onConfirm={handleStatusUpdate}
      />
    </div>
  );
};

export default Dashboard;
