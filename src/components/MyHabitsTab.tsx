import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { MyHabit } from '@/types';
import { getCategoryEmoji, getCategoryBgColor } from '@/utils/categoryHelpers';

interface MyHabitsTabProps {
  myHabits: MyHabit[];
  completedCount: number;
  totalHabits: number;
  progressPercentage: number;
  toggleHabitComplete: (id: number) => void;
  setActiveTab: (tab: 'library' | 'my-habits') => void;
}

const MyHabitsTab: React.FC<MyHabitsTabProps> = ({
  myHabits,
  completedCount,
  totalHabits,
  progressPercentage,
  toggleHabitComplete,
  setActiveTab
}) => {
  return (
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
                          {habit.emoji || getCategoryEmoji(habit.category)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{habit.emoji || getCategoryEmoji(habit.category)}</span>
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
  );
};

export default MyHabitsTab;