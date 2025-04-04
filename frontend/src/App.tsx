import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { TasksPage } from './pages/TasksPage';
import { TaskForm } from './pages/TaskForm';
import { Notifications } from './pages/Notifications';

import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/tasks/new" element={<TaskForm />} />
                <Route path="/tasks/:id" element={<TaskForm />} />
                <Route path="/notifications" element={<Notifications />} />
              </Route>
            </Routes>
          </Router>
          
          <Toaster position="top-right" />
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;