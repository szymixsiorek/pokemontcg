
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCardSetsBySeries } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import SetCard from "@/components/SetCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, SortDesc, SortAsc, Filter } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

const CardSets = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedSeries, setSelectedSeries] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [viewMode, setViewMode] = useState<"accordion" | "grid">("accordion");
  
  const { data: setsBySeries, isLoading, error } = useQuery({
    queryKey: ['cardSetsBySeries'],
    queryFn: () => getCardSetsBySeries()
  });

  // Extract available years and series from the data
  const { years, seriesList } = useMemo(() => {
    const yearsSet = new Set<string>();
    const seriesSet = new Set<string>();

    if (setsBySeries) {
      Object.entries(setsBySeries).forEach(([series, sets]) => {
        seriesSet.add(series);
        sets.forEach(set => {
          const year = set.releaseDate.split('/')[0];
          yearsSet.add(year);
        });
      });
    }

    return {
      years: Array.from(yearsSet).sort((a, b) => b.localeCompare(a)),
      seriesList: Array.from(seriesSet).sort()
    };
  }, [setsBySeries]);

  // Filter sets based on search query, year, and series
  const filteredSeries = useMemo(() => {
    if (!setsBySeries) return {};

    // First, filter by search query, year, and series
    const filtered = Object.entries(setsBySeries).reduce((acc, [series, sets]) => {
      // Filter by series if selected
      if (selectedSeries !== "all" && series !== selectedSeries) {
        return acc;
      }

      const filteredSets = sets.filter(set => {
        const matchesQuery = set.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesYear = selectedYear === "all" || set.releaseDate.startsWith(selectedYear);
        
        return matchesQuery && matchesYear;
      });
      
      if (filteredSets.length > 0) {
        acc[series] = filteredSets;
      }
      
      return acc;
    }, {} as Record<string, typeof setsBySeries[string]>);

    // Then, sort each series by release date
    return Object.entries(filtered).reduce((acc, [series, sets]) => {
      acc[series] = [...sets].sort((a, b) => {
        const dateA = new Date(a.releaseDate.replace(/\//g, '-')).getTime();
        const dateB = new Date(b.releaseDate.replace(/\//g, '-')).getTime();
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
      return acc;
    }, {} as Record<string, typeof setsBySeries[string]>);
  }, [setsBySeries, searchQuery, selectedYear, selectedSeries, sortOrder]);

  // Sort series alphabetically or by newest set in each series
  const sortedSeriesKeys = useMemo(() => {
    if (!filteredSeries) return [];
    
    return Object.keys(filteredSeries).sort((a, b) => {
      // If sorting by date, find the newest/oldest set in each series and compare
      if (sortOrder === "newest" || sortOrder === "oldest") {
        const aDate = filteredSeries[a][0].releaseDate;
        const bDate = filteredSeries[b][0].releaseDate;
        
        const dateA = new Date(aDate.replace(/\//g, '-')).getTime();
        const dateB = new Date(bDate.replace(/\//g, '-')).getTime();
        
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      }
      
      // Default to alphabetical
      return a.localeCompare(b);
    });
  }, [filteredSeries, sortOrder]);
  
  const hasResults = Object.keys(filteredSeries || {}).length > 0;

  // Flatten all sets for grid view
  const allSets = useMemo(() => {
    const sets: typeof setsBySeries[string] = [];
    Object.values(filteredSeries || {}).forEach(seriesSets => {
      sets.push(...seriesSets);
    });
    return sets;
  }, [filteredSeries]);
  
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedYear("all");
    setSelectedSeries("all");
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">{t("all_sets")}</h1>
          
          <div className="flex items-center gap-2">
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "accordion" | "grid")}>
              <ToggleGroupItem value="accordion" aria-label="View as accordion">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18M3 15h18"/></svg>
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" aria-label="View as grid">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              </ToggleGroupItem>
            </ToggleGroup>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SortAsc className="h-4 w-4 mr-2" />
                  {sortOrder === "newest" ? t("newest_first") : t("oldest_first")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("sort_by")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                  <SortDesc className="h-4 w-4 mr-2" />
                  {t("newest_first")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                  <SortAsc className="h-4 w-4 mr-2" />
                  {t("oldest_first")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Filter controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={t("search_sets")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder={t("filter_by_year")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all_years")}</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedSeries} onValueChange={setSelectedSeries}>
            <SelectTrigger>
              <SelectValue placeholder={t("filter_by_series")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all_series")}</SelectItem>
              {seriesList.map(series => (
                <SelectItem key={series} value={series}>{series}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Active filters */}
        {(selectedYear !== "all" || selectedSeries !== "all" || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">{t("active_filters")}:</span>
            
            {searchQuery && (
              <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                {t("search")}: {searchQuery}
                <span className="ml-2">×</span>
              </Button>
            )}
            
            {selectedYear !== "all" && (
              <Button variant="outline" size="sm" onClick={() => setSelectedYear("all")}>
                {t("year")}: {selectedYear}
                <span className="ml-2">×</span>
              </Button>
            )}
            
            {selectedSeries !== "all" && (
              <Button variant="outline" size="sm" onClick={() => setSelectedSeries("all")}>
                {t("series")}: {selectedSeries}
                <span className="ml-2">×</span>
              </Button>
            )}
            
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              {t("clear_all")}
            </Button>
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="pokeball-loader mx-auto mb-4" />
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
            <Button onClick={resetFilters}>
              {t("clear_filters")}
            </Button>
          </div>
        ) : viewMode === "accordion" ? (
          <Accordion
            type="multiple"
            defaultValue={sortedSeriesKeys}
            className="space-y-6"
          >
            {sortedSeriesKeys.map((series) => (
              <AccordionItem key={series} value={series} className="border-b-0">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline py-2">
                  {series} ({filteredSeries[series].length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredSeries[series].map((set) => (
                      <SetCard key={set.id} set={set} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allSets.map((set) => (
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
