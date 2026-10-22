import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'cosmic-blue' | 'royal-gold' | 'emerald-lab';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'cosmic-blue',
  setTheme: () => {},
  cycleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('must_bs_mlt_theme') as ThemeMode;
      if (saved && ['cosmic-blue', 'royal-gold', 'emerald-lab'].includes(saved)) {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'cosmic-blue'; // Default to the newly requested Deep Blue Space theme
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('must_bs_mlt_theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const cycleTheme = () => {
    const themes: ThemeMode[] = ['cosmic-blue', 'royal-gold', 'emerald-lab'];
    const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
    setThemeState(themes[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
