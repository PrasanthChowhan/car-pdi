import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SetupPage from './components/pages/SetupPage';
import InspectionPage from './components/pages/InspectionPage';
import SummaryPage from './components/pages/SummaryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/inspection" element={<InspectionPage />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="*" element={<Navigate to="/setup" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
