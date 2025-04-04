import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { taskService } from '../services/task.service';
import { TaskStatus } from '../types/index';

interface Notification {
  id: string;
  message: string;
  dueDate: string;
  taskId: string;
}

interface NotificationContextData {
  notifications: Notification[];
  notificationCount: number;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const checkUpcomingTasks = async () => {
    try {
      const response = await taskService.getAll({});
      const tasks = response.data || [];
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
      
      const upcomingTasks = tasks.filter(task => {
        if (task.status === TaskStatus.COMPLETED || !task.dueDate) return false;
        
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        return dueDate >= today && dueDate < dayAfterTomorrow;
      });
      
      const newNotifications: Notification[] = [];
      
      for (const task of upcomingTasks) {
        const dueDate = new Date(task.dueDate as string);
        dueDate.setHours(0, 0, 0, 0);
        
        const dueDateStr = dueDate.toISOString().split('T')[0];
        const todayStr = today.toISOString().split('T')[0];
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        
        let message = '';
        
        if (dueDateStr === todayStr) {
          message = `A tarefa "${task.title}" vence hoje`;
        } 
        else if (dueDateStr === tomorrowStr) {
          message = `A tarefa "${task.title}" vence amanhã`;
        }
        
        if (message) {
          newNotifications.push({
            id: task.id,
            taskId: task.id,
            message: message,
            dueDate: task.dueDate as string
          });
        }
      }
      
      setNotifications(newNotifications);
    } catch (error) {
      console.error('Erro ao verificar tarefas próximas:', error);
    }
  };

  useEffect(() => {
    checkUpcomingTasks();
    
    const intervalId = setInterval(checkUpcomingTasks, 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      notificationCount: notifications.length,
      refreshNotifications: checkUpcomingTasks
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}