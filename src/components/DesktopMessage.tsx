import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const DesktopMessage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-pink via-lavender to-mint p-8">
      <Card className="max-w-md w-full bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <Icon name="Smartphone" size={64} className="mx-auto text-lavender-dark mb-4" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            📱 Работаю только на телефончиках
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Планировщик рутины создан специально для мобильных устройств. 
            Откройте этот сайт на смартфоне для лучшего опыта!
          </p>
          <div className="mt-6 p-4 bg-cream rounded-lg">
            <p className="text-sm text-gray-500">
              💡 Уменьшите окно браузера или используйте режим разработчика
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesktopMessage;