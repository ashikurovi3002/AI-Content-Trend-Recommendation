import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';

// Placeholder components for other routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="card" style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <h1 className="text-h2 text-muted">{title} Page Coming Soon</h1>
  </div>
);

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sources" element={<Placeholder title="Sources" />} />
          <Route path="/content" element={<Placeholder title="Content" />} />
          <Route path="/recommendations" element={<Placeholder title="Recommendations" />} />
          <Route path="/calendar" element={<Placeholder title="Calendar" />} />
          <Route path="/analytics" element={<Placeholder title="Analytics" />} />
          <Route path="/settings" element={<Placeholder title="Settings" />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
