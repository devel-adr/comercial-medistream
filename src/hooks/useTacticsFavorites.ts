
import { useState, useEffect } from 'react';

export const useTacticsFavorites = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const savedFavorites = localStorage.getItem('tacticsFavorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const toggleFavorite = (tacticId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(tacticId)) {
      newFavorites.delete(tacticId);
    } else {
      newFavorites.add(tacticId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('tacticsFavorites', JSON.stringify(Array.from(newFavorites)));
  };

  const isFavorite = (tacticId: string) => favorites.has(tacticId);

  return {
    favorites,
    toggleFavorite,
    isFavorite
  };
};
