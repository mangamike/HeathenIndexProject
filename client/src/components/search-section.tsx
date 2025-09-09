import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchSectionProps {
  searchQuery: string;
  activeCategory: string;
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string) => void;
}

export function SearchSection({
  searchQuery,
  activeCategory,
  onSearch,
  onCategoryFilter,
}: SearchSectionProps) {
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch(value);
  };

  const categories = [
    { id: "all", label: "All" },
    { id: "deity", label: "Deities" },
    { id: "place", label: "Places" },
    { id: "concept", label: "Concepts" },
    { id: "artifact", label: "Artifacts" },
    { id: "creature", label: "Creatures" },
    { id: "event", label: "Events" },
  ];

  return (
    <section className="mb-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2" data-testid="hero-title">
            Explore Norse Mythology
          </h2>
          <p className="text-muted-foreground" data-testid="hero-subtitle">
            Search through deities, places, concepts, and artifacts from the Norse pantheon
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search for deities, places, concepts..."
            value={inputValue}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 text-foreground placeholder-muted-foreground"
            data-testid="input-search"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "secondary"}
              size="sm"
              onClick={() => onCategoryFilter(category.id)}
              className="rounded-full"
              data-testid={`filter-${category.id}`}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
