import { useEffect, useState } from 'react';

const STORAGE_KEY = 'brightcone-phase0-theme';

export function useTheme() {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const initial = stored ? stored === 'dark' : true;
    setDarkMode(initial);
    document.documentElement.classList.toggle('dark', initial);
  }, []);

  const toggleTheme = () => {
    setDarkMode((current) => {
      const next = !current;
      document.documentElement.classList.toggle('dark', next);
      window.localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
      return next;
    });
  };

  return { darkMode, toggleTheme };
}
