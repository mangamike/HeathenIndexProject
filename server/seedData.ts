import { storage } from "./storage";
import type { InsertEntry } from "@shared/schema";

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

export async function seedDatabase() {
  console.log("Seeding database with Norse mythology entries...");
  
  try {
    // Check if entries already exist
    const existingEntries = await storage.getAllEntries();
    if (existingEntries.length > 0) {
      console.log("Database already has entries, skipping seed.");
      return;
    }

    // Add sample entries
    for (const entry of sampleEntries) {
      await storage.createEntry(entry, "system");
    }
    
    console.log(`Successfully seeded database with ${sampleEntries.length} entries.`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}