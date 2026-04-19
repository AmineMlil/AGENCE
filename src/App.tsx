import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Fleet from './pages/Fleet';
import AddMachine from './pages/AddMachine';
import Settings from './pages/Settings';
import AgencyDetails from './pages/AgencyDetails';
import Layout from './components/Layout';
import { useData } from './context/DataContext';

const ProtectedRoute = () => {
  const { currentUser } = useData();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/agency/:id" element={<AgencyDetails />} />
            <Route path="/add-machine" element={<AddMachine />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
