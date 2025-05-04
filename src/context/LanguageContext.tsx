
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
        case "about_us":
          return "About Us";
        case "site_creation":
          return "Site Creation";
        case "launch_date":
          return "Launch Date";
        case "created_by":
          return "Created By";
        case "days_online":
          return "Days Online";
        case "tech_stack":
          return "Tech Stack";
        case "our_story":
          return "Our Story";
        case "project_description":
          return "Project Description";
        case "project_purpose":
          return "Project Purpose";
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
