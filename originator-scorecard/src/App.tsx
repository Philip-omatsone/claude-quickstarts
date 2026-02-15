import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import MetricsPage from './pages/MetricsPage';
import DataEntryPage from './pages/DataEntryPage';
import HeadlinesPage from './pages/HeadlinesPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/metrics" element={<MetricsPage />} />
          <Route path="/data-entry" element={<DataEntryPage />} />
          <Route path="/headlines" element={<HeadlinesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
