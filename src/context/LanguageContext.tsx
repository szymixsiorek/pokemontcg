
import React, { createContext, useState, useContext, useEffect } from "react";
import translations from "@/lib/translations";

interface LanguageContextType {
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    document.documentElement.lang = "en";
  }, []);

  const t = (key: string): string => {
    // For keys with dots, we need to fix them
    // This will convert keys like "back.to.sets" to proper text "Back To Sets"
    if (key.includes('.')) {
      const parts = key.split('.');
      return parts.map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join(' ');
    }
    
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
