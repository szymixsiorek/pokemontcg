
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
    // Use translations if available
    if (translations[key]) {
      return translations[key];
    }
    
    // For keys with dots, we need to convert them to proper text
    // This will convert keys like "back.to.sets" to proper text "Back To Sets"
    if (key.includes('.')) {
      const parts = key.split('.');
      return parts.map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join(' ');
    }
    
    // Return the key itself if no translation found
    return key;
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
