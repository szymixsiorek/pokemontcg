
import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Card {
  id: string;
  name: string;
  imageUrl: string;
}

interface CardNameTypeaheadProps {
  onSelect: (card: Card) => void;
  placeholder?: string;
  className?: string;
}

const CardNameTypeahead: React.FC<CardNameTypeaheadProps> = ({
  onSelect,
  placeholder = "Search cards...",
  className,
}) => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timerId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/cards?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to fetch suggestions');
        
        const data: Card[] = await response.json();
        // Limit to 10 results
        setSuggestions(data.slice(0, 10));
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timerId);
  }, [query]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        suggestionsRef.current && 
        !inputRef.current.contains(event.target as Node) && 
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    // Arrow Down
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prevIndex) => 
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    }
    // Arrow Up
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    }
    // Enter to select
    else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelectCard(suggestions[activeIndex]);
    }
    // Escape to close
    else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSelectCard = (card: Card) => {
    onSelect(card);
    setQuery(card.name);
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  // Highlight matching text within suggestion
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <span key={index} className="bg-yellow-200 dark:bg-yellow-800">{part}</span> : 
        part
    );
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        onFocus={() => query.trim() && setShowSuggestions(true)}
        className="w-full"
      />
      
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-full bg-background border border-input rounded-md shadow-md max-h-60 overflow-auto"
        >
          <ul className="py-1">
            {suggestions.map((card, index) => (
              <li
                key={card.id}
                onClick={() => handleSelectCard(card)}
                className={cn(
                  "flex items-center px-3 py-2 cursor-pointer hover:bg-muted",
                  index === activeIndex && "bg-muted"
                )}
              >
                <div className="h-8 w-8 mr-3 flex-shrink-0">
                  <img 
                    src={card.imageUrl} 
                    alt={card.name} 
                    className="h-full w-full object-cover rounded-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="text-sm">{highlightMatch(card.name, query)}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CardNameTypeahead;
