export interface RoutineAction {
  id: number;
  title: string;
  description: string;
  image: string;
  category: 'wellness' | 'health' | 'productivity' | 'social';
}

export interface MyHabit extends RoutineAction {
  completed: boolean;
  streak: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
}