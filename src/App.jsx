import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DomainDetail from './pages/DomainDetail';
import Progress from './pages/Progress';
import HabitTracker from './pages/HabitTracker';
import Settings from './pages/Settings';
import CalendarPage from './pages/CalendarPage';
import LocalDataPrompt from './components/LocalDataPrompt';
import { useAutoSync } from './hooks/useAutoSync';

// Component to enable auto-sync within AuthProvider context
function AutoSyncWrapper({ children }) {
    useAutoSync();
    return children;
}

function App() {
    return (
        <AuthProvider>
            <AutoSyncWrapper>
                <BrowserRouter>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/calendar" element={<CalendarPage />} />
                            <Route path="/domain/:domainId" element={<DomainDetail />} />
                            <Route path="/progress" element={<Progress />} />
                            <Route path="/habit-tracker" element={<HabitTracker />} />
                            <Route path="/settings" element={<Settings />} />
                        </Routes>
                    </Layout>
                    {/* Show backup prompt after login if local data exists */}
                    <LocalDataPrompt />
                </BrowserRouter>
            </AutoSyncWrapper>
        </AuthProvider>
    );
}

export default App;


