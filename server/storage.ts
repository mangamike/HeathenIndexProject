import { type Entry, type InsertEntry, type User, type UpsertUser } from "@shared/schema";
import { users, entries } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Entry methods
  getEntry(id: string): Promise<Entry | undefined>;
  getAllEntries(): Promise<Entry[]>;
  searchEntries(query: string, category?: string): Promise<Entry[]>;
  createEntry(entry: InsertEntry, userId: string): Promise<Entry>;
  updateEntry(id: string, updates: Partial<InsertEntry>, userId: string): Promise<Entry | undefined>;
  deleteEntry(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getEntry(id: string): Promise<Entry | undefined> {
    const [entry] = await db.select().from(entries).where(eq(entries.id, id));
    return entry;
  }

  async getAllEntries(): Promise<Entry[]> {
    return await db.select().from(entries).orderBy(entries.title);
  }

  async searchEntries(query: string, category?: string): Promise<Entry[]> {
    let dbQuery = db.select().from(entries);
    
    // This is a simplified search - in production you'd want full-text search
    if (query || (category && category !== 'all')) {
      // For now, just return all entries and filter in memory
      // In production, you'd use PostgreSQL full-text search
      const allEntries = await db.select().from(entries).orderBy(entries.title);
      
      let filteredEntries = allEntries;
      
      // Filter by category if provided
      if (category && category !== 'all') {
        filteredEntries = filteredEntries.filter(entry => 
          entry.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      // Search by query if provided
      if (query) {
        const searchTerm = query.toLowerCase();
        filteredEntries = filteredEntries.filter(entry => {
          return (
            entry.title.toLowerCase().includes(searchTerm) ||
            entry.description.toLowerCase().includes(searchTerm) ||
            entry.relatedTerms?.some(term => term.toLowerCase().includes(searchTerm)) ||
            false
          );
        });
      }
      
      return filteredEntries;
    }
    
    return await db.select().from(entries).orderBy(entries.title);
  }

  async createEntry(insertEntry: InsertEntry, userId: string): Promise<Entry> {
    const [entry] = await db
      .insert(entries)
      .values({
        ...insertEntry,
        createdBy: userId,
        relatedTerms: insertEntry.relatedTerms || null,
        sources: insertEntry.sources || null,
      })
      .returning();
    return entry;
  }

  async updateEntry(id: string, updates: Partial<InsertEntry>, userId: string): Promise<Entry | undefined> {
    const [entry] = await db
      .update(entries)
      .set({
        ...updates,
        relatedTerms: updates.relatedTerms || null,
        sources: updates.sources || null,
        updatedAt: new Date(),
      })
      .where(eq(entries.id, id))
      .returning();
    return entry;
  }

  async deleteEntry(id: string): Promise<boolean> {
    const result = await db.delete(entries).where(eq(entries.id, id));
    return result.rowCount > 0;
  }
}

// Keep the MemStorage class for development/fallback
class MemStorage implements IStorage {
  private users: Map<string, User>;
  private entries: Map<string, Entry>;

  constructor() {
    this.users = new Map();
    this.entries = new Map();
    
    // Initialize with some Norse mythology entries
    this.initializeEntries();
  }

  private initializeEntries() {
    const sampleEntries: InsertEntry[] = [
      {
        title: "Odin",
        category: "deity",
        description: "The All-Father and chief deity of the Norse pantheon, associated with wisdom, war, death, and poetry. Known for sacrificing his eye for knowledge and hanging from Yggdrasil for nine days and nights to discover the runes.",
        relatedTerms: ["wisdom", "war", "ravens", "huginn", "muninn", "sleipnir", "gungnir", "valhalla", "asgard", "runes"],
        sources: "Snorri Sturluson - Prose Edda; Poetic Edda - Various poems including Völuspá and Hávamál; Saxo Grammaticus - Gesta Danorum"
      },
      {
        title: "Valhalla",
        category: "place",
        description: "The magnificent hall of the slain located in Asgard, ruled over by Odin. Warriors who die gloriously in battle are brought here by the Valkyries to feast and fight until Ragnarök.",
        relatedTerms: ["afterlife", "warriors", "asgard", "odin", "valkyries", "einherjar", "ragnarok"],
        sources: "Prose Edda; Poetic Edda - Grímnismál; Heimskringla"
      },
      {
        title: "Mjölnir",
        category: "artifact",
        description: "Thor's mighty hammer, forged by the dwarven brothers Brokkr and Eitri. It never misses its target and always returns to Thor's hand after being thrown. Symbol of protection and divine power.",
        relatedTerms: ["thor", "lightning", "protection", "dwarves", "brokkr", "eitri", "jotuns", "giants"],
        sources: "Prose Edda - Skáldskaparmál; Poetic Edda - Þrymskviða; Archaeological evidence from Scandinavia"
      },
      {
        title: "Ragnarök",
        category: "concept",
        description: "The prophesied end of the world in Norse mythology, involving a great battle between the gods and giants, leading to the death of major deities and the submersion of the world in water, followed by rebirth.",
        relatedTerms: ["prophecy", "apocalypse", "rebirth", "fimbulwinter", "surtr", "fenrir", "jormungandr", "twilight-of-gods"],
        sources: "Prose Edda - Gylfaginning; Poetic Edda - Völuspá"
      },
      {
        title: "Freya",
        category: "deity",
        description: "Goddess of love, beauty, fertility, war, and death. Sister of Freyr and one of the most venerated deities in Norse mythology. Associated with seidr magic and the afterlife realm Fólkvangr.",
        relatedTerms: ["love", "fertility", "seidr", "folkvangr", "freyr", "vanir", "beauty", "magic", "cats"],
        sources: "Prose Edda; Poetic Edda; Heimskringla; Archaeological evidence from Sweden"
      },
      {
        title: "Yggdrasil",
        category: "place",
        description: "The immense sacred tree that connects the nine worlds in Norse cosmology. An ash tree that stands at the center of the cosmos, with roots extending into various realms and wells.",
        relatedTerms: ["cosmology", "sacred", "nine-worlds", "world-tree", "wells", "norns", "urd", "verdandi", "skuld"],
        sources: "Prose Edda - Gylfaginning; Poetic Edda - Völuspá, Grímnismál"
      }
    ];

    sampleEntries.forEach(entry => {
      const id = randomUUID();
      const fullEntry: Entry = {
        ...entry,
        id,
        createdBy: 'system', // Sample entries created by system
        relatedTerms: entry.relatedTerms || null,
        sources: entry.sources || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.entries.set(id, fullEntry);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const id = userData.id || randomUUID();
    const user: User = { 
      ...userData, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Entry methods
  async getEntry(id: string): Promise<Entry | undefined> {
    return this.entries.get(id);
  }

  async getAllEntries(): Promise<Entry[]> {
    return Array.from(this.entries.values()).sort((a, b) => 
      a.title.localeCompare(b.title)
    );
  }

  async searchEntries(query: string, category?: string): Promise<Entry[]> {
    const allEntries = Array.from(this.entries.values());
    
    let filteredEntries = allEntries;
    
    // Filter by category if provided
    if (category && category !== 'all') {
      filteredEntries = filteredEntries.filter(entry => 
        entry.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Search by query if provided
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredEntries = filteredEntries.filter(entry => {
        return (
          entry.title.toLowerCase().includes(searchTerm) ||
          entry.description.toLowerCase().includes(searchTerm) ||
          entry.relatedTerms?.some(term => term.toLowerCase().includes(searchTerm)) ||
          false
        );
      });
    }
    
    return filteredEntries.sort((a, b) => a.title.localeCompare(b.title));
  }

  async createEntry(insertEntry: InsertEntry, userId: string): Promise<Entry> {
    const id = randomUUID();
    const entry: Entry = {
      ...insertEntry,
      id,
      createdBy: userId,
      relatedTerms: insertEntry.relatedTerms || null,
      sources: insertEntry.sources || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.entries.set(id, entry);
    return entry;
  }

  async updateEntry(id: string, updates: Partial<InsertEntry>, userId: string): Promise<Entry | undefined> {
    const entry = this.entries.get(id);
    if (!entry) return undefined;
    
    const updatedEntry: Entry = {
      ...entry,
      ...updates,
      relatedTerms: updates.relatedTerms || entry.relatedTerms,
      sources: updates.sources || entry.sources,
      updatedAt: new Date(),
    };
    
    this.entries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteEntry(id: string): Promise<boolean> {
    return this.entries.delete(id);
  }
}

export const storage = new DatabaseStorage();
