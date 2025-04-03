
import React, { createContext, useState, useContext, useEffect } from "react";

// Simple theme type for light/dark mode
export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  getSeriesColors: (series: string) => { primary: string, secondary: string };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Map series names to color schemes
const seriesColorMap: Record<string, { primary: string, secondary: string }> = {
  "Base": { primary: "#FF0000", secondary: "#3B4CCA" },
  "Classic": { primary: "#FF0000", secondary: "#3B4CCA" },
  "Neo": { primary: "#DAA520", secondary: "#C0C0C0" },
  "E-Card": { primary: "#A00000", secondary: "#0000A0" },
  "EX": { primary: "#A00000", secondary: "#0000A0" }, 
  "Diamond & Pearl": { primary: "#5EBDFC", secondary: "#FC6770" },
  "Platinum": { primary: "#5EBDFC", secondary: "#FC6770" },
  "HeartGold & SoulSilver": { primary: "#DAA520", secondary: "#C0C0C0" },
  "Black & White": { primary: "#444444", secondary: "#FFFFFF" },
  "XY": { primary: "#025DA6", secondary: "#BD1A22" },
  "Sun & Moon": { primary: "#F1912B", secondary: "#5599CA" },
  "Sword & Shield": { primary: "#00A1E9", secondary: "#BF004F" },
  "Scarlet & Violet": { primary: "#DD042C", secondary: "#6F22CC" }
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem("pokemon-theme");
    return (savedTheme as ThemeType) || "system";
  });

  useEffect(() => {
    localStorage.setItem("pokemon-theme", theme);
    
    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(systemTheme);
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const getSeriesColors = (series: string): { primary: string, secondary: string } => {
    return seriesColorMap[series] || { primary: "#FF0000", secondary: "#3B4CCA" };
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
