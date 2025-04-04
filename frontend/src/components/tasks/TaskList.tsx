import { Link } from 'react-router-dom';
import { Task, TaskPriority, TaskStatus } from '../../types/index';
import dayjs from 'dayjs';

interface TaskListProps {
  tasks: Task[];
  onDelete?: (id: string) => void;
}

export function TaskList({ tasks, onDelete }: TaskListProps) {
  const getStatusBadgeClass = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case TaskStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case TaskStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeClass = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return 'bg-green-100 text-green-800';
      case TaskPriority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case TaskPriority.HIGH:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDueDate = (dueDate: string | undefined) => {
    if (!dueDate) return 'Sem prazo';
    return dayjs(dueDate).format('DD/MM/YYYY');
  };

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <li key={task.id}>
            <div className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <Link to={`/tasks/${task.id}`} className="text-sm font-medium text-blue-600 truncate">
                    {task.title}
                  </Link>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(task.status)}`}>
                      {task.status === TaskStatus.PENDING ? 'Pendente' : 
                       task.status === TaskStatus.IN_PROGRESS ? 'Em Progresso' : 
                       task.status === TaskStatus.COMPLETED ? 'Concluída' : 'Cancelada'}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeClass(task.priority)}`}>
                        {task.priority === TaskPriority.LOW ? 'Baixa' : 
                         task.priority === TaskPriority.MEDIUM ? 'Média' : 'Alta'}
                      </span>
                    </div>
                    {task.description && (
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <p className="truncate">{task.description}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Prazo: {formatDueDate(task.dueDate)}</p>
                  </div>
                </div>
                {onDelete && (
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => onDelete(task.id)}
                      className="text-xs text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}