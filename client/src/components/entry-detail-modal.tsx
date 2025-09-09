import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Castle, Hammer, Flame, Heart, TreePine, Edit } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { Entry } from "@shared/schema";

interface EntryDetailModalProps {
  entry: Entry | null;
  onClose: () => void;
  onEdit?: (entry: Entry) => void;
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

export function EntryDetailModal({ entry, onClose, onEdit }: EntryDetailModalProps) {
  const { isAuthenticated } = useAuth();
  
  if (!entry) return null;

  const IconComponent = categoryIcons[entry.category as keyof typeof categoryIcons] || Flame;
  const categoryColorClass = categoryColors[entry.category as keyof typeof categoryColors] || "bg-muted text-muted-foreground";

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Unknown';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={!!entry} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="modal-entry-detail">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <IconComponent className="text-secondary text-xl" />
              <div>
                <DialogTitle className="text-xl" data-testid="detail-title">
                  {entry.title}
                </DialogTitle>
                <Badge className={`text-xs font-medium ${categoryColorClass}`} data-testid="detail-category">
                  {entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}
                </Badge>
              </div>
            </div>
            {isAuthenticated && onEdit && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(entry)}
                data-testid="button-edit-entry"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Entry Description */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3" data-testid="description-heading">
              Description
            </h4>
            <div className="prose prose-sm max-w-none text-muted-foreground" data-testid="detail-description">
              <p>{entry.description}</p>
            </div>
          </div>

          {/* Related Terms */}
          {entry.relatedTerms && entry.relatedTerms.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-3" data-testid="related-terms-heading">
                Related Terms
              </h4>
              <div className="flex flex-wrap gap-2" data-testid="related-terms-list">
                {entry.relatedTerms.map((term, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-sm bg-muted text-muted-foreground"
                    data-testid={`related-term-${index}`}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Sources */}
          {entry.sources && (
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-3" data-testid="sources-heading">
                Sources
              </h4>
              <div className="text-sm text-muted-foreground whitespace-pre-line" data-testid="detail-sources">
                {entry.sources}
              </div>
            </div>
          )}

          {/* Entry Metadata */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span data-testid="created-date">
                Added: {formatDate(entry.createdAt)}
              </span>
              <span data-testid="updated-date">
                Last updated: {formatDate(entry.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
