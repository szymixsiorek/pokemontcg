
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCardSets } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import SetCard from "@/components/SetCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search } from "lucide-react";

const CardSets = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: sets, isLoading, error } = useQuery({
    queryKey: ['cardSets'],
    queryFn: getCardSets
  });
  
  const filteredSets = sets?.filter(set => 
    set.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    set.nameJp.includes(searchQuery)
  ) || [];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">{t("all_sets")}</h1>
        
        {/* Search bar */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={t("search_sets")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="pokeball-button animate-spin mx-auto mb-4" />
            <p>{t("loading")}</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{t("error")}</p>
            <Button onClick={() => window.location.reload()}>
              {t("try_again")}
            </Button>
          </div>
        ) : filteredSets.length === 0 ? (
          <div className="text-center py-12">
            <p className="mb-4">{t("no_sets_found")}</p>
            <Button onClick={() => setSearchQuery("")}>
              {t("clear_search")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSets.map((set) => (
              <SetCard key={set.id} set={set} />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CardSets;
