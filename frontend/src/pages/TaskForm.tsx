import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { taskService } from '../services/task.service';
import { TaskPriority, TaskStatus } from '../types/index';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNotification } from '../contexts/NotificationContext';

interface ApiErrorResponse {
  message: string;
  statusCode?: number;
}

const taskSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority)
});

type TaskFormData = z.infer<typeof taskSchema>;

export function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshNotifications } = useNotification();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!id;

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    }
  });

  const dueDate = watch('dueDate');
  
  const formatDateForStorage = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number);
    
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    
    return date.toISOString();
  };

  const parseDate = (dateString: string | undefined): Date | null => {
    if (!dateString) return null;
    
    const [year, month, day] = dateString.split('-').map(Number);
    
    const date = new Date(year, month - 1, day);
    
    return date;
  };

  useEffect(() => {
    if (isEditing) {
      loadTask();
    }
  }, [id]);

  const loadTask = async () => {
    try {
      setInitialLoading(true);
      const task = await taskService.getById(id as string);
      
      reset({
        ...task,
        dueDate: task.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD') : undefined
      });
    } catch (error) {
      console.error('Erro ao carregar tarefa:', error);
      setError('Não foi possível carregar os dados da tarefa.');
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: TaskFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      const formattedData = {
        ...data,
        dueDate: data.dueDate ? formatDateForStorage(data.dueDate) : undefined
      };
      
      if (isEditing) {
        await taskService.update(id as string, formattedData);
      } else {
        await taskService.create(formattedData);
      }
      
      await refreshNotifications();
      
      navigate('/tasks');
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data) {
        const errorData = err.response.data as ApiErrorResponse;
        setError(errorData.message || 'Ocorreu um erro ao salvar a tarefa.');
      } else if (err instanceof Error) {
        setError(err.message || 'Ocorreu um erro ao salvar a tarefa.');
      } else {
        setError('Ocorreu um erro ao salvar a tarefa.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Layout>
        <div className="container mx-auto">
          <p className="text-center py-8">Carregando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h1>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3"></div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              id="title"
              label="Título"
              error={errors.title?.message}
              {...register('title')}
            />
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                Descrição
              </label>
              <textarea
                id="description"
                className={`w-full px-3 py-2 border ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                rows={4}
                {...register('description')}
              ></textarea>
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="dueDate">
                Data de Vencimento
              </label>
              <div className={`w-full border ${
                errors.dueDate ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus-within:outline-none focus-within:ring-blue-500 focus-within:border-blue-500`}>
              <DatePicker
                id="dueDate"
                selected={dueDate ? parseDate(dueDate) : null}
                onChange={(date: Date | null) => {
                  if (date) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    setValue('dueDate', `${year}-${month}-${day}`);
                  } else {
                    setValue('dueDate', undefined);
                  }
                }}
                dateFormat="dd/MM/yyyy"
                className="w-full px-3 py-2 focus:outline-none"
                placeholderText="DD/MM/YYYY"
              />
              </div>
              {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  className={`w-full px-3 py-2 border ${
                    errors.status ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  {...register('status')}
                >
                  <option value={TaskStatus.PENDING}>Pendente</option>
                  <option value={TaskStatus.IN_PROGRESS}>Em Progresso</option>
                  <option value={TaskStatus.COMPLETED}>Concluída</option>
                  <option value={TaskStatus.CANCELLED}>Cancelada</option>
                </select>
                {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="priority">
                  Prioridade
                </label>
                <select
                  id="priority"
                  className={`w-full px-3 py-2 border ${
                    errors.priority ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  {...register('priority')}
                >
                  <option value={TaskPriority.LOW}>Baixa</option>
                  <option value={TaskPriority.MEDIUM}>Média</option>
                  <option value={TaskPriority.HIGH}>Alta</option>
                </select>
                {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/tasks')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                isLoading={loading}
              >
                {isEditing ? 'Atualizar' : 'Criar'} Tarefa
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}