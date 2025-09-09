import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { SearchSection } from "@/components/search-section";
import { EntryGrid } from "@/components/entry-grid";
import { AddEntryModal } from "@/components/add-entry-modal";
import { EntryDetailModal } from "@/components/entry-detail-modal";
import { EditEntryModal } from "@/components/edit-entry-modal";
import { useAuth } from "@/hooks/useAuth";
import type { Entry } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [editEntry, setEditEntry] = useState<Entry | null>(null);
  const [sortOrder, setSortOrder] = useState("alphabetical");
  const { isAuthenticated } = useAuth();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryFilter = (category: string) => {
    setActiveCategory(category);
  };

  const handleViewEntry = (entry: Entry) => {
    setSelectedEntry(entry);
  };

  const handleCloseDetail = () => {
    setSelectedEntry(null);
  };

  const handleEditEntry = (entry: Entry) => {
    setSelectedEntry(null); // Close detail modal
    setEditEntry(entry); // Open edit modal
  };

  const handleCloseEdit = () => {
    setEditEntry(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onShowAddForm={() => setShowAddModal(true)} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchSection
          searchQuery={searchQuery}
          activeCategory={activeCategory}
          onSearch={handleSearch}
          onCategoryFilter={handleCategoryFilter}
        />
        
        <EntryGrid
          searchQuery={searchQuery}
          activeCategory={activeCategory}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          onViewEntry={handleViewEntry}
        />
      </main>

      <footer className="border-t border-border bg-muted/30 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <i className="fas fa-hammer text-primary"></i>
              <span className="font-semibold text-foreground">Heathen Index Project</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              A collaborative database for preserving and sharing knowledge of Norse mythology
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">About</a>
              <a href="#" className="hover:text-foreground transition-colors">Guidelines</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
              <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>

      <AddEntryModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <EntryDetailModal
        entry={selectedEntry}
        onClose={handleCloseDetail}
        onEdit={handleEditEntry}
      />

      <EditEntryModal
        entry={editEntry}
        open={!!editEntry}
        onClose={handleCloseEdit}
      />
    </div>
  );
}
