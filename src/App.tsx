import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SetupPage from './components/pages/SetupPage';
import InspectionPage from './components/pages/InspectionPage';
import SummaryPage from './components/pages/SummaryPage';
import Footer from './components/common/Footer';
import Header from './components/common/Header';
import WelcomeSheet from './components/common/WelcomeSheet';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <WelcomeSheet />
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
