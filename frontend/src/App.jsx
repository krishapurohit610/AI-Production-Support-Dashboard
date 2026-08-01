import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Incidents from './pages/Incidents';
import Reports from './pages/Reports';
import KnowledgeBase from './pages/KnowledgeBase';

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} />
      </Routes>
    </div>
  );
}

export default App;
