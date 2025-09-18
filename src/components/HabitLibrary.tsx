import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { RoutineAction } from '@/types';
import { getCategoryEmoji, getCategoryBgColor } from '@/utils/categoryHelpers';

interface HabitLibraryProps {
  availableRoutines: RoutineAction[];
  isHabitAdded: (id: number) => boolean;
  addToMyHabits: (routine: RoutineAction) => void;
  removeFromMyHabits: (id: number) => void;
}

const HabitLibrary: React.FC<HabitLibraryProps> = ({
  availableRoutines,
  isHabitAdded,
  addToMyHabits,
  removeFromMyHabits
}) => {
  return (
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
                        {routine.emoji || getCategoryEmoji(routine.category)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{routine.emoji || getCategoryEmoji(routine.category)}</span>
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
  );
};

export default HabitLibrary;