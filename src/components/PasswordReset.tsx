import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface PasswordResetProps {
  onBack: () => void;
  onSuccess: () => void;
}

const PasswordReset: React.FC<PasswordResetProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [formData, setFormData] = useState({
    email: '',
    resetCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoCode, setDemoCode] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://functions.poehali.dev/df7d3648-ba87-40bc-9323-204a68311ac3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reset_password',
          email: formData.email
        })
      });

      const data = await response.json();

      if (response.ok) {
        setDemoCode(data.demo_code || '');
        setStep('code');
      } else {
        setError(data.error || 'Произошла ошибка');
      }
    } catch (err) {
      console.error('Reset request error:', err);
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://functions.poehali.dev/df7d3648-ba87-40bc-9323-204a68311ac3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'confirm_reset',
          email: formData.email,
          reset_code: formData.resetCode,
          new_password: formData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        setError(data.error || 'Произошла ошибка');
      }
    } catch (err) {
      console.error('Reset confirm error:', err);
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-pink via-lavender to-cream flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-mint to-lavender rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="KeyRound" size={28} className="text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {step === 'email' ? 'Восстановление пароля' : 'Введите код'}
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            {step === 'email' 
              ? 'Введите email для получения кода восстановления'
              : 'Код отправлен на ваш email'
            }
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 'email' ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
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
                    Отправка...
                  </div>
                ) : (
                  'Отправить код'
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleConfirmReset} className="space-y-4">
              {demoCode && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-600">
                    <Icon name="Info" size={16} className="mr-1 inline" />
                    Демо-код: <strong>{demoCode}</strong>
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="resetCode" className="text-sm font-medium text-gray-700">
                  Код восстановления
                </Label>
                <Input
                  id="resetCode"
                  name="resetCode"
                  type="text"
                  value={formData.resetCode}
                  onChange={handleInputChange}
                  placeholder="Введите 6-значный код"
                  className="bg-white/80 border-gray-200 focus:border-mint text-center text-lg tracking-widest"
                  maxLength={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                  Новый пароль
                </Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Минимум 6 символов"
                  className="bg-white/80 border-gray-200 focus:border-mint"
                  minLength={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Подтвердите пароль
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Повторите новый пароль"
                  className="bg-white/80 border-gray-200 focus:border-mint"
                  minLength={6}
                  required
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
                    Сохранение...
                  </div>
                ) : (
                  'Изменить пароль'
                )}
              </Button>
            </form>
          )}

          <div className="text-center pt-4 border-t border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-mint hover:text-mint/80"
            >
              <Icon name="ArrowLeft" size={16} className="mr-1" />
              Назад к входу
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordReset;