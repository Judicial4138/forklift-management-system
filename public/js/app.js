// DOM Elements
const forkliftCardsContainer = document.getElementById('forklift-cards');
const reservationForm = document.getElementById('reservation-form');
const newReservationBtn = document.getElementById('new-reservation-btn');
const reportForm = document.getElementById('report-form');
const navButtons = document.querySelectorAll('.nav-btn');
const sections = {
    status: document.getElementById('status-section'),
    reservation: document.getElementById('reservation-section'),
    reports: document.getElementById('reports-section')
};

// State
let currentUser = '';
let forklifts = [];
let reservations = [];
let selectedForklift = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize date inputs with current date
    const now = new Date();
    const nowStr = now.toISOString().slice(0, 16);
    document.getElementById('start-date').value = nowStr;
    document.getElementById('end-date').value = nowStr;
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Load initial data
    loadForklifts();
    loadReservations();
    
    // Show status section by default
    showSection('status');
});

// Initialize event listeners
function initializeEventListeners() {
    // Navigation
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const target = e.currentTarget.dataset.target;
            showSection(target);
            
            // Update active state
            navButtons.forEach(btn => btn.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });
    
    // New reservation button
    newReservationBtn?.addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('reservationModal'));
        modal.show();
    });
    
    // Reservation form submission
    reservationForm?.addEventListener('submit', handleReservationSubmit);
    
    // Report generation
    document.getElementById('generate-excel')?.addEventListener('click', generateExcelReport);
    document.getElementById('generate-pdf')?.addEventListener('click', generatePdfReport);
}

// Show a specific section
function showSection(sectionName) {
    Object.values(sections).forEach(section => {
        section?.classList.add('d-none');
    });
    
    if (sections[sectionName]) {
        sections[sectionName].classList.remove('d-none');
    }
}

// Load forklifts from Firestore
function loadForklifts() {
    db.collection(DB_COLLECTIONS.FORKLIFTS).onSnapshot((snapshot) => {
        forklifts = [];
        snapshot.forEach((doc) => {
            forklifts.push({ id: doc.id, ...doc.data() });
        });
        renderForkliftCards();
    });
}

// Load reservations from Firestore
function loadReservations() {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));
    
    db.collection(DB_COLLECTIONS.RESERVATIONS)
        .where('startTime', '>=', startOfDay)
        .where('startTime', '<=', endOfDay)
        .onSnapshot((snapshot) => {
            reservations = [];
            snapshot.forEach((doc) => {
                reservations.push({ id: doc.id, ...doc.data() });
            });
            renderReservationList();
        });
}

// Render forklift cards
function renderForkliftCards() {
    if (!forkliftCardsContainer) return;
    
    forkliftCardsContainer.innerHTML = '';
    
    forklifts.forEach(forklift => {
        const card = document.createElement('div');
        card.className = 'col-12 col-md-6 col-lg-4';
        
        const statusClass = getStatusClass(forklift.status);
        const statusBadgeClass = getStatusBadgeClass(forklift.status);
        
        card.innerHTML = `
            <div class="card h-100 ${statusClass} card-hover">
                <div class="card-body position-relative">
                    <span class="status-badge ${statusBadgeClass}">${forklift.status}</span>
                    <h5 class="card-title">${forklift.id}</h5>
                    ${forklift.currentUser ? 
                        `<p class="card-text"><i class="bi bi-person-fill"></i> ${forklift.currentUser}</p>` : 
                        '<p class="card-text text-muted"><i class="bi bi-person"></i> 未使用</p>'
                    }
                    ${forklift.lastStartTime ? 
                        `<p class="card-text"><small class="text-muted">最終使用: ${formatDateTime(forklift.lastStartTime.toDate())}</small></p>` : 
                        ''
                    }
                    <div class="d-flex flex-wrap mt-3">
                        ${getActionButtons(forklift)}
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners to buttons
        const btnContainer = card.querySelector('.btn-group');
        if (btnContainer) {
            btnContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn')) {
                    handleForkliftAction(e.target.dataset.action, forklift.id);
                }
            });
        }
        
        forkliftCardsContainer.appendChild(card);
    });
}

// Get status class for styling
function getStatusClass(status) {
    switch (status) {
        case FORKLIFT_STATUS.AVAILABLE: return 'status-available';
        case FORKLIFT_STATUS.IN_USE: return 'status-in-use';
        case FORKLIFT_STATUS.MAINTENANCE: return 'status-maintenance';
        default: return '';
    }
}

// Get status badge class
function getStatusBadgeClass(status) {
    switch (status) {
        case FORKLIFT_STATUS.AVAILABLE: return 'status-available-badge';
        case FORKLIFT_STATUS.IN_USE: return 'status-in-use-badge';
        case FORKLIFT_STATUS.MAINTENANCE: return 'status-maintenance-badge';
        default: return '';
    }
}

// Get action buttons based on status
function getActionButtons(forklift) {
    if (forklift.status === FORKLIFT_STATUS.AVAILABLE) {
        return `
            <button class="btn btn-success btn-action" data-action="start">
                <i class="bi bi-play-fill"></i> 使用開始
            </button>
            <button class="btn btn-warning btn-action" data-action="maintenance">
                <i class="bi bi-tools"></i> メンテナンス
            </button>
        `;
    } else if (forklift.status === FORKLIFT_STATUS.IN_USE) {
        return `
            <button class="btn btn-danger btn-action" data-action="end">
                <i class="bi bi-stop-fill"></i> 返却
            </button>
        `;
    } else if (forklift.status === FORKLIFT_STATUS.MAINTENANCE) {
        return `
            <button class="btn btn-success btn-action" data-action="available">
                <i class="bi bi-check-circle"></i> 使用可能
            </button>
        `;
    }
    return '';
}

// Handle forklift actions (start, end, maintenance, etc.)
async function handleForkliftAction(action, forkliftId) {
    const forkliftRef = db.collection(DB_COLLECTIONS.FORKLIFTS).doc(forkliftId);
    const now = new Date();
    
    try {
        switch (action) {
            case 'start':
                const userName = await showUserInputModal();
                if (!userName) return;
                
                await forkliftRef.update({
                    status: FORKLIFT_STATUS.IN_USE,
                    currentUser: userName,
                    lastStartTime: now
                });
                
                // Record usage history
                await db.collection(DB_COLLECTIONS.USAGE_HISTORY).add({
                    forkliftId,
                    userName,
                    actualStartTime: now,
                    actualEndTime: null
                });
                break;
                
            case 'end':
                const doc = await forkliftRef.get();
                const user = doc.data().currentUser;
                
                await forkliftRef.update({
                    status: FORKLIFT_STATUS.AVAILABLE,
                    currentUser: null
                });
                
                // Update usage history
                const historyQuery = await db.collection(DB_COLLECTIONS.USAGE_HISTORY)
                    .where('forkliftId', '==', forkliftId)
                    .where('actualEndTime', '==', null)
                    .limit(1)
                    .get();
                
                if (!historyQuery.empty) {
                    const historyDoc = historyQuery.docs[0];
                    await historyDoc.ref.update({
                        actualEndTime: now
                    });
                }
                break;
                
            case 'maintenance':
                await forkliftRef.update({
                    status: FORKLIFT_STATUS.MAINTENANCE,
                    currentUser: null
                });
                break;
                
            case 'available':
                await forkliftRef.update({
                    status: FORKLIFT_STATUS.AVAILABLE,
                    currentUser: null
                });
                break;
        }
    } catch (error) {
        console.error('Error updating forklift status:', error);
        alert('エラーが発生しました: ' + error.message);
    }
}

// Show user input modal
function showUserInputModal() {
    return new Promise((resolve) => {
        const modal = new bootstrap.Modal(document.getElementById('userInputModal'));
        const form = document.getElementById('user-form');
        
        const onSubmit = (e) => {
            e.preventDefault();
            const userName = document.getElementById('user-name').value.trim();
            if (userName) {
                modal.hide();
                form.removeEventListener('submit', onSubmit);
                resolve(userName);
            }
        };
        
        form.addEventListener('submit', onSubmit);
        
        // Reset form when modal is hidden
        modal._element.addEventListener('hidden.bs.modal', () => {
            form.reset();
            form.removeEventListener('submit', onSubmit);
            resolve(null);
        }, { once: true });
        
        modal.show();
    });
}

// Handle reservation form submission
async function handleReservationSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const reservationData = {
        forkliftId: formData.get('forklift-select'),
        userName: formData.get('user-name'),
        startTime: new Date(formData.get('start-datetime')),
        endTime: new Date(formData.get('end-datetime')),
        destination: formData.get('destination'),
        createdAt: new Date()
    };
    
    // Validate time
    if (reservationData.startTime >= reservationData.endTime) {
        alert('終了日時は開始日時より後に設定してください。');
        return;
    }
    
    try {
        // Check for existing reservations that overlap
        const overlappingReservations = await db.collection(DB_COLLECTIONS.RESERVATIONS)
            .where('forkliftId', '==', reservationData.forkliftId)
            .where('startTime', '<=', reservationData.endTime)
            .where('endTime', '>=', reservationData.startTime)
            .get();
        
        if (!overlappingReservations.empty) {
            alert('選択された時間帯は既に予約が入っています。');
            return;
        }
        
        // Add reservation to Firestore
        await db.collection(DB_COLLECTIONS.RESERVATIONS).add(reservationData);
        
        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('reservationModal'));
        modal.hide();
        form.reset();
        
        alert('予約が完了しました。');
    } catch (error) {
        console.error('Error creating reservation:', error);
        alert('予約中にエラーが発生しました: ' + error.message);
    }
}

// Render reservation list
function renderReservationList() {
    const container = document.getElementById('reservation-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (reservations.length === 0) {
        container.innerHTML = '<div class="text-center text-muted py-3">予約がありません</div>';
        return;
    }
    
    // Sort by start time
    const sortedReservations = [...reservations].sort((a, b) => 
        a.startTime.toDate() - b.startTime.toDate()
    );
    
    sortedReservations.forEach(reservation => {
        const startTime = formatDateTime(reservation.startTime.toDate());
        const endTime = formatTime(reservation.endTime.toDate());
        
        const item = document.createElement('div');
        item.className = 'reservation-item';
        item.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${reservation.forkliftId} - ${reservation.userName}</h6>
                    <p class="mb-1">${startTime} 〜 ${endTime}</p>
                    <p class="mb-0 text-muted">行先: ${reservation.destination}</p>
                </div>
                <button class="btn btn-sm btn-outline-danger" data-id="${reservation.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        
        // Add delete button event
        const deleteBtn = item.querySelector('button');
        deleteBtn.addEventListener('click', () => deleteReservation(reservation.id));
        
        container.appendChild(item);
    });
}

// Delete a reservation
async function deleteReservation(reservationId) {
    if (!confirm('この予約を削除しますか？')) return;
    
    try {
        await db.collection(DB_COLLECTIONS.RESERVATIONS).doc(reservationId).delete();
    } catch (error) {
        console.error('Error deleting reservation:', error);
        alert('予約の削除中にエラーが発生しました: ' + error.message);
    }
}

// Generate Excel report
async function generateExcelReport() {
    // This is a placeholder - you would use a library like exceljs to generate the report
    alert('Excelレポートを生成します。この機能は実装中です。');
}

// Generate PDF report
async function generatePdfReport() {
    // This is a placeholder - you would use a library like jspdf to generate the report
    alert('PDFレポートを生成します。この機能は実装中です。');
}

// Helper function to format date and time
function formatDateTime(date) {
    if (!(date instanceof Date)) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}/${month}/${day} ${hours}:${minutes}`;
}

// Helper function to format time only
function formatTime(date) {
    if (!(date instanceof Date)) return '';
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`;
}
