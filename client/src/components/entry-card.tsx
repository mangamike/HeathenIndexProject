import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Castle, Hammer, Flame, Heart, TreePine } from "lucide-react";
import type { Entry } from "@shared/schema";

interface EntryCardProps {
  entry: Entry;
  onClick: () => void;
  searchQuery?: string;
}

const categoryIcons = {
  deity: Crown,
  place: Castle,
  artifact: Hammer,
  concept: Flame,
  creature: Heart,
  event: TreePine,
};

const categoryColors = {
  deity: "bg-primary/10 text-primary",
  place: "bg-accent/50 text-accent-foreground",
  artifact: "bg-destructive/10 text-destructive",
  concept: "bg-muted text-muted-foreground",
  creature: "bg-secondary/10 text-secondary-foreground",
  event: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

export function EntryCard({ entry, onClick, searchQuery }: EntryCardProps) {
  const IconComponent = categoryIcons[entry.category as keyof typeof categoryIcons] || Flame;
  const categoryColorClass = categoryColors[entry.category as keyof typeof categoryColors] || "bg-muted text-muted-foreground";

  const highlightText = (text: string, query?: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="search-highlight">{part}</span>
      ) : part
    );
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer hover-elevate" 
      onClick={onClick}
      data-testid={`card-entry-${entry.id}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-1" data-testid={`text-title-${entry.id}`}>
              {highlightText(entry.title, searchQuery)}
            </h4>
            <Badge className={`text-xs font-medium ${categoryColorClass}`} data-testid={`badge-category-${entry.id}`}>
              {entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}
            </Badge>
          </div>
          <IconComponent className="text-secondary text-lg flex-shrink-0" />
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3" data-testid={`text-description-${entry.id}`}>
          {highlightText(entry.description, searchQuery)}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {entry.relatedTerms?.slice(0, 3).map((term, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-muted text-muted-foreground"
                data-testid={`tag-${term}-${entry.id}`}
              >
                {highlightText(term, searchQuery)}
              </Badge>
            ))}
            {(entry.relatedTerms?.length || 0) > 3 && (
              <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                +{(entry.relatedTerms?.length || 0) - 3}
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground" data-testid={`text-sources-count-${entry.id}`}>
            {entry.sources ? "Sources available" : "No sources"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
