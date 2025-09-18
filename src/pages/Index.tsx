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
  category: 'wellness' | 'health' | 'productivity' | 'social';
}

interface MyHabit extends RoutineAction {
  completed: boolean;
  streak: number;
}

const Index = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeTab, setActiveTab] = useState<'library' | 'my-habits'>('library');

  // Библиотека всех доступных привычек
  const [availableRoutines] = useState<RoutineAction[]>([
    {
      id: 1,
      title: 'Утренний кофе',
      description: 'Насладиться ароматным кофе',
      image: '/img/98fd940d-ad9b-4e4e-bd6d-0da9f913eb39.jpg',
      category: 'wellness'
    },
    {
      id: 2,
      title: 'Прогулка',
      description: 'Пройтись на свежем воздухе',
      image: '/img/4199bbc4-eada-4e3a-886a-5eef208549c2.jpg',
      category: 'health'
    },
    {
      id: 3,
      title: 'Уборка',
      description: 'Навести порядок дома',
      image: '/img/f84e1606-90bd-4fbe-9887-68fbc1a19a7b.jpg',
      category: 'productivity'
    },
    {
      id: 4,
      title: 'Медитация',
      description: 'Несколько минут осознанности',
      image: '/img/4ec3a5d7-5270-45cb-88a1-32f7a28f2a75.jpg',
      category: 'wellness'
    },
    {
      id: 5,
      title: 'Чтение',
      description: 'Почитать интересную книгу',
      image: '/img/b2a913a3-aae0-4a82-b9dc-530c418b6978.jpg',
      category: 'productivity'
    },
    {
      id: 6,
      title: 'Зарядка',
      description: 'Легкие физические упражнения',
      image: '/img/4b0f574c-0359-41d3-a20a-886bd6712be3.jpg',
      category: 'health'
    },
    {
      id: 7,
      title: 'Звонок родным',
      description: 'Поговорить с близкими',
      image: '',
      category: 'social'
    },
    {
      id: 8,
      title: 'Планирование дня',
      description: 'Составить план на завтра',
      image: '',
      category: 'productivity'
    },
    {
      id: 9,
      title: 'Здоровый завтрак',
      description: 'Полезная еда с утра',
      image: '',
      category: 'health'
    },
    {
      id: 10,
      title: 'Благодарность',
      description: 'Подумать о хорошем за день',
      image: '',
      category: 'wellness'
    }
  ]);

  // Выбранные пользователем привычки
  const [myHabits, setMyHabits] = useState<MyHabit[]>([
    {
      id: 2,
      title: 'Прогулка',
      description: 'Пройтись на свежем воздухе',
      image: '/img/4199bbc4-eada-4e3a-886a-5eef208549c2.jpg',
      category: 'health',
      completed: false,
      streak: 3
    }
  ]);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addToMyHabits = (routine: RoutineAction) => {
    const newHabit: MyHabit = {
      ...routine,
      completed: false,
      streak: 0
    };
    setMyHabits(prev => [...prev, newHabit]);
  };

  const removeFromMyHabits = (id: number) => {
    setMyHabits(prev => prev.filter(habit => habit.id !== id));
  };

  const toggleHabitComplete = (id: number) => {
    setMyHabits(prev => prev.map(habit => 
      habit.id === id 
        ? { ...habit, completed: !habit.completed, streak: habit.completed ? habit.streak : habit.streak + 1 }
        : habit
    ));
  };

  const isHabitAdded = (id: number) => myHabits.some(habit => habit.id === id);

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'wellness': return '✨';
      case 'health': return '💪';
      case 'productivity': return '📋';
      case 'social': return '💬';
      default: return '🌟';
    }
  };

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case 'wellness': return 'from-soft-pink to-lavender';
      case 'health': return 'from-mint to-cream';
      case 'productivity': return 'from-lavender to-soft-pink';
      case 'social': return 'from-cream to-mint';
      default: return 'from-soft-pink to-cream';
    }
  };

  const completedCount = myHabits.filter(h => h.completed).length;
  const totalHabits = myHabits.length;
  const progressPercentage = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;

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
      {/* Header with Tabs */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-lavender/20">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-800 text-center mb-3">
            ✨ Планировщик привычек
          </h1>
          
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={activeTab === 'library' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('library')}
              className={`flex-1 rounded-md transition-all duration-200 ${
                activeTab === 'library' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon name="Library" size={16} className="mr-1" />
              Библиотека
            </Button>
            <Button
              variant={activeTab === 'my-habits' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('my-habits')}
              className={`flex-1 rounded-md transition-all duration-200 ${
                activeTab === 'my-habits' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon name="Heart" size={16} className="mr-1" />
              Мои привычки
              {myHabits.length > 0 && (
                <Badge className="ml-2 bg-mint text-gray-700 text-xs">
                  {myHabits.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Library Tab Content */}
      {activeTab === 'library' && (
        <div className="px-4 py-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 text-center">
              Выберите привычки, которые хотите отслеживать
            </p>
          </div>
          
          <div className="space-y-3">
            {availableRoutines.map((routine) => (
              <Card 
                key={routine.id}
                className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/90"
              >
                <CardContent className="p-0">
                  <div className="flex items-center">
                    {/* Image */}
                    <div className="w-16 h-16 flex-shrink-0">
                      {routine.image ? (
                        <img 
                          src={routine.image} 
                          alt={routine.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${getCategoryBgColor(routine.category)} flex items-center justify-center`}>
                          <span className="text-xl">
                            {routine.id === 7 && '📞'}
                            {routine.id === 8 && '📋'}
                            {routine.id === 9 && '🥗'}
                            {routine.id === 10 && '🙏'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{getCategoryEmoji(routine.category)}</span>
                            <h3 className="font-semibold text-gray-800 text-sm">
                              {routine.title}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-600">
                            {routine.description}
                          </p>
                        </div>

                        {/* Add/Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => isHabitAdded(routine.id) 
                            ? removeFromMyHabits(routine.id)
                            : addToMyHabits(routine)
                          }
                          className={`w-8 h-8 rounded-full transition-all duration-200 ${
                            isHabitAdded(routine.id)
                              ? 'bg-mint text-white hover:bg-mint/80'
                              : 'border-2 border-gray-300 text-gray-400 hover:border-mint hover:text-mint'
                          }`}
                        >
                          <Icon 
                            name={isHabitAdded(routine.id) ? "Check" : "Plus"} 
                            size={14} 
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* My Habits Tab Content */}
      {activeTab === 'my-habits' && (
        <div className="px-4 py-6">
          {/* Progress Section */}
          {myHabits.length > 0 && (
            <div className="mb-6">
              <Card className="bg-white/60 backdrop-blur-sm border-0">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Прогресс дня</span>
                    <Badge variant="secondary" className="bg-mint text-gray-700">
                      {completedCount}/{totalHabits}
                    </Badge>
                  </div>
                  <Progress 
                    value={progressPercentage} 
                    className="h-3 bg-gray-200"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Habits List */}
          {myHabits.length === 0 ? (
            <Card className="bg-white/60 backdrop-blur-sm border-0">
              <CardContent className="p-8 text-center">
                <Icon name="Heart" size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="font-semibold text-gray-600 mb-2">
                  Пока нет привычек
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Добавьте привычки из библиотеки, чтобы начать их отслеживать
                </p>
                <Button
                  onClick={() => setActiveTab('library')}
                  className="bg-mint hover:bg-mint/80 text-gray-700"
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  Выбрать привычки
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myHabits.map((habit) => (
                <Card 
                  key={habit.id}
                  className={`overflow-hidden transition-all duration-300 border-0 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
                    habit.completed 
                      ? 'bg-gradient-to-r from-mint/20 to-cream/40' 
                      : 'bg-white/90'
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="flex items-center">
                      {/* Image */}
                      <div className="w-20 h-20 flex-shrink-0">
                        {habit.image ? (
                          <img 
                            src={habit.image} 
                            alt={habit.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${getCategoryBgColor(habit.category)} flex items-center justify-center`}>
                            <span className="text-2xl">
                              {habit.id === 7 && '📞'}
                              {habit.id === 8 && '📋'}
                              {habit.id === 9 && '🥗'}
                              {habit.id === 10 && '🙏'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{getCategoryEmoji(habit.category)}</span>
                              <h3 className="font-semibold text-gray-800">
                                {habit.title}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {habit.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <Icon name="Flame" size={16} className="text-orange-500" />
                              <span className="text-sm font-medium text-gray-700">
                                {habit.streak} дней
                              </span>
                            </div>
                          </div>

                          {/* Checkbox */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleHabitComplete(habit.id)}
                            className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                              habit.completed
                                ? 'bg-mint border-mint text-white hover:bg-mint/80'
                                : 'border-gray-300 text-gray-400 hover:border-lavender hover:text-lavender'
                            }`}
                          >
                            {habit.completed && <Icon name="Check" size={20} />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Achievement Banner */}
          {progressPercentage === 100 && myHabits.length > 0 && (
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

          {/* Bottom Stats */}
          {myHabits.length > 0 && (
            <div className="mt-6">
              <Card className="bg-white/60 backdrop-blur-sm border-0">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center gap-6 mb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-mint">{completedCount}</div>
                      <div className="text-xs text-gray-600">Выполнено</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-lavender-dark">
                        {Math.max(...myHabits.map(h => h.streak))}
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
          )}
        </div>
      )}
    </div>
  );
};

export default Index;