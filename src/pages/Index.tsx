import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface RoutineAction {
  id: number;
  title: string;
  description: string;
  image: string;
  completed: boolean;
  streak: number;
}

const Index = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [routines, setRoutines] = useState<RoutineAction[]>([
    {
      id: 1,
      title: 'Утренний кофе',
      description: 'Насладиться ароматным кофе',
      image: '/img/98fd940d-ad9b-4e4e-bd6d-0da9f913eb39.jpg',
      completed: false,
      streak: 5
    },
    {
      id: 2,
      title: 'Прогулка',
      description: 'Пройтись на свежем воздухе',
      image: '/img/4199bbc4-eada-4e3a-886a-5eef208549c2.jpg',
      completed: true,
      streak: 12
    },
    {
      id: 3,
      title: 'Уборка',
      description: 'Навести порядок дома',
      image: '/img/f84e1606-90bd-4fbe-9887-68fbc1a19a7b.jpg',
      completed: false,
      streak: 3
    },
    {
      id: 4,
      title: 'Медитация',
      description: 'Несколько минут осознанности',
      image: '',
      completed: true,
      streak: 8
    },
    {
      id: 5,
      title: 'Чтение',
      description: 'Почитать интересную книгу',
      image: '',
      completed: false,
      streak: 15
    },
    {
      id: 6,
      title: 'Зарядка',
      description: 'Легкие физические упражнения',
      image: '',
      completed: false,
      streak: 2
    }
  ]);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleRoutine = (id: number) => {
    setRoutines(prev => prev.map(routine => 
      routine.id === id 
        ? { ...routine, completed: !routine.completed, streak: routine.completed ? routine.streak : routine.streak + 1 }
        : routine
    ));
  };

  const completedCount = routines.filter(r => r.completed).length;
  const totalRoutines = routines.length;
  const progressPercentage = (completedCount / totalRoutines) * 100;

  if (!isMobile) {
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-pink via-lavender to-cream">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-lavender/20">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            ✨ Мои привычки
          </h1>
          <div className="mt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Прогресс дня</span>
              <Badge variant="secondary" className="bg-mint text-gray-700">
                {completedCount}/{totalRoutines}
              </Badge>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-3 bg-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Routine List */}
      <div className="px-4 py-6 space-y-4">
        {routines.map((routine) => (
          <Card 
            key={routine.id}
            className={`overflow-hidden transition-all duration-300 border-0 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
              routine.completed 
                ? 'bg-gradient-to-r from-mint/20 to-cream/40' 
                : 'bg-white/90'
            }`}
          >
            <CardContent className="p-0">
              <div className="flex items-center">
                {/* Image */}
                <div className="w-20 h-20 flex-shrink-0">
                  {routine.image ? (
                    <img 
                      src={routine.image} 
                      alt={routine.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-lavender to-soft-pink flex items-center justify-center">
                      <span className="text-2xl">
                        {routine.id === 4 && '🧘'}
                        {routine.id === 5 && '📚'}
                        {routine.id === 6 && '💪'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {routine.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {routine.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Icon name="Flame" size={16} className="text-orange-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {routine.streak} дней
                        </span>
                      </div>
                    </div>

                    {/* Checkbox */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRoutine(routine.id)}
                      className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                        routine.completed
                          ? 'bg-mint border-mint text-white hover:bg-mint/80'
                          : 'border-gray-300 text-gray-400 hover:border-lavender hover:text-lavender'
                      }`}
                    >
                      {routine.completed && <Icon name="Check" size={20} />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievement Banner */}
      {progressPercentage === 100 && (
        <div className="fixed bottom-4 left-4 right-4 z-20">
          <Card className="bg-gradient-to-r from-mint to-lavender border-0 shadow-2xl animate-scale-in">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🎉</div>
              <h3 className="font-bold text-white mb-1">Отличная работа!</h3>
              <p className="text-sm text-white/80">Все привычки выполнены сегодня!</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Motivation */}
      <div className="px-4 pb-8">
        <Card className="bg-white/60 backdrop-blur-sm border-0">
          <CardContent className="p-4 text-center">
            <div className="flex justify-center gap-4 mb-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-mint">{completedCount}</div>
                <div className="text-xs text-gray-600">Выполнено</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-lavender-dark">
                  {Math.max(...routines.map(r => r.streak))}
                </div>
                <div className="text-xs text-gray-600">Лучший стрик</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-soft-pink">
                  {Math.round(progressPercentage)}%
                </div>
                <div className="text-xs text-gray-600">Прогресс</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Каждый день - это новая возможность стать лучше! ✨
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;