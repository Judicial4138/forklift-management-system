import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Dashboard from './pages/Dashboard';
import Reservations from './pages/Reservations';
import Reports from './pages/Reports';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="App min-vh-100 d-flex flex-column">
        <Navigation />
        <Container className="py-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Container>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
