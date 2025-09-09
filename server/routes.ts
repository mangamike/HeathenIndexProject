import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEntrySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all entries with optional search and category filter
  app.get("/api/entries", async (req, res) => {
    try {
      const { search, category, page = "1", limit = "12" } = req.query;
      
      const entries = await storage.searchEntries(
        search as string || "", 
        category as string
      );
      
      // Pagination
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      
      const paginatedEntries = entries.slice(startIndex, endIndex);
      
      res.json({
        entries: paginatedEntries,
        total: entries.length,
        page: pageNum,
        totalPages: Math.ceil(entries.length / limitNum),
      });
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch entries", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get single entry by ID
  app.get("/api/entries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await storage.getEntry(id);
      
      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }
      
      res.json(entry);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch entry", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Create new entry
  app.post("/api/entries", async (req, res) => {
    try {
      const validatedData = insertEntrySchema.parse(req.body);
      // TODO: Replace with actual user ID from authentication
      const entry = await storage.createEntry(validatedData, "system");
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid entry data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ 
        message: "Failed to create entry", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Update entry
  app.put("/api/entries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertEntrySchema.partial().parse(req.body);
      
      // TODO: Replace with actual user ID from authentication  
      const updatedEntry = await storage.updateEntry(id, validatedData, "system");
      
      if (!updatedEntry) {
        return res.status(404).json({ message: "Entry not found" });
      }
      
      res.json(updatedEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid entry data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ 
        message: "Failed to update entry", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Delete entry
  app.delete("/api/entries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteEntry(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Entry not found" });
      }
      
      res.json({ message: "Entry deleted successfully" });
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to delete entry", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
