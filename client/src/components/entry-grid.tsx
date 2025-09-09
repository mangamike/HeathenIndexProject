import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { EntryCard } from "@/components/entry-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Entry } from "@shared/schema";

interface EntryGridProps {
  searchQuery: string;
  activeCategory: string;
  sortOrder: string;
  onSortChange: (order: string) => void;
  onViewEntry: (entry: Entry) => void;
}

interface EntriesResponse {
  entries: Entry[];
  total: number;
  page: number;
  totalPages: number;
}

export function EntryGrid({
  searchQuery,
  activeCategory,
  sortOrder,
  onSortChange,
  onViewEntry,
}: EntryGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 12;

  const { data, isLoading, error } = useQuery<EntriesResponse>({
    queryKey: ["/api/entries", searchQuery, activeCategory, currentPage, entriesPerPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: entriesPerPage.toString(),
      });
      
      if (searchQuery) params.append("search", searchQuery);
      if (activeCategory !== "all") params.append("category", activeCategory);
      
      const response = await fetch(`/api/entries?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch entries");
      }
      return response.json();
    },
  });

  // Reset to page 1 when search or category changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  if (isLoading) {
    return (
      <section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-muted rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="text-center py-8">
          <p className="text-destructive" data-testid="error-message">
            Failed to load entries. Please try again.
          </p>
        </div>
      </section>
    );
  }

  if (!data || data.entries.length === 0) {
    return (
      <section>
        <div className="text-center py-8">
          <p className="text-muted-foreground" data-testid="no-results">
            {searchQuery || activeCategory !== "all" 
              ? "No entries found matching your search criteria."
              : "No entries available."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground" data-testid="results-title">
            {searchQuery ? "Search Results" : "Browse Entries"}
          </h3>
          <p className="text-sm text-muted-foreground" data-testid="results-count">
            Showing {data.entries.length} of {data.total} entries
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-muted-foreground">Sort by:</label>
          <Select value={sortOrder} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px]" data-testid="select-sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="recent">Recently Added</SelectItem>
              <SelectItem value="popular">Most Referenced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Entry Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="entries-grid">
        {data.entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onClick={() => onViewEntry(entry)}
            searchQuery={searchQuery}
          />
        ))}
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-center mt-8 space-x-2" data-testid="pagination">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            data-testid="button-prev-page"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          {/* Page numbers */}
          {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                data-testid={`button-page-${pageNum}`}
              >
                {pageNum}
              </Button>
            );
          })}
          
          {data.totalPages > 5 && (
            <>
              <span className="text-muted-foreground">...</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(data.totalPages)}
                data-testid={`button-page-${data.totalPages}`}
              >
                {data.totalPages}
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(data.totalPages, p + 1))}
            disabled={currentPage === data.totalPages}
            data-testid="button-next-page"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </section>
  );
}
