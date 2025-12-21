import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DomainDetail from './pages/DomainDetail';
import Progress from './pages/Progress';

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/domain/:domainId" element={<DomainDetail />} />
                    <Route path="/progress" element={<Progress />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
