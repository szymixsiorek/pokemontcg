
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
    const translatedText = translations[key] || key;
    
    // Add new translations if they don't exist
    if (!translations[key]) {
      switch (key) {
        case "back_to_sets":
          return "Back to Sets";
        default:
          return key;
      }
    }
    
    return translatedText;
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
