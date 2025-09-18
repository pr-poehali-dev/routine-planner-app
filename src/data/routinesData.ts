import { RoutineAction } from '@/types';

export const availableRoutines: RoutineAction[] = [
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
];