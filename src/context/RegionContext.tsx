
import React, { createContext, useState, useContext, useEffect } from "react";

type Region = "jp" | "en";

interface RegionContextType {
  region: Region;
  setRegion: (region: Region) => void;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export const RegionProvider = ({ children }: { children: React.ReactNode }) => {
  const [region, setRegion] = useState<Region>(() => {
    const savedRegion = localStorage.getItem("pokemon-region");
    return (savedRegion as Region) || "jp";
  });

  useEffect(() => {
    localStorage.setItem("pokemon-region", region);
  }, [region]);

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = (): RegionContextType => {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  return context;
};
