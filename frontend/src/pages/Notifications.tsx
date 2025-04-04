import { Layout } from '../components/layout/Layout';
import { useNotification } from '../contexts/NotificationContext';

export function Notifications() {
  const { notifications } = useNotification();
  
  console.log('Rendering notifications:', notifications);

  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    
    if (dueDate.getTime() === today.getTime()) {
      return 'Hoje';
    } else if (dueDate.getTime() === tomorrow.getTime()) {
      return 'Amanhã';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="mb-6">	
          <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
          <p className="text-sm text-gray-500">Tarefas com vencimento próximo</p>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          {notifications.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {notifications.map(notification => (
                <li key={notification.id} className="p-4 hover:bg-gray-50">
                  <p className="text-sm">{notification.message}</p>
                  <span className="text-xs text-gray-500 mt-1 block">
                    Vence em: {formatDueDate(notification.dueDate)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-center text-gray-500">Não há tarefas com vencimento próximo.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}