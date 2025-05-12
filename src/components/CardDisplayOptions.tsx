
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, List, ArrowUp, ArrowDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { CardGroup } from "@/hooks/useCardSearch";

export type DisplayMode = "grouped" | "all";
export type SortOrder = "oldest-first" | "newest-first";

interface CardDisplayOptionsProps {
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  availableSets: { id: string; name: string }[];
  selectedSetId: string | null;
  setSelectedSetId: (setId: string | null) => void;
}

const CardDisplayOptions = ({
  displayMode,
  setDisplayMode,
  sortOrder,
  setSortOrder,
  availableSets,
  selectedSetId,
  setSelectedSetId
}: CardDisplayOptionsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Display Mode Toggle */}
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium mr-2">{t("display")}:</Label>
          <ToggleGroup type="single" value={displayMode} onValueChange={(value) => value && setDisplayMode(value as DisplayMode)}>
            <ToggleGroupItem value="grouped" aria-label="Group by set">
              <Filter className="h-4 w-4 mr-1" />
              {t("grouped")}
            </ToggleGroupItem>
            <ToggleGroupItem value="all" aria-label="All cards">
              <List className="h-4 w-4 mr-1" />
              {t("all_cards")}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        {/* Sort Order Radio */}
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium mr-2">{t("sort_by")}:</Label>
          <RadioGroup className="flex gap-4" defaultValue={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="oldest-first" id="oldest-first" />
              <Label htmlFor="oldest-first" className="cursor-pointer flex items-center">
                <ArrowUp className="h-3.5 w-3.5 mr-1" />
                {t("oldest_first")}
              </Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="newest-first" id="newest-first" />
              <Label htmlFor="newest-first" className="cursor-pointer flex items-center">
                <ArrowDown className="h-3.5 w-3.5 mr-1" />
                {t("newest_first")}
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      {/* Set Filter - Only show if we have sets to filter */}
      {availableSets.length > 1 && (
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">{t("filter_by_set")}:</Label>
          <Select 
            value={selectedSetId || ""} 
            onValueChange={(value) => setSelectedSetId(value === "" ? null : value)}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder={t("all_sets")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t("all_sets")}</SelectItem>
              {availableSets.map(set => (
                <SelectItem key={set.id} value={set.id}>{set.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default CardDisplayOptions;
