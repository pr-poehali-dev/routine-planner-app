import React, { useState, useEffect } from 'react';
import AuthForm from '@/components/AuthForm';
import DesktopMessage from '@/components/DesktopMessage';
import AppHeader from '@/components/AppHeader';
import HabitLibrary from '@/components/HabitLibrary';
import MyHabitsTab from '@/components/MyHabitsTab';
import { RoutineAction, MyHabit, User } from '@/types';
import { availableRoutines } from '@/data/routinesData';

const Index = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeTab, setActiveTab] = useState<'library' | 'my-habits'>('library');
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

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

  // Проверка авторизации при загрузке
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setAuthToken(token);
      setUser(JSON.parse(userData));
    }
  }, []);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = (userData: User, token: string) => {
    setUser(userData);
    setAuthToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setAuthToken(null);
  };

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

  const completedCount = myHabits.filter(h => h.completed).length;
  const totalHabits = myHabits.length;
  const progressPercentage = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;

  // Если пользователь не авторизован, показываем форму входа
  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  // Если не мобильное устройство, показываем сообщение
  if (!isMobile) {
    return <DesktopMessage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-pink via-lavender to-cream">
      <AppHeader
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        myHabitsCount={myHabits.length}
        onLogout={handleLogout}
      />

      {/* Library Tab Content */}
      {activeTab === 'library' && (
        <HabitLibrary
          availableRoutines={availableRoutines}
          isHabitAdded={isHabitAdded}
          addToMyHabits={addToMyHabits}
          removeFromMyHabits={removeFromMyHabits}
        />
      )}

      {/* My Habits Tab Content */}
      {activeTab === 'my-habits' && (
        <MyHabitsTab
          myHabits={myHabits}
          completedCount={completedCount}
          totalHabits={totalHabits}
          progressPercentage={progressPercentage}
          toggleHabitComplete={toggleHabitComplete}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
};

export default Index;