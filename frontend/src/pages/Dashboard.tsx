import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { TaskStatus, Task } from '../types/index';
import { taskService } from '../services/task.service';
import { TaskList } from '../components/tasks/TaskList';
import { Button } from '../components/ui/Button';

export function Dashboard() {
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTasks() {
      try {
        const recentResponse = await taskService.getAll({ 
          limit: 5,
          page: 1
        });
        setRecentTasks(recentResponse.data || []);

        const pendingResponse = await taskService.getAll({ 
          status: TaskStatus.PENDING,
          limit: 5,
          page: 1
        });
        setPendingTasks(pendingResponse.data || []);
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Button onClick={() => navigate('/tasks/new')}>
            Nova Tarefa
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Tarefas Recentes</h2>
            {loading ? (
              <p>Carregando...</p>
            ) : recentTasks && recentTasks.length > 0 ? (
              <TaskList tasks={recentTasks} />
            ) : (
              <p className="text-gray-500">Nenhuma tarefa encontrada.</p>
            )}
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/tasks')}
                className="w-full"
              >
                Ver Todas as Tarefas
              </Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Tarefas Pendentes</h2>
            {loading ? (
              <p>Carregando...</p>
            ) : pendingTasks && pendingTasks.length > 0 ? (
              <TaskList tasks={pendingTasks} />
            ) : (
              <p className="text-gray-500">Nenhuma tarefa pendente.</p>
            )}
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/tasks?status=PENDING')}
                className="w-full"
              >
                Ver Todas as Pendentes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}