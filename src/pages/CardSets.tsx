
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCardSetsBySeries } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import SetCard from "@/components/SetCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const CardSets = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: setsBySeries, isLoading, error } = useQuery({
    queryKey: ['cardSetsBySeries'],
    queryFn: () => getCardSetsBySeries()
  });

  // Filter sets based on search query
  const filteredSeries = Object.entries(setsBySeries || {}).reduce((acc, [series, sets]) => {
    const filteredSets = sets.filter(set => 
      set.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (filteredSets.length > 0) {
      acc[series] = filteredSets;
    }
    
    return acc;
  }, {} as Record<string, typeof setsBySeries[string]>);
  
  const hasResults = Object.keys(filteredSeries || {}).length > 0;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">{t("all_sets")}</h1>
        </div>
        
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
        ) : !hasResults ? (
          <div className="text-center py-12">
            <p className="mb-4">{t("no_sets_found")}</p>
            <Button onClick={() => setSearchQuery("")}>
              {t("clear_search")}
            </Button>
          </div>
        ) : (
          <Accordion
            type="multiple"
            defaultValue={Object.keys(filteredSeries || {})}
            className="space-y-6"
          >
            {Object.entries(filteredSeries || {}).map(([series, sets]) => (
              <AccordionItem key={series} value={series} className="border-b-0">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline py-2">
                  {series}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sets.map((set) => (
                      <SetCard key={set.id} set={set} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CardSets;
