"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Event = {
  id: string | number;
  title: string;
  category: string;
  image: string;
  date: string;
  day: string;
  location: string;
  price: number;
};

type FavoritesContextType = {
  favorites: Event[];
  isFavorite: (id: string | number) => boolean;
  toggleFavorite: (event: Event) => void;
  isLoaded: boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Event[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved favorites when the app starts
  useEffect(() => {
    try {
      const saved = localStorage.getItem("vybe-favorites");

      if (saved) {
        const parsed: Event[] = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (error) {
      console.error("Could not load favorites:", error);
    } finally {
      setIsLoaded(true);
    }
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem("vybe-favorites");

        if (saved) {
          const parsed: Event[] = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        }
      } catch (error) {
        console.error("Could not load favorites:", error);
      } finally {
        setIsLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  // Save favorites whenever the list changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("vybe-favorites", JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  // Check whether an event is already a favorite
  const isFavorite = (id: string | number) =>
    favorites.some((event) => String(event.id) === String(id));

  // Add or remove an event
  const toggleFavorite = (event: Event) => {
    setFavorites((current) => {
      const exists = current.some(
        (item) => String(item.id) === String(event.id),
      );

      if (exists) {
        return current.filter((item) => String(item.id) !== String(event.id));
      }

      return [...current, event];
    });
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, isLoaded }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }

  return context;
}
