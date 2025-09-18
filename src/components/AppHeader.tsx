import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { User } from '@/types';

interface AppHeaderProps {
  user: User;
  activeTab: 'library' | 'my-habits';
  setActiveTab: (tab: 'library' | 'my-habits') => void;
  myHabitsCount: number;
  onLogout: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  user, 
  activeTab, 
  setActiveTab, 
  myHabitsCount, 
  onLogout 
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-lavender/20">
      <div className="px-4 py-3">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-bold text-gray-800">
            ✨ Привет, {user.username}!
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-gray-600 hover:text-gray-800"
          >
            <Icon name="LogOut" size={16} />
          </Button>
        </div>
        
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
            {myHabitsCount > 0 && (
              <Badge className="ml-2 bg-mint text-gray-700 text-xs">
                {myHabitsCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;