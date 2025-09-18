export const getCategoryEmoji = (category: string) => {
  switch (category) {
    case 'wellness': return '✨';
    case 'health': return '💪';
    case 'productivity': return '📋';
    case 'social': return '💬';
    default: return '🌟';
  }
};

export const getCategoryBgColor = (category: string) => {
  switch (category) {
    case 'wellness': return 'from-soft-pink to-lavender';
    case 'health': return 'from-mint to-cream';
    case 'productivity': return 'from-lavender to-soft-pink';
    case 'social': return 'from-cream to-mint';
    default: return 'from-soft-pink to-cream';
  }
};