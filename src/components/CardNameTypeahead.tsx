
import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Define the shape of a Pokemon card suggestion
export interface CardSuggestion {
  id: string;
  name: string;
  imageUrl?: string; // Optional image URL for the card
}

interface CardNameTypeaheadProps {
  onSelect: (card: CardSuggestion) => void;
  placeholder?: string;
  className?: string;
  searchEndpoint?: string; // Allow custom endpoint for flexibility
}

const CardNameTypeahead: React.FC<CardNameTypeaheadProps> = ({
  onSelect,
  placeholder,
  className,
  searchEndpoint = "/api/cards"
}) => {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<CardSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionListRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to fetch suggestions based on search text
  const fetchSuggestions = async (searchText: string) => {
    if (!searchText.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Use the Pokemon TCG API endpoint through our API service
      const response = await fetch(`${searchEndpoint}?query=${encodeURIComponent(searchText)}`);
      
      if (!response.ok) {
        throw new Error(`Search request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Limit to 10 suggestions
      setSuggestions(data.slice(0, 10));
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching card suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce the search input to prevent excessive API calls
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedIndex(-1);
    
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set a new timer for 300ms
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };

  // Function to handle suggestion selection
  const handleSelectSuggestion = (suggestion: CardSuggestion) => {
    setInputValue(suggestion.name);
    setSuggestions([]);
    setShowSuggestions(false);
    onSelect(suggestion);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        suggestionListRef.current && 
        !inputRef.current.contains(event.target as Node) && 
        !suggestionListRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clean up any timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Highlight the matching part of the suggestion
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, i) => (
          regex.test(part) ? 
            <span key={i} className="font-medium bg-primary-foreground/20">{part}</span> : 
            <span key={i}>{part}</span>
        ))}
      </>
    );
  };

  return (
    <div className={`relative ${className || ""}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && setSuggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder || t("search_cards")}
          className="pl-10 pr-4"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionListRef}
          className="absolute z-50 mt-1 w-full bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto"
        >
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                onClick={() => handleSelectSuggestion(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`px-4 py-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-muted ${
                  index === selectedIndex ? "bg-muted" : ""
                }`}
              >
                {suggestion.imageUrl && (
                  <img 
                    src={suggestion.imageUrl} 
                    alt={suggestion.name}
                    className="h-6 w-6 object-cover rounded"
                  />
                )}
                <span>{highlightMatch(suggestion.name, inputValue)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CardNameTypeahead;
