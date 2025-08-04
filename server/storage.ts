import { 
  type User, 
  type InsertUser, 
  type Diagnosis, 
  type InsertDiagnosis,
  type FarmingTip,
  type InsertFarmingTip,
  type EmergencyContact,
  type InsertEmergencyContact
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createDiagnosis(diagnosis: InsertDiagnosis): Promise<Diagnosis>;
  getDiagnoses(userId?: string): Promise<Diagnosis[]>;
  getDiagnosis(id: string): Promise<Diagnosis | undefined>;
  
  getFarmingTips(season?: string): Promise<FarmingTip[]>;
  createFarmingTip(tip: InsertFarmingTip): Promise<FarmingTip>;
  
  getEmergencyContacts(): Promise<EmergencyContact[]>;
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private diagnoses: Map<string, Diagnosis>;
  private farmingTips: Map<string, FarmingTip>;
  private emergencyContacts: Map<string, EmergencyContact>;

  constructor() {
    this.users = new Map();
    this.diagnoses = new Map();
    this.farmingTips = new Map();
    this.emergencyContacts = new Map();
    
    // Initialize with some default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Add default farming tips
    const defaultTips: Omit<FarmingTip, "id">[] = [
      {
        season: "flowering",
        title: "Monitor for Pests",
        description: "Check for coffee berry borer and antestia bugs",
        priority: "high",
        category: "pest_control",
        createdAt: new Date(),
      },
      {
        season: "flowering",
        title: "Reduce Watering",
        description: "Flowers are sensitive to overwatering",
        priority: "medium",
        category: "watering",
        createdAt: new Date(),
      },
      {
        season: "flowering",
        title: "Apply Foliar Feed",
        description: "Use potassium-rich fertilizer weekly",
        priority: "high",
        category: "fertilizing",
        createdAt: new Date(),
      },
    ];

    defaultTips.forEach(tip => {
      const id = randomUUID();
      this.farmingTips.set(id, { ...tip, id });
    });

    // Add default emergency contacts
    const defaultContacts: Omit<EmergencyContact, "id">[] = [
      {
        name: "Agricultural Extension",
        organization: "Nandi County Office",
        phoneNumber: "+254-700-123-456",
        contactType: "extension",
        isActive: "true",
      },
      {
        name: "Farmer Cooperative",
        organization: "Local support group",
        phoneNumber: "+254-700-234-567",
        contactType: "cooperative",
        isActive: "true",
      },
      {
        name: "Veterinary Services",
        organization: "Plant disease emergency",
        phoneNumber: "+254-700-345-678",
        contactType: "veterinary",
        isActive: "true",
      },
    ];

    defaultContacts.forEach(contact => {
      const id = randomUUID();
      this.emergencyContacts.set(id, { ...contact, id });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createDiagnosis(insertDiagnosis: InsertDiagnosis): Promise<Diagnosis> {
    const id = randomUUID();
    const diagnosis: Diagnosis = { 
      ...insertDiagnosis, 
      id, 
      createdAt: new Date() 
    };
    this.diagnoses.set(id, diagnosis);
    return diagnosis;
  }

  async getDiagnoses(userId?: string): Promise<Diagnosis[]> {
    const allDiagnoses = Array.from(this.diagnoses.values());
    if (userId) {
      return allDiagnoses.filter(d => d.userId === userId);
    }
    return allDiagnoses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getDiagnosis(id: string): Promise<Diagnosis | undefined> {
    return this.diagnoses.get(id);
  }

  async getFarmingTips(season?: string): Promise<FarmingTip[]> {
    const allTips = Array.from(this.farmingTips.values());
    if (season) {
      return allTips.filter(tip => tip.season === season);
    }
    return allTips;
  }

  async createFarmingTip(insertTip: InsertFarmingTip): Promise<FarmingTip> {
    const id = randomUUID();
    const tip: FarmingTip = { 
      ...insertTip, 
      id, 
      createdAt: new Date() 
    };
    this.farmingTips.set(id, tip);
    return tip;
  }

  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    return Array.from(this.emergencyContacts.values()).filter(
      contact => contact.isActive === "true"
    );
  }

  async createEmergencyContact(insertContact: InsertEmergencyContact): Promise<EmergencyContact> {
    const id = randomUUID();
    const contact: EmergencyContact = { ...insertContact, id };
    this.emergencyContacts.set(id, contact);
    return contact;
  }
}

export const storage = new MemStorage();
