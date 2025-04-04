import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message: string;
  statusCode?: number;
}

const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  emailNotifications: z.boolean()
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function Register() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      emailNotifications: true
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await registerUser(data);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data) {
        const errorData = err.response.data as ApiErrorResponse;
        setError(errorData.message || 'Ocorreu um erro ao registrar.');
      } else if (err instanceof Error) {
        setError(err.message || 'Ocorreu um erro ao registrar.');
      } else {
        setError('Ocorreu um erro ao registrar.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-2">
          Crie sua conta
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Ou <Link to="/login" className="text-blue-600 hover:underline">faça login</Link>
        </p>
        
        {error && (
          <div className="mb-4 p-2 bg-red-50 border-l-2 border-red-500 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              id="name"
              type="text"
              placeholder="Nome"
              label="Nome"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              id="email"
              type="email"
              placeholder="E-mail"
              label="E-mail"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              id="password"
              type="password"
              placeholder="Senha"
              label="Senha"
              error={errors.password?.message}
              {...register('password')}
            />
            
            <div className="flex items-center">
              <input
                id="emailNotifications"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                {...register('emailNotifications')}
              />
              <label htmlFor="emailNotifications" className="ml-2 text-sm text-gray-700">
                Receber notificações por e-mail
              </label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-6"
            isLoading={isLoading}
          >
            Registrar
          </Button>
        </form>
      </div>
    </div>
  );
}