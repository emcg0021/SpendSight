type User = {
  is_active?: boolean;
};

export const isPremium = (user: User | null): boolean => {
  return !!user?.is_active;
};