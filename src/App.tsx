import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import InventoryDashboardPage from './pages/InventoryDashboardPage';
import IncomingArticlesPage from './pages/IncomingArticlesPage';
import InventoryOutPage from './pages/InventoryOutPage';
import ReportsPage from './pages/ReportsPage';
import VendorsPage from './pages/VendorsPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorBoundary from './components/ErrorBoundary';
import { useAppContext } from './context/AppContext';

function App() {
  const { isInitialized, isAuthenticated } = useAppContext();

  // Show loading state while context initializes
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-pulse text-neutral-600">Loading...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<InventoryDashboardPage />} />
            <Route path="/incoming" element={<IncomingArticlesPage />} />
            <Route path="/out" element={<InventoryOutPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </ErrorBoundary>
  );
}

export default App