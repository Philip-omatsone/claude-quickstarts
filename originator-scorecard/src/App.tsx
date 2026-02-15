import { Component, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import MetricsPage from './pages/MetricsPage';
import DataEntryPage from './pages/DataEntryPage';
import HeadlinesPage from './pages/HeadlinesPage';
import ComparisonPage from './pages/ComparisonPage';
import CovenantsPage from './pages/CovenantsPage';
import CompanyOverviewPage from './pages/CompanyOverviewPage';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'system-ui' }}>
          <h1 style={{ color: 'red', fontSize: 20 }}>Something went wrong</h1>
          <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, overflow: 'auto', fontSize: 13 }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/metrics" element={<MetricsPage />} />
            <Route path="/data-entry" element={<DataEntryPage />} />
            <Route path="/headlines" element={<HeadlinesPage />} />
            <Route path="/overview" element={<CompanyOverviewPage />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="/covenants" element={<CovenantsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
