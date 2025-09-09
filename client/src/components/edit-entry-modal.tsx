import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertEntrySchema, type InsertEntry, type Entry } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface EditEntryModalProps {
  entry: Entry | null;
  open: boolean;
  onClose: () => void;
}

export function EditEntryModal({ entry, open, onClose }: EditEntryModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertEntry>({
    resolver: zodResolver(insertEntrySchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      relatedTerms: [],
      sources: "",
    },
  });

  // Update form when entry changes
  useEffect(() => {
    if (entry && open) {
      form.reset({
        title: entry.title,
        category: entry.category,
        description: entry.description,
        relatedTerms: entry.relatedTerms || [],
        sources: entry.sources || "",
      });
    }
  }, [entry, open, form]);

  const updateEntryMutation = useMutation({
    mutationFn: async (data: InsertEntry) => {
      if (!entry) throw new Error("No entry to update");
      const response = await apiRequest("PUT", `/api/entries/${entry.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      toast({
        title: "Entry updated",
        description: "Your Norse mythology entry has been updated successfully.",
      });
      onClose();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update entry",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertEntry) => {
    // Parse related terms from comma-separated string
    const formData = {
      ...data,
      relatedTerms: data.relatedTerms || [],
    };
    updateEntryMutation.mutate(formData);
  };

  const handleRelatedTermsChange = (value: string) => {
    const terms = value.split(",").map(term => term.trim()).filter(term => term.length > 0);
    form.setValue("relatedTerms", terms);
  };

  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-edit-entry">
        <DialogHeader>
          <DialogTitle data-testid="modal-title">Edit Entry</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-edit-entry">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the name or title"
                      {...field}
                      data-testid="input-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="deity">Deity</SelectItem>
                      <SelectItem value="place">Place</SelectItem>
                      <SelectItem value="concept">Concept</SelectItem>
                      <SelectItem value="artifact">Artifact</SelectItem>
                      <SelectItem value="creature">Creature</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed description..."
                      rows={6}
                      className="resize-vertical"
                      {...field}
                      data-testid="textarea-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relatedTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Related Terms</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Add related terms separated by commas"
                      value={field.value?.join(", ") || ""}
                      onChange={(e) => handleRelatedTermsChange(e.target.value)}
                      data-testid="input-related-terms"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    e.g., wisdom, ravens, sleipnir, gungnir
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sources"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sources</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List your sources (books, articles, etc.)"
                      rows={3}
                      className="resize-vertical"
                      {...field}
                      value={field.value || ""}
                      data-testid="textarea-sources"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4 border-t border-border">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateEntryMutation.isPending}
                data-testid="button-submit"
              >
                {updateEntryMutation.isPending ? "Updating..." : "Update Entry"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}