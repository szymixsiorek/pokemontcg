
import React, { createContext, useState, useContext, useEffect } from "react";

// Series themes based on their colors
export type ThemeType = 'original' | 'gold-silver' | 'ruby-sapphire' | 'diamond-pearl' | 'black-white' | 'xy' | 'sun-moon' | 'sword-shield' | 'scarlet-violet';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  getSeriesColors: (series: string) => { primary: string, secondary: string };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Map series names to theme types
const seriesThemeMap: Record<string, ThemeType> = {
  "Base": "original",
  "Classic": "original",
  "Neo": "gold-silver",
  "E-Card": "ruby-sapphire",
  "EX": "ruby-sapphire", 
  "Diamond & Pearl": "diamond-pearl",
  "Platinum": "diamond-pearl",
  "HeartGold & SoulSilver": "gold-silver",
  "Black & White": "black-white",
  "XY": "xy",
  "Sun & Moon": "sun-moon",
  "Sword & Shield": "sword-shield",
  "Scarlet & Violet": "scarlet-violet"
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem("pokemon-theme");
    return (savedTheme as ThemeType) || "original";
  });

  useEffect(() => {
    localStorage.setItem("pokemon-theme", theme);
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const getSeriesColors = (series: string): { primary: string, secondary: string } => {
    const themeKey = seriesThemeMap[series] || "original";
    
    switch (themeKey) {
      case "original":
        return { primary: "#FF0000", secondary: "#3B4CCA" };
      case "gold-silver":
        return { primary: "#DAA520", secondary: "#C0C0C0" };
      case "ruby-sapphire":
        return { primary: "#A00000", secondary: "#0000A0" };
      case "diamond-pearl":
        return { primary: "#5EBDFC", secondary: "#FC6770" };
      case "black-white":
        return { primary: "#444444", secondary: "#FFFFFF" };
      case "xy":
        return { primary: "#025DA6", secondary: "#BD1A22" };
      case "sun-moon":
        return { primary: "#F1912B", secondary: "#5599CA" };
      case "sword-shield":
        return { primary: "#00A1E9", secondary: "#BF004F" };
      case "scarlet-violet":
        return { primary: "#DD042C", secondary: "#6F22CC" };
      default:
        return { primary: "#FF0000", secondary: "#3B4CCA" };
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, getSeriesColors }}>
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
