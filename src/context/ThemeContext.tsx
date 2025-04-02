
import React, { createContext, useState, useContext, useEffect } from "react";

type ThemeType = 'original' | 'gold-silver' | 'ruby-sapphire' | 'diamond-pearl' | 'black-white' | 'xy' | 'sun-moon' | 'sword-shield' | 'scarlet-violet';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem("pokemon-theme");
    return (savedTheme as ThemeType) || "original";
  });

  useEffect(() => {
    localStorage.setItem("pokemon-theme", theme);
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
