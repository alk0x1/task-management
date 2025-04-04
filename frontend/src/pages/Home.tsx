import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-white">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">TaskManager</span>
          
          <div>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="text-gray-700 hover:text-gray-900">
                  Entrar
                </Link>
                <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                  Registrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        <div className="bg-blue-600 text-white py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">
              Task Manager
            </h1>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="px-6 py-2 bg-white text-blue-700 rounded-md hover:bg-blue-50"
              >
                {isAuthenticated ? "Dashboard" : "Começar agora"}
              </Link>
              <Link
                to={isAuthenticated ? "/tasks" : "/login"}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
              >
                {isAuthenticated ? "Minhas tarefas" : "Já tenho conta"}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-500">
        
      </footer>
    </div>
  );
}