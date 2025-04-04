import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { TaskList } from '../components/tasks/TaskList';
import { TaskFilter, TasksResponse, TaskStatus, TaskPriority } from '../types/index';
import { taskService } from '../services/task.service';

export function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasksData, setTasksData] = useState<TasksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskFilter>({
    page: 1,
    limit: 10,
    status: searchParams.get('status') as TaskStatus || undefined,
    priority: searchParams.get('priority') as TaskPriority || undefined,
    search: searchParams.get('search') || undefined,
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAll(filter);
      setTasksData(response);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter: Partial<TaskFilter>) => {
    const updatedFilter = { ...filter, ...newFilter, page: 1 };
    setFilter(updatedFilter);
    
    const params = new URLSearchParams();
    Object.entries(updatedFilter).forEach(([key, value]) => {
      if (value !== undefined) {
        params.set(key, String(value));
      }
    });
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    setFilter({ ...filter, page });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await taskService.delete(id);
        loadTasks();
      } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tarefas</h1>
          <Button onClick={() => navigate('/tasks/new')}>
            Nova Tarefa
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Busca</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                placeholder="Buscar tarefas"
                value={filter.search || ''}
                onChange={(e) => handleFilterChange({ search: e.target.value || undefined })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                value={filter.status || ''}
                onChange={(e) => handleFilterChange({ status: e.target.value as TaskStatus || undefined })}
              >
                <option value="">Todos</option>
                <option value={TaskStatus.PENDING}>Pendente</option>
                <option value={TaskStatus.IN_PROGRESS}>Em Progresso</option>
                <option value={TaskStatus.COMPLETED}>Concluída</option>
                <option value={TaskStatus.CANCELLED}>Cancelada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
              <select
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                value={filter.priority || ''}
                onChange={(e) => handleFilterChange({ priority: e.target.value as TaskPriority || undefined })}
              >
                <option value="">Todas</option>
                <option value={TaskPriority.LOW}>Baixa</option>
                <option value={TaskPriority.MEDIUM}>Média</option>
                <option value={TaskPriority.HIGH}>Alta</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => handleFilterChange({
                  search: undefined,
                  status: undefined,
                  priority: undefined,
                  dueDateFrom: undefined,
                  dueDateTo: undefined,
                })}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          {loading ? (
            <p className="text-center py-8">Carregando...</p>
          ) : tasksData && tasksData.data && tasksData.data.length ? (
            <>
              <TaskList tasks={tasksData.data} onDelete={handleDelete} />
              {tasksData.meta.lastPage > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{(tasksData.meta.page - 1) * filter.limit! + 1}</span> a <span className="font-medium">
                        {Math.min(tasksData.meta.page * filter.limit!, tasksData.meta.total)}
                      </span> de <span className="font-medium">{tasksData.meta.total}</span> resultados
                    </p>
                  </div>
                  <nav className="flex items-center">
                    <button
                      onClick={() => handlePageChange(tasksData.meta.page - 1)}
                      disabled={tasksData.meta.page === 1}
                      className="relative inline-flex items-center px-2 py-2 mr-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <span className="relative z-0 inline-flex shadow-sm">
                      {Array.from({ length: tasksData.meta.lastPage }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                            i + 1 === tasksData.meta.page
                              ? 'z-10 bg-blue-600 text-white border-blue-600'
                              : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                          } border`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </span>
                    <button
                      onClick={() => handlePageChange(tasksData.meta.page + 1)}
                      disabled={tasksData.meta.page === tasksData.meta.lastPage}
                      className="relative inline-flex items-center px-2 py-2 ml-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Próxima
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <p className="text-center py-8 text-gray-500">Nenhuma tarefa encontrada.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}