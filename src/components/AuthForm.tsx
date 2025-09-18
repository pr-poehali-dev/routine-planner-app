import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface AuthFormProps {
  onLogin: (user: any, token: string) => void;
}

interface User {
  id: number;
  email: string;
  username: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = 'https://functions.poehali.dev/df7d3648-ba87-40bc-9323-204a68311ac3';
      
      const requestBody = {
        action: isLogin ? 'login' : 'register',
        email: formData.email,
        password: formData.password,
        ...(isLogin ? {} : { username: formData.username })
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.ok) {
        // Сохранение токена в localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Вызов callback с данными пользователя
        onLogin(data.user, data.token);
      } else {
        setError(data.error || 'Произошла ошибка');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ email: '', password: '', username: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-pink via-lavender to-cream flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-mint to-lavender rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="User" size={28} className="text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {isLogin ? 'Добро пожаловать!' : 'Создать аккаунт'}
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            {isLogin ? 'Войдите в свой аккаунт' : 'Присоединяйтесь к планировщику привычек'}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Имя пользователя
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Введите ваше имя"
                  className="bg-white/80 border-gray-200 focus:border-mint"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Введите ваш email"
                className="bg-white/80 border-gray-200 focus:border-mint"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Пароль
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={isLogin ? "Введите пароль" : "Минимум 6 символов"}
                className="bg-white/80 border-gray-200 focus:border-mint"
                required
                minLength={isLogin ? undefined : 6}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600 flex items-center">
                  <Icon name="AlertCircle" size={16} className="mr-2" />
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-mint to-lavender hover:from-mint/90 hover:to-lavender/90 text-white font-medium py-2.5"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  {isLogin ? 'Вход...' : 'Регистрация...'}
                </div>
              ) : (
                isLogin ? 'Войти' : 'Зарегистрироваться'
              )}
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMode}
                className="ml-1 p-0 h-auto font-medium text-mint hover:text-mint/80"
              >
                {isLogin ? 'Зарегистрируйтесь' : 'Войдите'}
              </Button>
            </p>
          </div>

          <div className="bg-cream/50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">
              🔒 Ваши данные надежно защищены
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;