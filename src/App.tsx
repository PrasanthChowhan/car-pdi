import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SetupPage from './components/pages/SetupPage';
import InspectionPage from './components/pages/InspectionPage';
import SummaryPage from './components/pages/SummaryPage';
import Footer from './components/common/Footer';
import Header from './components/common/Header';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useInspectionStore } from './store/useInspectionStore';

function App() {
  const storageError = useInspectionStore((state) => state.storageError);
  const setStorageError = useInspectionStore((state) => state.setStorageError);

  return (
    <ErrorBoundary>
      <Router>
        <div className="app-layout">
          <Header />
          {storageError === 'quota_exceeded' && (
            <div style={{
              backgroundColor: 'var(--color-semantic-error, #cf2d56)',
              color: 'white',
              padding: '10px 20px',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              animation: 'slideDown 0.3s ease'
            }}>
              <span>⚠️ Browser storage space is full! Inspection progress cannot be saved. Please export your PDF/ZIP and reset data.</span>
              <button 
                onClick={() => setStorageError(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '4px'
                }}
              >
                ✕
              </button>
            </div>
          )}
          {storageError === 'unknown' && (
            <div style={{
              backgroundColor: 'var(--color-semantic-error, #cf2d56)',
              color: 'white',
              padding: '10px 20px',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              animation: 'slideDown 0.3s ease'
            }}>
              <span>⚠️ Database error encountered while saving progress. Please reload the page.</span>
              <button 
                onClick={() => setStorageError(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '4px'
                }}
              >
                ✕
              </button>
            </div>
          )}
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/setup" element={<SetupPage />} />
              <Route path="/inspection" element={<InspectionPage />} />
              <Route path="/summary" element={<SummaryPage />} />
              <Route path="*" element={<Navigate to="/setup" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
